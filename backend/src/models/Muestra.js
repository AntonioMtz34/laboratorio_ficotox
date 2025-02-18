const { Schema, model } = require('mongoose');

const analisisSchema = new Schema({
    Estado: { type: String, default: 'pendiente' },
    _id: { type: String }, 
    Metodo: String,
    Type: String
}, {
    timestamps: true
});

const muestraSchema = new Schema({
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    Comentario: String,
    IDMuestraCliente: String,
    Responsable: String,
    NombreOrganismo: String,
    Peso: String,
    ToRecepcion: String,
    Analisis: [analisisSchema] // Array to store multiple analyses
}, {
    timestamps: true
});

module.exports = model('Muestra', muestraSchema); 