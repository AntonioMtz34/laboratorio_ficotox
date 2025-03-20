const lotesCtrl = {};
const Lote = require('../models/Lote');
const Muestra = require('../models/Muestra');
const Cliente = require('../models/Cliente'); 

lotesCtrl.registrarLote = async (req, res) => {
    const { muestraId, Nombre, clienteId } = req.body;

    try {
        const muestra = await Muestra.findById(muestraId);
        if (!muestra) {
            return res.status(404).json({ message: 'Muestra no encontrada' });
        }

        const cliente = await Cliente.findById(clienteId);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' }); 
        }

        // Extraer y modificar los identificadores de análisis, pero ahora guardando los objetos completos
        const analisisLote = muestra.Analisis.map(analisis => ({
            ...analisis.toObject(), // Copiar el objeto completo
            _id: analisis._id.slice(0, -2) // Eliminar los últimos dos caracteres del ID
        }));

        const nuevoLote = new Lote({
            muestras: [muestra._id],
            Analisis: analisisLote, // Guardamos los análisis completos en el lote
            nombre: Nombre,
            cliente: cliente._id
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

lotesCtrl.getCantidadMuestras = async (req, res) => {
    try {
        const lote = await Lote.findById(req.params.id).select('muestras Analisis');

        if (!lote) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        res.json({ 
            cantidadMuestras: lote.muestras.length,
            analisis: lote.Analisis 
        });
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
