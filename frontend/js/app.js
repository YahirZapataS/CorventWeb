fetch('http://localhost:3000/api/patients')
  .then(response => response.json())
  .then(data => {
    const patientsDiv = document.getElementById('patients');
    data.forEach(patient => {
      const patientElement = document.createElement('p');
      patientElement.textContent = patient.namePatient;
      patientsDiv.appendChild(patientElement);
    });
  });