const db = require('../config/db');

const getAll = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM patients');
        res.json(result);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los pacientes', error});
    }
};

const create = async (req, res) => {
    const { namePatient, lastNamePatient, birthday, genre, address, phone, email} = req.body;

    try {
        const  [result] = await db.query(
            'INSERT INTO patients (namePatient, lastNamePatient, birthday, genre,  address, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, lastNamePatient,  birthday, genre, address, phone, email]
        );
        res.json({ message: 'Paciente creado exitosamente', idPatient: result.insertId });
    } catch (error) {
        res.status(500).json({message: 'Error al crear el paciente', error});
    }
};

const getById = async (req, res) => {
    const  { idPatient } = req.params;

    try {
        const [result] = await db.query('SELECT * FROM patients WHERE  idPatient = ?', [idPatient]);
        if(result.length === 0) {
            return  res.status(404).json({message: 'Paciente no encontrado'});
        }
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message:  'Error al obtener el paciente', error });

    }
};

const  update = async (req, res) => {
    const  { idPatient } = req.params;
    const { namePatient, lastNamePatient, birthday, genre, address, phone, email } = req.body;

    try {
        await db.query(
            'UPDATE patients SET namePatient = ?, lastNamePatient = ?, birthday = ?, genre = ?, address = ?,  phone = ?, email = ? WHERE idPatient = ?',
            [namePatient, lastNamePatient, birthday, genre, address, phone, email, idPatient]
        );
        res.json({ message: 'Paciente actualizado exitosamente' });
    } catch  (error) {
        res.status(500).json({ message: 'Error al actualizar el paciente', error });
    }
};

const remove = async (req, res) => {
    const {idPatient} = req.params;

    try {
        await db.query('DELETE FROM patients WHERE idPatient = ?', [idPatient]);
        res.json({ message: 'Paciente eliminado exitosamente' });
    } catch  (error) {
        res.status(500).json({ message: 'Error al eliminar el paciente', error });
    }
};

module.exports = {
    getAll,
    create,
    getById,
    update,
    remove
};
