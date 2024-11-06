import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const service = document.getElementById('services').value;

    try {
        // Guardar la cita en Firestore (o la base de datos que uses)
        const citasRef = collection(db, 'citas');
        await addDoc(citasRef, {
            name,
            email,
            date,
            time,
            service,
            status: 'Pendiente' // El estado de la cita puede ser gestionado
        });

        showAlert('Cita agendada', 'Tu cita ha sido programada correctamente.', 'success');
        document.getElementById('cita-form').reset();

    } catch (error) {
        showAlert('Error', 'Hubo un problema al agendar la cita. Intenta de nuevo.', 'error');
        console.error('Error al agendar cita:', error);
    }
});

// Función para mostrar alertas
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

// Aquí podrías cargar las horas disponibles, por ejemplo.
async function cargarHorasDisponibles(date) {
    const citasRef = collection(db, 'citas');
    const q = query(citasRef, where('date', '==', date));
    const citasSnapshot = await getDocs(q);

    const citas = citasSnapshot.docs.map(doc => doc.data());

    const horasDisponibles = [
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    // Filtrar las horas ya ocupadas
    const horasOcupadas = citas.map(cita => cita.time);
    const horasRestantes = horasDisponibles.filter(hora => !horasOcupadas.includes(hora));

    const selectTime = document.getElementById('time');
    selectTime.innerHTML = ''; // Limpiar las opciones anteriores

    horasRestantes.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        selectTime.appendChild(option);
    });
}

// Event listener para actualizar horas disponibles al seleccionar una fecha
document.getElementById('date').addEventListener('change', (e) => {
    const selectedDate = e.target.value;
    cargarHorasDisponibles(selectedDate);
});
