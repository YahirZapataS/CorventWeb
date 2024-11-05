import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebase.js';

const btnLogin = document.getElementById('btn-login');

btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('user-input').value;
    const password = document.getElementById('password-input').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario Autenticado', userCredential.user);

        window.location.href = './html/HomeScreen.html';
    } catch (error) {
        showAlert('¡Ups!', 'Correo o contraseña incorrectos. Intentalo de nuevo', 'error');
    }
});

const showPassword = document.getElementById('showPassword');
showPassword.addEventListener('change', function () {
    const passwordInput = document.getElementById('password-input');
    passwordInput.type = this.checked ? 'text' : 'password';
});

/*
const btnRegister = document.getElementById('btnRegister');
btnRegister.addEventListener('click', function () {
    window.location.href = 'signup.html';
});
*/
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}