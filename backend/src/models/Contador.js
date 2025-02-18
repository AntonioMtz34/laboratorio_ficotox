const { Schema, model } = require('mongoose');
const contadorSchema = new Schema({
    contadorASP: {
        type: Number,
        required: true
      },
    contadorDSP: {
        type: Number,
        required: true
      },
      contadorPSP: {
        type: Number,
        required: true
      },
      contadorFITO: {
        type: Number,
        required: true
      },
      contadorCLR: {
        type: Number,
        required: true
      },
      lastResetYear: { type: Number, default: new Date().getFullYear() },
}, );
module.exports = model('Contador', contadorSchema);