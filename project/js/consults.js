// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js"; 
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCDZx3Ai8X9RHYFriwyzAYpqhjkVbft9c",
    authDomain: "convert-cd82a.firebaseapp.com",
    projectId: "convert-cd82a",
    storageBucket: "convert-cd82a.firebasestorage.app",
    messagingSenderId: "29880111362",
    appId: "1:29880111362:web:64d388d29fb9fb5f86321b",
    measurementId: "G-MCRY7D50F2"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Auth (si lo necesitas)
const auth = getAuth(app);


// Función para alternar la visibilidad de la barra lateral
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");

    // Si el sidebar está abierto, agrega el event listener para detectar clics fuera
    if (sidebar.classList.contains("active")) {
        document.addEventListener("click", handleOutsideClick);
    } else {
        document.removeEventListener("click", handleOutsideClick);
    }
}

// Maneja el clic fuera del sidebar para cerrarlo
function handleOutsideClick(event) {
    const sidebar = document.getElementById("sidebar");
    const profileIcon = document.getElementById("profile-icon");

    // Verifica si el clic ocurrió fuera del sidebar y del icono de perfil
    if (!sidebar.contains(event.target) && !profileIcon.contains(event.target)) {
        sidebar.classList.remove("active");
        document.removeEventListener("click", handleOutsideClick); // Quita el event listener
    }
}

// Agrega el evento de clic al icono de perfil para abrir/cerrar el sidebar
document.getElementById('profile-icon').addEventListener('click', toggleSidebar);

// Seleccionamos todos los dientes (círculos del SVG)
const teeth = document.querySelectorAll('circle');

// Paciente activo
const pacienteID = "12345"; // Reemplaza con el ID del paciente actual

// Asignamos interactividad a cada diente
teeth.forEach((tooth) => {
  tooth.addEventListener('click', async () => {
    const toothId = tooth.id;

    // Solicitar el tratamiento realizado usando SweetAlert2
    const { value: action } = await Swal.fire({
      title: `Tratamiento en el diente ${toothId}`,
      input: 'text',
      inputLabel: 'Escribe el tratamiento realizado:',
      inputPlaceholder: 'Ejemplo: Obturación, Limpieza',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (action) {
      // Cambia el color del diente para indicar que se trató
      tooth.setAttribute('fill', 'yellow'); // Cambia el color según el tratamiento

      // Guarda los datos en Firebase
      saveToothData(toothId, action);
    }
  });
});

// Función para guardar datos en Firebase
async function saveToothData(toothId, action) {
  try {
    // Guarda en Firebase (Firestore)
    await db.collection("odontogramas").doc(pacienteID).set({
      [toothId]: {
        treatment: action,
        date: new Date().toISOString(),
      }
    }, { merge: true });

    // Mensaje de éxito usando SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: `Diente ${toothId}: ${action} ha sido registrado.`,
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    // Mensaje de error usando SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Hubo un problema al guardar el diente ${toothId}. Intenta de nuevo.`,
    });
    console.error("Error al guardar en Firebase:", error);
  }
}
