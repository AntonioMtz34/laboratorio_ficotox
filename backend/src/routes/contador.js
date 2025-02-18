const { Router } = require('express');
const router = Router();
const { getContador, incrementarContador, getAllContadores } = require('../controllers/contador.controller');
router.route('/')
   .get(getAllContadores) // Obtiene todos los contadores
router.route('/:tipo')
   .get(getContador) // Obtiene un contador en especifíco
   .post(incrementarContador) // Incremente un contador
module.exports = router;