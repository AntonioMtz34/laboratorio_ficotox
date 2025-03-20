const { Router } = require('express');
const router = Router();
const {
    getLotes,
    registrarLote,
    getLote,
    eliminarLote,
    agregarMuestra,
    eliminarMuestra,
    getCantidadMuestras,
} = require('../controllers/lote.controller');

// Rutas para lotes
router.route('/')
    .get(getLotes)         // Obitene todos los lotes
    .post(registrarLote);   // Registra un nuevo lote

router.route('/:id')
    .get(getLote)           // Obtiene un lote en especifico

    .delete(eliminarLote);   // Elimina un lote en especifico
    

router.route('/:id/muestra/:muestraId')
    .post(agregarMuestra)    // Agrega un muestra a un lote
    .delete(eliminarMuestra); // Elimina una muestra de un lote

router.route('/:id/cantidadMuestras')
    .get(getCantidadMuestras);

module.exports = router;
