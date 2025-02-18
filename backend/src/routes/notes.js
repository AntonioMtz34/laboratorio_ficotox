const { Router } = require('express');
const router = Router();
const { getNotes, createNote, getNote, updateNote, deleteNote } = require('../controllers/notes.controller');
router.route('/')
   .get(getNotes) // Obtiene todas las notas
   .post(createNote) // Crea una nota
router.route('/:id')
   .get(getNote) // Obtiene una nota en especifíco
    .put(updateNote) // Actualiza la nota seleccionada
    .delete(deleteNote) // Elimina la nota seleccionada
module.exports = router;
