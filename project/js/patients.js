import { db } from './firebase.js';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Referencia a la colección "patients" en Firestore
const patientsCollection = collection(db, "patients");

// Referencia al formulario y tabla
const patientForm = document.getElementById("patient-form");
const patientsTableBody = document.getElementById("patients-table-body");
const submitBtn = document.getElementById("submitBtn");
const cancelUpdate = document.getElementById("cancelUpdate");

// Función para mostrar los pacientes
async function displayPatients() {
    patientsTableBody.innerHTML = ""; // Limpia la tabla antes de mostrar los datos

    const querySnapshot = await getDocs(patientsCollection);
    querySnapshot.forEach((doc) => {
        const patient = doc.data();
        const patientRow = document.createElement("tr");

        patientRow.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.email}</td>
            <td>${patient.phone}</td>
            <td>
                <button onclick="editPatient('${doc.id}', '${patient.name}', ${patient.age}, '${patient.email}', '${patient.phone}')">Editar</button>
                <button onclick="deletePatient('${doc.id}')">Eliminar</button>
            </td>
        `;
        patientsTableBody.appendChild(patientRow);
    });
}

// Función para agregar un paciente
async function addPatient() {
    let lastId = await getLastId();
    lastId++;
    const newPatient = {
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        id: lastId
    };

    try {
        await addDoc(patientsCollection, newPatient);
        showAlert('Listo!', 'Paciente agregado con éxito.', 'success');
        patientForm.reset();
        displayPatients();
    } catch (error) {
        console.error("Error al agregar paciente:", error);
        showAlert('Error', 'Hubo un problema al agregar el paciente.', 'error');
    }
}

// Función para actualizar un paciente con SweetAlert
window.editPatient = async (id, name, age, email, phone) => {
    const { value: formValues } = await Swal.fire({
        title: 'Actualizar Paciente',
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${name}">
            <input id="swal-input2" type="number" class="swal2-input" placeholder="Edad" value="${age}">
            <input id="swal-input3" type="email" class="swal2-input" placeholder="Email" value="${email}">
            <input id="swal-input4" class="swal2-input" placeholder="Teléfono" value="${phone}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const updatedName = document.getElementById('swal-input1').value.trim();
            const updatedAge = Number(document.getElementById('swal-input2').value);
            const updatedEmail = document.getElementById('swal-input3').value.trim();
            const updatedPhone = document.getElementById('swal-input4').value.trim();

            if (!updatedName || !updatedAge || !updatedEmail || !updatedPhone) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return null;
            }

            return { updatedName, updatedAge, updatedEmail, updatedPhone };
        }
    });

    if (formValues) {
        const updatedPatient = {
            name: formValues.updatedName,
            age: formValues.updatedAge,
            email: formValues.updatedEmail,
            phone: formValues.updatedPhone
        };

        try {
            const patientDoc = doc(db, "patients", id); // Documento Firestore a actualizar
            await updateDoc(patientDoc, updatedPatient);
            showAlert('Actualizado', `El paciente ha sido actualizado correctamente.`, 'success');
            displayPatients();
        } catch (error) {
            console.error("Error al actualizar paciente:", error);
            showAlert('Error', 'Hubo un problema al actualizar el paciente.', 'error');
        }
    }
};

// Evento para enviar el formulario
patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submitBtn.innerText === "Agregar Paciente") {
        await addPatient();
    }
});

// Función para eliminar un paciente
window.deletePatient = async (id) => {
    const result = await Swal.fire({
        title: "¿Está seguro?",
        text: "No podrá recuperar los datos del paciente una vez eliminado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
        try {
            const patientDoc = doc(db, "patients", id);
            await deleteDoc(patientDoc);
            showAlert('Eliminado!', 'El paciente ha sido eliminado correctamente', 'success');
            displayPatients();
        } catch (error) {
            console.error("Error al eliminar paciente:", error);
        }
    }
};

// Función para mostrar mensajes con SweetAlert2
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

// Función para obtener el último ID en la colección
async function getLastId() {
    const patientsRef = collection(db, 'patients');
    const snapshot = await getDocs(patientsRef);
    let maxId = 0;
    snapshot.forEach(doc => {
        const patient = doc.data();
        if (patient.id > maxId) {
            maxId = patient.id;
        }
    });
    return maxId;
}

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

// Llama a la función para mostrar los pacientes al cargar la página
displayPatients();
