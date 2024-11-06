import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebase.js';
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

// Función para agregar un paciente
patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPatient = {
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
    };

    try {
        await addDoc(patientsCollection, newPatient);
        alert("Paciente agregado exitosamente");
        patientForm.reset();
        displayPatients();
    } catch (error) {
        console.error("Error al agregar paciente:", error);
    }
});

// Función para editar un paciente
window.editPatient = async (id, name, age, email, phone) => {
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;

    // Actualiza el paciente después de confirmar la edición
    patientForm.onsubmit = async (e) => {
        e.preventDefault();

        const updatedPatient = {
            name: document.getElementById("name").value,
            age: Number(document.getElementById("age").value),
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
        };

        try {
            const patientDoc = doc(db, "patients", id);
            await updateDoc(patientDoc, updatedPatient);
            alert("Paciente actualizado exitosamente");
            patientForm.reset();
            patientForm.onsubmit = addPatient; // Restablece la función original de envío
            displayPatients();
        } catch (error) {
            console.error("Error al actualizar paciente:", error);
        }
    };
};

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

// Llama a la función para mostrar los pacientes al cargar la página
displayPatients();
