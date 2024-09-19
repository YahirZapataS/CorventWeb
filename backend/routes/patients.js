const express = require('express');
const router =  express.Router();
const patientController = require('../controllers/patientController');

router.get('/',  patientController.getAll);
router.post('/',   patientController.create);
router.get('/:idPatient',    patientController.getById);
router.put('/:idPatient', patientController.update);
router.delete('/:idPatient',  patientController.remove);

module.exports  = router;