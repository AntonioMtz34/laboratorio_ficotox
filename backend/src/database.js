const mongoose = require('mongoose');

// Utiliza la variable de entorno MONGODB_URI o la URI predeterminada
//MONGODB_URI=mongodb://localhost/ficotox;
//const URI = process.env.MONGODB_URI || 'mongodb://localhost/ficotox';
const URI = 'mongodb+srv://sebastianmartinez48:Clr0xgqzM0ePV218@laboratorioficotox.5gnsk.mongodb.net/ficotox?retryWrites=true&w=majority&appName=LaboratorioFicotox';

// Conectar a la base de datos
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('DB is connected'))
.catch((error) => console.error('DB connection error:', error));

module.exports = mongoose; // Exporta mongoose para su uso en otros archivos

