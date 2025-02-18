const notesCtrl = {};
const Note = require('../models/Note');
notesCtrl.getNotes = async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
};
notesCtrl.createNote = async (req, res) => {
    const { motivo, descripcion, cliente, fechaAgenda, responsable } = req.body;
    try {
        // Verificar si la nota ya existe
        const existingNote = await Note.findOne({ fechaAgenda, cliente });
        if (existingNote) {
            return res.json({ message: 'La nota ya existe' });
        }

        // Crear una nueva nota
        const newNote = new Note({
            motivo,
            descripcion,
            cliente,
            fechaAgenda,
            responsable
        });
        await newNote.save();
        res.json({ message: 'Nota creada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
notesCtrl.getNote = async (req, res) => {
    const note = await Note.findById(req.params.id);
    console.log(note);
    res.json(note);
};
notesCtrl.updateNote = async (req, res) => {
    const { motivo, descripcion, cliente, fechaAgenda, responsable } = req.body;
    try {
        // Verificar si la nota existe
        const existingNote = await Note.findById(req.params.id);
        if (!existingNote) {
            return res.status(404).json({ message: 'La nota no existe' });
        }

        // Actualizar la nota
        await Note.findByIdAndUpdate(req.params.id, {
            motivo,
            descripcion,
            cliente,
            fechaAgenda,
            responsable
        });

        res.json({ message: 'Nota actualizada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

notesCtrl.deleteNote = async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({message: 'Note Deleted'})
};
module.exports = notesCtrl;
