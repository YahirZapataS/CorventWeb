import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Función para alternar la visibilidad de la barra lateral
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");

    // Si el sidebar está abierto, agrega el event listener para detectar clics fuera
    if (sidebar.classList.contains("active")) {
        document.addEventListener("click", handleOutsideClick);
    } else {
        document.removeEventListener("click", handleOutsideClick);
    }
}

// Maneja el clic fuera del sidebar para cerrarlo
function handleOutsideClick(event) {
    const sidebar = document.getElementById("sidebar");
    const profileIcon = document.getElementById("profile-icon");

    // Verifica si el clic ocurrió fuera del sidebar y del icono de perfil
    if (!sidebar.contains(event.target) && !profileIcon.contains(event.target)) {
        sidebar.classList.remove("active");
        document.removeEventListener("click", handleOutsideClick); // Quita el event listener
    }
}

// Agrega el evento de clic al icono de perfil para abrir/cerrar el sidebar
document.getElementById('profile-icon').addEventListener('click', toggleSidebar);
// Función para cargar y renderizar las citas ordenadas por prioridad
async function cargarCitas() {
    const appointmentsContainer = document.getElementById('appointments-container');
    appointmentsContainer.innerHTML = ''; // Limpiar cualquier contenido previo

    const doctorsRef = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsRef);

    // Array para almacenar todas las citas con prioridad calculada
    let allAppointments = [];

    doctorsSnapshot.forEach(doc => {
        const doctorData = doc.data();
        const appointments = doctorData.appointments || [];

        appointments.forEach(appointment => {
            const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
            const currentTime = new Date();

            let priority = 'Baja';
            const timeDifference = (appointmentDate - currentTime) / (1000 * 60); // Diferencia en minutos

            if (timeDifference <= 60) {
                priority = 'Alta';
            } else if (timeDifference <= 180) {
                priority = 'Media';
            }

            // Agregar la cita con su información de prioridad al array
            allAppointments.push({
                ...appointment,
                doctorName: `${doctorData.name} ${doctorData.lastname}`,
                priority,
                timeDifference,
            });
        });
    });

    // Ordenar las citas por prioridad (Alta -> Media -> Baja) y luego por cercanía de tiempo
    allAppointments.sort((a, b) => {
        const priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority] || a.timeDifference - b.timeDifference;
    });

    // Renderizar las citas ordenadas
    allAppointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');

        // Ícono de prioridad basado en la cercanía de la cita
        const priorityIcon = document.createElement('span');
        priorityIcon.classList.add('priority-icon');

        switch (appointment.priority) {
            case 'Alta':
                priorityIcon.textContent = '⚠️';
                break;
            case 'Media':
                priorityIcon.textContent = '🟡';
                break;
            case 'Baja':
                priorityIcon.textContent = '✅';
                break;
            default:
                priorityIcon.textContent = '📅';
                break;
        }

        // Agregar contenido de la cita a la tarjeta
        appointmentCard.innerHTML = `
            <h3>${appointment.name}</h3>
            <p>Doctor: ${appointment.doctorName}</p>
            <p>Status: ${appointment.status}</p>
            <p>Fecha: ${appointment.date}</p>
            <p>Hora: ${appointment.time}</p>
        `;

        // Añadir ícono de prioridad y agregar la tarjeta al contenedor
        appointmentCard.appendChild(priorityIcon);
        appointmentsContainer.appendChild(appointmentCard);
    });
}

// Cargar citas al cargar la página
document.addEventListener('DOMContentLoaded', cargarCitas);