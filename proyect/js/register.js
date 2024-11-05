import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth, db } from './firebase.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const passwordInput = document.getElementById('passwordinput');
    const confirmPasswordInput = document.getElementById('confirmpassword');
    const showPassword = document.getElementById('showPassword');
    const btnBack = document.getElementById('btn-back');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.useremail.value;
            const password = form.passwordinput.value;
            const confirmPassword = form.confirmpassword.value;
            const name = form.username.value;
            const lastname = form.userlastname.value;

            // Validación de longitud de contraseña y coincidencia
            if (password.length < 6) {
                showAlert('¡Ups!', 'La contraseña debe tener al menos 6 caracteres.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('¡Ups!', 'Las contraseñas no coinciden.', 'error');
                return;
            }

            try {
                // Crear el usuario con correo y contraseña en Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Guardar la información del usuario en Firestore
                await saveFormDataToFirestore(email, name, lastname);

                // Enviar correo de verificación
                await sendEmailVerification(user);

                // Limpiar el formulario y notificar al usuario
                form.reset();
                showAlertWithRedirect('¡Listo!', 'Usuario creado con éxito. Verifica tu correo para acceder.', 'success');

            } catch (error) {
                console.error(error);
                showAlert('¡Ups!', 'Algo pasó, Usuario no registrado.', 'error');
            }
        });

        // Mostrar u ocultar la contraseña
        showPassword.addEventListener('change', function () {
            passwordInput.type = this.checked ? 'text' : 'password';
            confirmPasswordInput.type = this.checked ? 'text' : 'password';
        });

        // Volver a la página de inicio
        btnBack.addEventListener('click', async () => {
            window.location.replace('index.html');
        });
    } else {
        console.error('El formulario no se encuentra en el DOM.');
    }
});

// Guardar los datos del usuario en Firestore
async function saveFormDataToFirestore(email, name, lastname) {
    try {
        await addDoc(collection(db, 'users'), {
            email: email,
            name: name,
            lastname: lastname
        });
    } catch (error) {
        console.error(error);
        showAlert('¡Ups!', 'Error al guardar los datos en la base de datos.', 'error');
    }
}

// Funciones de alerta usando SweetAlert
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

function showAlertWithRedirect(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'index.html';
        }
    });
}