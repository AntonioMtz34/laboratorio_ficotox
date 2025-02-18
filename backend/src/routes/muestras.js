const { Router } = require('express');
const router = Router();
const {
    getMuestras,
    registrarMuestra,
    getMuestra,
    actualizarMuestra,
    eliminarMuestra,
    getMuestrasByCliente,
    exportarMuestrasACSV // Importa la función del controlador
} = require('../controllers/muestras.controller');

router.route('/')
    .get(getMuestras) // Obtiene todas las muestras
    .post(registrarMuestra) // Registra una muestra

router.route('/:id')
    .get(getMuestra) // Manda a llamar a una muestra en especifíco
    .put(actualizarMuestra) // Actualiza la muestra seleccionada
    .delete(eliminarMuestra) // Elimina la muestra seleccionada

router.route('/cliente/:clienteId')
    .get(getMuestrasByCliente);

router.route('/export/csv') // Ruta para exportar muestras a formato CSV
    .get(exportarMuestrasACSV);

module.exports = router;
