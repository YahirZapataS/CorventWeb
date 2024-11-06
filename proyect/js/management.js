import { db, auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { collection, addDoc, getDoc, updateDoc, doc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        loadDoctorData(user);
    } else {
        console.log("No hay usuario autenticado");
        window.location.href = 'login.html';
    }
});

document.getElementById('gestionar-horario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedDays = Array.from(document.getElementById('day').selectedOptions).map(option => option.value);
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const userEmail = auth.currentUser.email;

    try {
        const q = query(collection(db, 'doctors'), where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await addDoc(collection(db, 'doctors'), {
                email: userEmail,
                name: auth.currentUser.displayName || 'Doctor',
                availableDays: selectedDays,
                startTime: startTime,
                endTime: endTime,
                services: []
            });
            showAlert('Horarios guardados', 'Los horarios se han guardado correctamente para un nuevo doctor.', 'success');
        } else {
            querySnapshot.forEach(async (doc) => {
                const doctorRef = doc.ref;
                await updateDoc(doctorRef, {
                    availableDays: selectedDays,
                    startTime: startTime,
                    endTime: endTime
                });
            });
            showAlert('Horarios actualizados', 'Los horarios de atención se han guardado correctamente.', 'success');
        }
    } catch (error) {
        showAlert('Error', 'Hubo un problema al guardar los horarios. Intenta de nuevo.', 'error');
        console.error('Error al gestionar horarios:', error);
    }
});

document.getElementById('add-service').addEventListener('click', async () => {
    const serviceName = document.getElementById('service').value;

    if (serviceName === '') {
        showAlert('Error', 'El nombre del servicio no puede estar vacío.', 'warning');
        return;
    }

    try {
        const userEmail = auth.currentUser.email;
        const q = query(collection(db, 'doctors'), where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showAlert('Error', 'No se encontró el doctor en la base de datos.', 'error');
            return;
        }

        querySnapshot.forEach(async (doc) => {
            const doctorRef = doc.ref;
            const doctorData = doc.data();
            
            const services = doctorData.services || [];

            services.push(serviceName);

            await updateDoc(doctorRef, {
                services: services
            });

            renderServices(services);
            document.getElementById('service').value = '';

            showAlert('Servicio agregado', 'El servicio se ha agregado correctamente.', 'success');
        });
    } catch (error) {
        showAlert('Error', 'Hubo un problema al agregar el servicio. Intenta de nuevo.', 'error');
        console.error('Error al agregar servicio:', error);
    }
});

document.getElementById('services-list').addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
        const serviceName = e.target.dataset.service;

        try {
            const doctorRef = doc(db, 'doctors', auth.currentUser.uid);
            const doctorSnapshot = await getDoc(doctorRef);

            let services = doctorSnapshot.data().services || [];
            services = services.filter(service => service !== serviceName);

            await updateDoc(doctorRef, {
                services: services
            });

            renderServices(services);
            showAlert('Servicio eliminado', 'El servicio ha sido eliminado.', 'success');
        } catch (error) {
            showAlert('Error', 'Hubo un problema al eliminar el servicio. Intenta de nuevo.', 'error');
            console.error('Error al eliminar servicio:', error);
        }
    }
});

async function renderServices(services) {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';

    services.forEach(service => {
        const li = document.createElement('li');
        li.textContent = service;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.dataset.service = service;

        li.appendChild(deleteButton);
        servicesList.appendChild(li);
    });
}

async function loadDoctorData() {
    if (auth.currentUser) {
        try {
            const userEmail = auth.currentUser.email;
            const q = query(collection(db, 'doctors'), where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(collection(db, 'doctors'), {
                    email: userEmail,
                    name: auth.currentUser.displayName || 'Doctor',
                    services: []
                });
                console.log("Documento creado para el doctor.");
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                renderServices(data.services || []);
            });
        } catch (error) {
            console.error('Error al cargar datos del doctor:', error);
        }
    } else {
        console.log("No hay un usuario autenticado.");
    }
}

loadDoctorData();

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

document.getElementById('profile-icon').addEventListener('click', toggleSidebar);