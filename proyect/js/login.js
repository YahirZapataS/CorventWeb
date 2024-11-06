import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebase.js';

const btnLogin = document.getElementById('btn-login');
const formGroup = document.getElementById('login-form');

btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('user-input').value;
    const password = document.getElementById('password-input').value;

    Swal.fire({
        title: 'Iniciando sesión...',
        text: 'Por favor, espera mientras te autenticamos.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            Swal.close();
            showAlert('¡Ups!', 'Debes verificar tu correo antes de iniciar sesión.', 'warning');
            formGroup.reset();
            return;
        }

        Swal.close();
        window.location.href = '../html/HomeScreen.html';
        console.log('Usuario autenticado:', user);

    } catch (error) {
        Swal.close();
        showAlert('¡Ups!', 'Correo o contraseña incorrectos. Inténtalo de nuevo.', 'error');
        console.error('Error en la autenticación:', error);
    }
});

const showPassword = document.getElementById('showPassword');
showPassword.addEventListener('change', function () {
    const passwordInput = document.getElementById('password-input');
    passwordInput.type = this.checked ? 'text' : 'password';
});

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}