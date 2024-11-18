import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebase.js';

const resetPasswordForm = document.getElementById('reset-password-form');
const emailInput = document.getElementById('email');

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;

    try {
        await sendPasswordResetEmail(auth, email);
        showAlertWithRedirection('¡Correo enviado!', 'Por favor, revisa tu correo electrónico para restablecer tu contraseña.', 'success');
        

    } catch (error) {
        console.error('Error al enviar correo de restablecimiento:', error);
        showAlert('¡Error!', 'No se pudo enviar el correo. Revisa si el correo es válido o está registrado.', 'error');
    }
});

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

const btnBack = document.getElementById('btn-back');
btnBack.addEventListener('click', async () => {
    window.location.replace('login.html');
});

function showAlertWithRedirection(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'login.html';
        }
    });
}