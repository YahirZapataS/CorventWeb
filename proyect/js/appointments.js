import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Mostrar alertas con SweetAlert
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

// Cargar doctores y mostrarlos en el menú de selección
async function cargarDoctores() {
    const doctorSelect = document.getElementById('doctor');
    const doctorsRef = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsRef);

    doctorsSnapshot.forEach(doc => {
        const doctorData = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${doctorData.name} ${doctorData.lastname}`;
        doctorSelect.appendChild(option);
    });
}

// Cargar servicios de acuerdo al doctor seleccionado
async function cargarServicios(doctorId) {
    const servicesSelect = document.getElementById('services');
    servicesSelect.innerHTML = ''; // Limpiar servicios previos

    if (!doctorId) return;

    const doctorDocRef = doc(db, 'doctors', doctorId);
    const doctorDoc = await getDoc(doctorDocRef);

    if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data();
        const servicios = doctorData.services || []; // Array de servicios

        servicios.forEach(servicio => {
            const option = document.createElement('option');
            option.value = servicio;
            option.textContent = servicio;
            servicesSelect.appendChild(option);
        });
    }
}

// Mapa de días de la semana de JavaScript a los nombres en español
const diasSemana = ["Domingos", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábados"];

// Cargar horas disponibles en función de la fecha y el doctor seleccionado
async function cargarHorasDisponibles(date, doctorId) {
    if (!doctorId || !date) return;

    const doctorDocRef = doc(db, 'doctors', doctorId);
    const doctorDoc = await getDoc(doctorDocRef);

    if (!doctorDoc.exists()) return;

    const doctorData = doctorDoc.data();
    const availableDays = doctorData.availableDays || [];
    let dayOfWeek = new Date(date).getDay(); // Obtiene el número de día (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)

    // Sumamos 1 al día de la semana para obtener el siguiente día
    dayOfWeek = (dayOfWeek + 1) % 7; // Esto asegura que si es sábado (6), vuelva a domingo (0)

    const diaSeleccionado = diasSemana[dayOfWeek]; // Convierte el número del día a su nombre en español

    // Verificar si el día seleccionado está en los días disponibles del doctor
    if (!availableDays.includes(diaSeleccionado)) {
        showAlert('Día no disponible', `El doctor no atiende los ${diaSeleccionado}.`, 'warning');
        document.getElementById('time').innerHTML = ''; // Limpiar horas
        return;
    }

    const startTime = parseInt(doctorData.startTime.split(':')[0]);
    const endTime = parseInt(doctorData.endTime.split(':')[0]);

    // Generar las horas disponibles del doctor en intervalos de 1 hora
    const horasDisponibles = [];
    for (let hora = startTime; hora < endTime; hora++) {
        horasDisponibles.push(`${hora.toString().padStart(2, '0')}:00`);
    }

    // Consultar citas ya reservadas para esa fecha y doctor
    const citasRef = collection(db, 'appointments');
    const q = query(citasRef, where('date', '==', date), where('doctorId', '==', doctorId));
    const citasSnapshot = await getDocs(q);
    const citas = citasSnapshot.docs.map(doc => doc.data());
    const horasOcupadas = citas.map(cita => cita.time);

    // Filtrar horas ocupadas
    const horasRestantes = horasDisponibles.filter(hora => !horasOcupadas.includes(hora));

    // Llenar el selector de horas
    const selectTime = document.getElementById('time');
    selectTime.innerHTML = '';
    horasRestantes.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        selectTime.appendChild(option);
    });
}

// Manejar cambios en la selección de doctor para actualizar servicios y horarios
document.getElementById('doctor').addEventListener('change', async () => {
    const selectedDoctor = document.getElementById('doctor').value;
    const selectedDate = document.getElementById('date').value;

    await cargarServicios(selectedDoctor); // Cargar servicios del doctor
    if (selectedDate) cargarHorasDisponibles(selectedDate, selectedDoctor); // Cargar horas
});

// Manejar cambios en la fecha para cargar horarios disponibles
document.getElementById('date').addEventListener('change', () => {
    const selectedDate = document.getElementById('date').value;
    const selectedDoctor = document.getElementById('doctor').value;
    if (selectedDoctor) cargarHorasDisponibles(selectedDate, selectedDoctor);
});

// Agendar la cita
document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const service = document.getElementById('services').value;
    const doctorId = document.getElementById('doctor').value;

    try {
        const citasRef = collection(db, 'appointments');
        await addDoc(citasRef, {
            name,
            email,
            date,
            time,
            service,
            doctorId,
            status: 'Pendiente'
        });

        showAlert('Cita agendada', 'Tu cita ha sido programada correctamente.', 'success');
        document.getElementById('appointment-form').innerHTML = '';

    } catch (error) {
        showAlert('Error', 'Hubo un problema al agendar la cita. Intenta de nuevo.', 'error');
        console.error('Error al agendar cita:', error);
    }
});

// Inicializar la carga de doctores al cargar la página
cargarDoctores();