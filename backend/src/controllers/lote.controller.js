const lotesCtrl = {};
const Lote = require('../models/Lote');
const Muestra = require('../models/Muestra');
const Cliente = require('../models/Cliente'); 

// Registra un nuevo lote y lo asocia a un cliente y una muestra
lotesCtrl.registrarLote = async (req, res) => {
    const { muestraId, Comentario, clienteId } = req.body; // Extrae los datos enviados en el cuerpo de la solicitud

    try {
        // Busca la muestra asociada al ID
        const muestra = await Muestra.findById(muestraId);
        if (!muestra) {
            return res.status(404).json({ message: 'Muestra no encontrada' });
        }

        // Busca el cliente asociado al ID
        const cliente = await Cliente.findById(clienteId);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' }); 
        }

        // Crea un nuevo lote con la muestra y el cliente especificados
        const nuevoLote = new Lote({
            muestras: [muestra._id], // Inicializa el array con la muestra proporcionada
            Comentario: Comentario,
            cliente: cliente._id // Asocia el lote con el cliente
        });

        await nuevoLote.save();
        res.json({ message: 'Lote registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtiene la lista de todos los lotes almacenados en la base de datos
lotesCtrl.getLotes = async (req, res) => {
    try {
        const lotes = await Lote.find()
            .populate('muestras', 'Comentario') // Obtiene los comentarios de las muestras asociadas
            .populate('cliente', 'nombreCliente'); // Obtiene el nombre del cliente asociado
        res.json(lotes); // Devuelve la lista de lotes con sus muestras y cliente asociado
    } catch (error) {
        console.error('Error detallado:', error); 
        res.status(500).json({ message: 'Error al obtener lotes', error: error.message });
    }
};

// Obtiene un lote específico por su ID
lotesCtrl.getLote = async (req, res) => {
    try {
        const lote = await Lote.findById(req.params.id)
            .populate('muestras', 'Comentario')
            .populate('cliente', 'nombreCliente');
        if (!lote) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }
        res.json(lote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agrega una muestra a un lote existente
lotesCtrl.agregarMuestra = async (req, res) => {
    const { id, muestraId } = req.params;  // Extrae ID del lote y de la muestra desde los parámetros de la URL

    try {
        // Busca el lote por ID
        const lote = await Lote.findById(id);
        if (!lote) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // Busca la muestra por ID
        const muestra = await Muestra.findById(muestraId);
        if (!muestra) {
            return res.status(404).json({ message: 'Muestra no encontrada' });
        }

        // Agrega la muestra al array de muestras del lote
        lote.muestras.push(muestra._id);
        await lote.save();

        res.json({ message: 'Muestra agregada al lote' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Elimina una muestra específica de un lote
lotesCtrl.eliminarMuestra = async (req, res) => {
    const { muestraId } = req.params;

    try {
        // Busca el lote por ID
        const lote = await Lote.findById(req.params.id);
        if (!lote) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // Filtra la muestra a eliminar del array de muestras del lote
        lote.muestras = lote.muestras.filter(muestra => muestra.toString() !== muestraId);

        await lote.save();
        res.json({ message: 'Muestra eliminada del lote' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Elimina un lote de la base de datos
lotesCtrl.eliminarLote = async (req, res) => {
    try {
        // Busca el lote por ID
        const lote = await Lote.findById(req.params.id);
        if (!lote) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        await lote.remove(); // Elimina el lote de la base de datos
        res.json({ message: 'Lote eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = lotesCtrl;
