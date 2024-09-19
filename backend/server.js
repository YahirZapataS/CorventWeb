// Importar Express
const express = require('express');
const app = express();
const port = 3000;

// Crear una ruta GET para /api/pacientes
app.get('/api/patients', (req, res) => {
  // Aquí debería estar la lógica para obtener los pacientes
  res.json([
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'María', apellido: 'González' }
  ]);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});