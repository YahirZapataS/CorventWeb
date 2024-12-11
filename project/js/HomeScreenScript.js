import { db } from './firebase.js';
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

async function cargarCitas() {
    const upcomingContainer = document.getElementById('upcoming-appointments-container');
    const pastContainer = document.getElementById('past-appointments-container');
    upcomingContainer.innerHTML = ''; // Limpiar contenido previo
    pastContainer.innerHTML = ''; // Limpiar contenido previo

    const doctorsRef = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsRef);

    let upcomingAppointments = [];
    let pastAppointments = [];

    doctorsSnapshot.forEach(docSnapshot => {
        const doctorData = docSnapshot.data();
        const appointments = doctorData.appointments || [];
        const doctorId = docSnapshot.id; // Obtener ID del doctor

        appointments.forEach(appointment => {
            const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
            const currentTime = new Date();

            const appointmentWithDoctor = {
                ...appointment,
                doctorName: `${doctorData.name} ${doctorData.lastname}`,
                doctorId, // Añadimos el ID del doctor para futuras actualizaciones
            };

            if (appointmentDate >= currentTime) {
                // Cita próxima
                upcomingAppointments.push(appointmentWithDoctor);
            } else {
                // Cita pasada
                pastAppointments.push(appointmentWithDoctor);
            }
        });
    });

    // Renderizar citas próximas
    renderAppointments(upcomingAppointments, upcomingContainer);

    // Renderizar citas pasadas
    renderAppointments(pastAppointments, pastContainer);
}

// Renderizar y agregar eventos a las tarjetas de cita
function renderAppointments(appointments, container) {
    appointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');
        appointmentCard.innerHTML = `
            <h3>${appointment.name}</h3>
            <p>Doctor: ${appointment.doctorName}</p>
            <p>Status: ${appointment.status}</p>
            <p>Fecha: ${appointment.date}</p>
            <p>Hora: ${appointment.time}</p>
        `;
        container.appendChild(appointmentCard);

        // Agregar evento click para mostrar los detalles de la cita
        appointmentCard.addEventListener('click', () => showAppointmentDetails(appointment));
    });
}

// Mostrar detalles de la cita con SweetAlert
async function showAppointmentDetails(appointment) {
    const { name, doctorName, status, date, time, doctorId } = appointment;

    const { isConfirmed, value: newStatus } = await Swal.fire({
        title: `Detalles de la Cita`,
        html: `
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Estado Actual:</strong> ${status}</p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p>¿Desea actualizar el estado de esta cita?</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        input: 'select',
        inputOptions: {
            Atendido: 'Atendido',
            'No Atendido': 'No Atendido',
        },
        inputPlaceholder: 'Seleccione el nuevo estado',
        preConfirm: selectedStatus => selectedStatus,
    });

    if (isConfirmed && newStatus) {
        await updateAppointmentStatus(doctorId, appointment, newStatus);
        Swal.fire('Actualizado', `El estado ha sido cambiado a ${newStatus}.`, 'success');
        cargarCitas(); // Volver a cargar las citas para reflejar los cambios
    }
}

// Actualizar el estado de la cita en Firestore
async function updateAppointmentStatus(doctorId, appointment, newStatus) {
    const doctorRef = doc(db, 'doctors', doctorId);
    const doctorSnapshot = await getDocs(collection(db, 'doctors'));

    let appointments = [];

    // Encontrar las citas del doctor y actualizar el estado
    doctorSnapshot.forEach(docSnapshot => {
        if (docSnapshot.id === doctorId) {
            const doctorData = docSnapshot.data();
            appointments = doctorData.appointments.map(app => {
                if (app.date === appointment.date && app.time === appointment.time) {
                    return { ...app, status: newStatus }; // Actualizar el estado
                }
                return app;
            });
        }
    });

    // Actualizar las citas del doctor en Firestore
    await updateDoc(doctorRef, { appointments });
}

// Cargar citas al cargar la página
document.addEventListener('DOMContentLoaded', cargarCitas);