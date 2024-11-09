const btnSchedule = document.getElementById('btn-schedule');

btnSchedule.addEventListener('click', async () => {
    Swal.fire({
        title: 'Cargando',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(() => {
        Swal.close();
        window.location.href = 'appointmentsPatients.html';
    }, 1000);
});