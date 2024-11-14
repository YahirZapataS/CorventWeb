import { db } from './firebase.js';
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

async function loadDoctorProfile(doctorId) {
    try {
        const doctorRef = doc(db, "doctors", doctorId);
        const doctorSnapshot = await getDoc(doctorRef);
        
        if (doctorSnapshot.exists()) {
            const doctorData = doctorSnapshot.data();
            document.getElementById('doctor-name').textContent = doctorData.name || "Nombre no disponible";
            document.getElementById('doctor-specialty').textContent = `Especialidad: ${doctorData.specialty || "No especificada"}`;
            document.getElementById('doctor-contact').textContent = `Contacto: ${doctorData.email || "No disponible"}`;
            document.getElementById('doctor-phone').textContent = `Teléfono: ${doctorData.phone || "No disponible"}`;
            document.getElementById('doctor-bio').textContent = doctorData.bio || "No hay biografía disponible";
            document.getElementById('facebook-link').href = doctorData.facebook || "#";
            document.getElementById('twitter-link').href = doctorData.twitter || "#";
            document.getElementById('linkedin-link').href = doctorData.linkedin || "#";
            
            // Cargar foto de perfil
            if (doctorData.photoURL) {
                const photoRef = ref(storage, doctorData.photoURL);
                const photoURL = await getDownloadURL(photoRef);
                document.getElementById('doctor-photo').src = photoURL;
            }
        } else {
            console.log("No se encontraron datos del doctor.");
        }
    } catch (error) {
        console.error("Error al cargar el perfil del doctor:", error);
    }
}

// Ejemplo de llamado a la función
loadDoctorProfile("doctorIdEjemplo");

// Actualizar foto de perfil
const uploadPhotoInput = document.getElementById("upload-photo-input");
document.getElementById("upload-photo-btn").addEventListener("click", () => uploadPhotoInput.click());

uploadPhotoInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const storageRef = ref(storage, `doctor_photos/${file.name}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        document.getElementById("doctor-photo").src = photoURL;
        
        // Actualizar la URL en Firestore
        const doctorRef = doc(db, "doctors", "doctorIdEjemplo");
        await updateDoc(doctorRef, { photoURL });
    }
});
