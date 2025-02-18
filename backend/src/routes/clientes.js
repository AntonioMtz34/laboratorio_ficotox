const { Router } = require('express');
const router = Router();
const {getClientes, createCliente, deleteCliente, actualizarCliente,getCliente} = require('../controllers/clientes.controller');
router.route('/')
    .get(getClientes)
    .post(createCliente)
router.route('/:id')
    .get(getCliente)
    .put(actualizarCliente)
    .delete(deleteCliente)
module.exports = router;
