import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Gestionar Horarios
document.getElementById('gestionar-horario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedDays = Array.from(document.getElementById('day').selectedOptions).map(option => option.value);
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    try {
        const doctorRef = doc(db, 'doctores', auth.currentUser.uid);
        await updateDoc(doctorRef, {
            availableDays: selectedDays,
            startTime: startTime,
            endTime: endTime
        });

        showAlert('Horarios actualizados', 'Los horarios de atención se han guardado correctamente.', 'success');
    } catch (error) {
        showAlert('Error', 'Hubo un problema al guardar los horarios. Intenta de nuevo.', 'error');
        console.error('Error al gestionar horarios:', error);
    }
});

// Gestionar Servicios
document.getElementById('add-service').addEventListener('click', async () => {
    const serviceName = document.getElementById('service').value;

    if (serviceName === '') {
        showAlert('Error', 'El nombre del servicio no puede estar vacío.', 'warning');
        return;
    }

    try {
        const doctorRef = doc(db, 'doctores', auth.currentUser.uid);
        const doctorSnapshot = await getDoc(doctorRef);

        let services = doctorSnapshot.data().services || [];
        services.push(serviceName);

        await updateDoc(doctorRef, {
            services: services
        });

        renderServices(services);
        document.getElementById('service').value = '';  // Limpiar campo

        showAlert('Servicio agregado', 'El servicio se ha agregado correctamente.', 'success');
    } catch (error) {
        showAlert('Error', 'Hubo un problema al agregar el servicio. Intenta de nuevo.', 'error');
        console.error('Error al agregar servicio:', error);
    }
});

async function renderServices(services) {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';

    services.forEach(service => {
        const li = document.createElement('li');
        li.textContent = service;
        servicesList.appendChild(li);
    });
}

// Cargar los servicios al cargar la página
async function loadDoctorData() {
    try {
        const doctorRef = doc(db, 'doctores', auth.currentUser.uid);
        const doctorSnapshot = await getDoc(doctorRef);

        if (doctorSnapshot.exists()) {
            const data = doctorSnapshot.data();
            renderServices(data.services || []);
        }
    } catch (error) {
        console.error('Error al cargar datos del doctor:', error);
    }
}

loadDoctorData();

// Función para mostrar alertas
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}