import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    console.log('Usuario autenticado:', user);
    if (user) {
        const email = user.email;
        try {
            const q = query(collection(db, "doctors"), where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const doctorData = doc.data();
                    const doctorName = doctorData.name || 'Doctor';
                    const doctorLastName = doctorData.lastname || 'Doctor';
                    document.getElementById('welcome-message').textContent = `Bienvenido, ${doctorName}`;
                    document.getElementById('welcome-message-home').textContent = `Bienvenido, Dr. ${doctorName} ${doctorLastName}`;
                });
            } else {
                console.error('No se encontró un doctor con este correo electrónico.');
            }
        } catch (error) {
            console.error('Error al obtener el nombre del doctor desde Firestore:', error);
        }
    } else {
        window.location.href = 'login.html';
    }
});

document.querySelector('a[href="index.html"]').addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
});
