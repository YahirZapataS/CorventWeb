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

document.addEventListener("DOMContentLoaded", () => {
  const teeth = document.querySelectorAll(".tooth");

  teeth.forEach(tooth => {
      tooth.addEventListener("click", () => {
          const selectedTooth = tooth.getAttribute("data-tooth");

          Swal.fire({
            title: `Diente ${selectedTooth}`,
            html: `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div>
                        <label for="diagnosis" style="font-weight: bold; display: block; margin-bottom: 5px;">Diagnóstico:</label>
                        <textarea id="diagnosis" class="swal2-textarea" placeholder="Escribe el diagnóstico"></textarea>
                    </div>
                    <div>
                        <label for="procedure" style="font-weight: bold; display: block; margin-bottom: 5px;">Procedimiento:</label>
                        <input type="text" id="procedure" class="swal2-input" placeholder="Escribe el procedimiento">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const diagnosis = Swal.getPopup().querySelector('#diagnosis').value;
                const procedure = Swal.getPopup().querySelector('#procedure').value;
        
                if (!diagnosis || !procedure) {
                    Swal.showValidationMessage(`Ambos campos son obligatorios`);
                    return false;
                }
        
                return { diagnosis, procedure };
            }
          }).then((result) => {
              if (result.isConfirmed) {
                  const { diagnosis, procedure } = result.value;
                  Swal.fire(
                      'Guardado',
                      `Diente ${selectedTooth} guardado con éxito.<br>
                      <b>Diagnóstico:</b> ${diagnosis}<br>
                      <b>Procedimiento:</b> ${procedure}`,
                      'success'
                  );
              }
          });
      });
  });
});
