function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

document.getElementById('profile-icon').addEventListener('click', toggleSidebar);