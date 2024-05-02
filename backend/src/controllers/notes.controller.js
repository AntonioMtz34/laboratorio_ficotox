const notesCtrl = {};
const Note = require('../models/Note');
notesCtrl.getNotes = async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
};
notesCtrl.createNote = async (req, res) => {
    const { title, content, date, author } = req.body;
    try {
        // Verificar si la nota ya existe en la base de datos
        const existingNote = await Note.findOne({ title, author });

        // Si la nota ya existe, devolver un error
        if (existingNote) {
            return res.json({ message: 'La nota ya existe' });
        }
        if (!title || title.trim() === '') {
            console.log('No tiene titulo');
            return res.json({ message: 'El titulo no puede estar vacío' });
        }
        if (!content|| content.trim() === '') {
            console.log('No tiene contenido');
            return res.json({ message: 'La nota no puede estar vacía' });
        }
        const newNote = new Note({
            title: title,
            content: content,
            date: date.now,
            author: author
        });
        console.log(newNote);
        await newNote.save();
        res.json({message: 'Note Saved'});

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
    console.log("hit notes controller")
    const { title, content, author } = req.body;
    if (!title || title.trim() === '') {
        console.log('No tiene titulo');
        return res.status(400).json({ message: 'El titulo no puede estar vacío' });
    }
    if (!content|| content.trim() === '') {
        console.log('No tiene contenido');
        return res.status(400).json({ message: 'La nota no puede estar vacía' });
    }
    await Note.findOneAndUpdate({_id: req.params.id}, {
        title,
        content
    });
    console.log(req.params.id, req.body);
    res.json({message: 'Note Updated'});
};
notesCtrl.deleteNote = async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({message: 'Note Deleted'})
};
module.exports = notesCtrl;
