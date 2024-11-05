import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebase.js'; // Asegúrate de que tu configuración de Firebase esté aquí

// Obtener el formulario y el botón
const resetPasswordForm = document.getElementById('reset-password-form');
const emailInput = document.getElementById('email');

// Manejar el envío del formulario
resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;

    try {
        // Enviar correo para restablecer la contraseña
        await sendPasswordResetEmail(auth, email);
        showAlert('¡Correo enviado!', 'Por favor, revisa tu correo electrónico para restablecer tu contraseña.', 'success');

        // Limpiar el formulario
        resetPasswordForm.reset();

    } catch (error) {
        // Manejar errores
        console.error('Error al enviar correo de restablecimiento:', error);
        showAlert('¡Error!', 'No se pudo enviar el correo. Revisa si el correo es válido o está registrado.', 'error');
    }
});

// Función para mostrar alertas con SweetAlert
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

const btnBack = document.getElementById('btn-back');
btnBack.addEventListener('click', async () => {
    window.location.replace('index.html');
});