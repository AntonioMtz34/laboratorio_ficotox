const { Schema, model } = require('mongoose');
const noteSchema = new Schema({
    motivo: {
        type: String,
        required: true
    },
    descripcion : String,
    cliente : String,
    responsable: String,
   fechaAgenda: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
module.exports = model('Note', noteSchema);
