import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Función para cargar y renderizar las citas
async function cargarCitas() {
    const appointmentsContainer = document.getElementById('appointments-container');
    appointmentsContainer.innerHTML = ''; // Limpiar cualquier contenido previo

    const appointmentsRef = collection(db, 'appointments');
    const appointmentsSnapshot = await getDocs(appointmentsRef);

    appointmentsSnapshot.forEach(doc => {
        const appointment = doc.data();
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');

        // Ícono de prioridad basado en el estado de la cita
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
            <p>Status: ${appointment.status}</p>
            <p>Fecha: ${appointment.date}</p>
            <p>Hora: ${appointment.time}</p>
        `;

        // Añadir ícono de prioridad
        appointmentCard.appendChild(priorityIcon);
        appointmentsContainer.appendChild(appointmentCard);
    });
}

// Cargar citas al cargar la página
document.addEventListener('DOMContentLoaded', cargarCitas);