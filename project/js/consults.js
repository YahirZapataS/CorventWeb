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