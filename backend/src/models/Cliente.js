const { Schema, model } = require('mongoose');
const clienteSchema = new Schema({
    nombreCliente: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phone : String,
    active : Boolean,
    email : String,
    address : String,
    razonSocial : String
}, 
);
module.exports = model('Cliente', clienteSchema);


