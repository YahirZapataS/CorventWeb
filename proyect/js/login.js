import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebase.js';

const btnLogin = document.getElementById('btn-login');
const formGroup = document.getElementById('login-form');

btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('user-input').value;
    const password = document.getElementById('password-input').value;

    try {
        // Autenticar al usuario
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verificar si el correo ha sido verificado
        if (!user.emailVerified) {
            showAlert('¡Ups!', 'Debes verificar tu correo antes de iniciar sesión.', 'warning');
            formGroup.reset();
            return;
        }

        // Redirigir a HomeScreen.html si el correo ha sido verificado
        window.location.href = '../html/HomeScreen.html';
        console.log('Usuario autenticado:', user);

    } catch (error) {
        showAlert('¡Ups!', 'Correo o contraseña incorrectos. Inténtalo de nuevo.', 'error');
        console.error('Error en la autenticación:', error);
    }
});

// Mostrar u ocultar la contraseña
const showPassword = document.getElementById('showPassword');
showPassword.addEventListener('change', function () {
    const passwordInput = document.getElementById('password-input');
    passwordInput.type = this.checked ? 'text' : 'password';
});

// Función para mostrar alertas con SweetAlert
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}