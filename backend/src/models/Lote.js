const { Schema, model } = require('mongoose');

const loteSchema = new Schema({
    cliente: { 
        type: Schema.Types.ObjectId, ref: 'Cliente', 
        required: true
    },
    muestras: { 
        type: [{ type: Schema.Types.ObjectId, ref: 'Muestra' }], 
    },
    Comentario: String
}, {
    timestamps: true
});


module.exports = model('Lote', loteSchema);
