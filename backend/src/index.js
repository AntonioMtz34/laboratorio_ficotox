require('dotenv').config(); // Cargar variables de entorno desde el archivo .env
const mongoose = require('./database'); // Importar la configuración de la base de datos
const app = require("./app");

const PORT = app.get('port') || 3000; // Define el puerto, usando 3000 por defecto

async function main() {
    // Iniciar el servidor
    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
}

main().catch(error => {
    console.error('Error starting the server:', error);
});
