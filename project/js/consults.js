// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
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
const db = getFirestore(app);

// Obtener datos del odontograma
function getOdontogramData() {
    const teethElements = document.querySelectorAll(".teeth-grid .tooth");
    const odontogram = {};

    teethElements.forEach(tooth => {
        const toothId = tooth.getAttribute("data-tooth");
        const diagnosis = tooth.getAttribute("data-diagnosis") || "";
        const procedure = tooth.getAttribute("data-procedure") || "";

        odontogram[toothId] = {
            diagnosis,
            procedure
        };
    });

    return odontogram;
}

// Agregar evento al formulario de historia clínica
document.getElementById("clinical-history-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const patientName = document.getElementById("patient-name").value;
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const symptoms = document.getElementById("symptoms").value;
    const diagnosis = document.getElementById("diagnosis").value;
    const treatment = document.getElementById("treatment").value;

    // Obtener datos del odontograma
    const odontogram = getOdontogramData();

    try {
        // Guardar los datos en la colección "HistoriaClinica" en Firestore
        await addDoc(collection(db, "HistoriaClinica"), {
            patientName,
            age,
            gender,
            symptoms,
            diagnosis,
            treatment,
            odontogram,
            createdAt: new Date()
        });

        
        // Limpiar el formulario
        document.getElementById("clinical-history-form").reset();

        // Limpiar los datos del odontograma
        const teethElements = document.querySelectorAll(".teeth-grid .tooth");
        teethElements.forEach(tooth => {
            tooth.removeAttribute("data-diagnosis");
            tooth.removeAttribute("data-procedure");
        });

    } catch (error) {
        // Manejar errores
        console.error("Error al guardar en Firestore:", error);
        alert("Error: Hubo un problema al guardar la historia clínica. Por favor, intenta nuevamente.");
    }
});

// Lógica para interactuar con los dientes del odontograma
document.querySelectorAll(".teeth-grid .tooth").forEach(tooth => {
    tooth.addEventListener("click", () => {
        const toothId = tooth.getAttribute("data-tooth");

        // Mostrar un formulario de SweetAlert para ingresar diagnóstico y procedimiento
        Swal.fire({
            title: `Diente ${toothId}`,
            html: `
                <label for="swal-diagnosis" style="display: block; text-align: left;">Diagnóstico:</label>
                <textarea id="swal-diagnosis" class="swal2-textarea" placeholder="Escribe el diagnóstico"></textarea>
                <label for="swal-procedure" style="display: block; text-align: left; margin-top: 10px;">Procedimiento:</label>
                <textarea id="swal-procedure" class="swal2-textarea" placeholder="Escribe el procedimiento"></textarea>
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                const diagnosis = document.getElementById("swal-diagnosis").value;
                const procedure = document.getElementById("swal-procedure").value;

                if (!diagnosis || !procedure) {
                    Swal.showValidationMessage("Ambos campos son obligatorios");
                    return false;
                }

                return { diagnosis, procedure };
            }
        }).then(result => {
            if (result.isConfirmed) {
                const { diagnosis, procedure } = result.value;

                // Guardar los datos en el diente seleccionado
                tooth.setAttribute("data-diagnosis", diagnosis);
                tooth.setAttribute("data-procedure", procedure);

                // Cambiar el color del diente
                tooth.classList.add("has-data");
                
                // Confirmar que los datos fueron guardados
                Swal.fire({
                    icon: "success",
                    title: "Guardado",
                    text: `El diagnóstico y procedimiento para el diente ${toothId} fueron guardados con éxito.`,
                });
            }
        });
    });
});

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
