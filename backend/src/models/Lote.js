const { Schema, model } = require('mongoose');

const analisisSchema = new Schema({
    Estado: { type: String, default: 'pendiente' },
    _id: { type: String }, 
    Metodo: String,
    Type: String
}, {
    timestamps: true
});

const loteSchema = new Schema({
    cliente: { 
        type: Schema.Types.ObjectId, ref: 'Cliente', 
        required: true
    },
    muestras: { 
        type: [{ type: Schema.Types.ObjectId, ref: 'Muestra' }], 
    },
    Analisis: [analisisSchema],
    nombre: String
}, {
    timestamps: true
});


module.exports = model('Lote', loteSchema);
