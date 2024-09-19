CREATE TABLE Pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    sexo ENUM('Masculino', 'Femenino'),
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    email VARCHAR(100) UNIQUE
);