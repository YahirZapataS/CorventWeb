import { db } from './firebase.js';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// Referencia a la colección "patients" en Firestore
const patientsCollection = collection(db, "patients");

// Referencia al formulario y tabla
const patientForm = document.getElementById("patient-form");
const patientsTableBody = document.getElementById("patients-table-body");

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
// Inicialización de elementos
const submitBtn = document.getElementById("submitBtn");
const cancelUpdate = document.getElementById("cancelUpdate");

// Función para agregar un paciente
patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitBtn.innerText === "Agregar Paciente") {
        // Lógica de agregar paciente
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
            alert("Paciente agregado exitosamente");
            patientForm.reset();
            displayPatients();
        } catch (error) {
            console.error("Error al agregar paciente:", error);
        }
    } else {
        // Lógica de actualizar paciente
        const updatedPatient = {
            name: document.getElementById("name").value,
            age: Number(document.getElementById("age").value),
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        };

        try {
            const patientDoc = doc(db, "patients", submitBtn.dataset.id); // Usa el ID almacenado en el botón
            await updateDoc(patientDoc, updatedPatient);
            alert(`Paciente ${updatedPatient.name} actualizado exitosamente`);
            resetForm();
            displayPatients();
        } catch (error) {
            console.error("Error al actualizar paciente:", error);
        }
    }
});

// Función para iniciar el modo de edición de paciente
window.editPatient = (id, name, age, email, phone) => {
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;

    submitBtn.innerText = "Actualizar Paciente";
    submitBtn.dataset.id = id; // Guarda el ID en el botón para la actualización
    cancelUpdate.style.display = "inline"; // Muestra el botón de cancelar
};

// Función para restablecer el formulario al modo de "Agregar"
function resetForm() {
    patientForm.reset();
    submitBtn.innerText = "Agregar Paciente";
    delete submitBtn.dataset.id;
    cancelUpdate.style.display = "none";
}

// Evento para cancelar la actualización
cancelUpdate.addEventListener("click", resetForm);

// Función para eliminar un paciente
window.deletePatient = async (id) => {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este paciente?");
    if (confirmDelete) {
        try {
            const patientDoc = doc(db, "patients", id);
            await deleteDoc(patientDoc);
            alert("Paciente eliminado exitosamente");
            displayPatients();
        } catch (error) {
            console.error("Error al eliminar paciente:", error);
        }
    }
};


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

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

async function getLastId() {
    const patientsRef =collection(db,'patients');
    const snapshot =await getDocs(patientsRef);
    let maxId=0;
    snapshot.forEach(doc =>{
        const patient = doc.data();
        if(patient.id > maxId){
            maxId = patient.id;
        }
    });
    return maxId;
}


// Agrega el evento de clic al icono de perfil para abrir/cerrar el sidebar
document.getElementById('profile-icon').addEventListener('click', toggleSidebar);

// Llama a la función para mostrar los pacientes al cargar la página
displayPatients();

