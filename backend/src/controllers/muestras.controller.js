const muestrasCtrl = {};
const Muestra = require('../models/Muestra');
const Cliente = require('../models/Cliente');
const { parse } = require('json2csv');

muestrasCtrl.registrarMuestra = async (req, res) => {
    const { Comentario, Responsable, ToRecepcion, NombreOrganismo, Peso, ClienteId, Analisis } = req.body; // Extrae los datos enviados en el cuerpo de la solicitud

    try {
        //Busca al cliente al que se asociará la muestra
        const cliente = await Cliente.findById(ClienteId); 
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        };
        // Verifica que exista al menos un analisis asociado
        if (!Analisis || Analisis.length === 0) {
            return res.status(400).json({ message: 'Debe de tener asociado al menos un análisis' });
        }
        // Crea el objeto muestra 
        const nuevaMuestra = new Muestra({
            Comentario: Comentario,
            Responsable: Responsable,
            ToRecepcion: ToRecepcion,
            NombreOrganismo: NombreOrganismo,
            Peso: Peso,
            cliente: cliente._id,
            Analisis: Analisis
        });
        await nuevaMuestra.save(); //Guarda la muestra en la base de datos

        // Enviar la muestra creada junto con el mensaje
        res.json({ message: 'Muestra guardada', muestra: nuevaMuestra });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtiene una muestra en especifico
muestrasCtrl.getMuestra = async (req, res) => {
    try {
        const muestra = await Muestra.findById(req.params.id).populate('cliente', 'nombreCliente'); // Encuentra la muestra junto con el cliente asociado
        if (!muestra) {
            return res.status(404).json({ message: 'Muestra no encontrada' });
        }
        res.json(muestra);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtiene todas las muestras
muestrasCtrl.getMuestras = async (req, res) => {
    try {
        const muestras = await Muestra.find().populate('cliente', 'nombreCliente');
        res.json(muestras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener muestras', error });
    }
};

// Actualiza una muestra
muestrasCtrl.actualizarMuestra = async (req, res) => {
    const { Comentario, ToRecepcion, NombreOrganismo, Peso, Analisis } = req.body;

    if (!Comentario || Comentario.trim() === '') {
        return res.status(400).json({ message: 'La muestra requiere un content' });
    }

    try {
        const muestra = await Muestra.findById(req.params.id);
        if (!muestra) {
            return res.status(404).json({ message: 'Muestra no encontrada' });
        }

        muestra.Comentario = Comentario;
        muestra.ToRecepcion = ToRecepcion;
        muestra.NombreOrganismo = NombreOrganismo;
        muestra.Peso = Peso;

        if (Analisis && Analisis.length > 0) {
            muestra.Analisis = Analisis.map(a => ({
                _id: a._id,
                Type: a.Type,
                Metodo: a.Metodo,
                Estado: a.Estado
            }));
        }

        await muestra.save();
        res.json({ message: 'Muestra actualizada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Devuelve las muestras de un cliente en especifico
muestrasCtrl.getMuestrasByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const muestras = await Muestra.find({ cliente: clienteId }).populate('cliente', 'nombreCliente');
        res.json(muestras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener muestras', error });
    }
};


// Exporta la base de datos de las muestras en un formato CSV
muestrasCtrl.exportarMuestrasACSV = async (req, res) => {
    try {
        const muestras = await Muestra.find().populate('cliente', 'nombreCliente');

        // Convirtiendo el formato de la tabla
        const muestrasFlat = muestras.map((muestra) => {
            return muestra.Analisis.map((analisis) => ({
                _id: muestra._id,
                Responsable: muestra.Responsable,
                NombreOrganismo: muestra.NombreOrganismo,
                Comentario: muestra.Comentario,
                Peso: muestra.Peso,
                ToRecepcion: muestra.ToRecepcion,
                'Analisis._id': analisis._id,
                'Analisis.Type': analisis.Type,
                'Analisis.Estado': analisis.Estado,
                'Analisis.createdAt': analisis.createdAt,
                'Analisis.updatedAt': analisis.updatedAt,
                createdAt: muestra.createdAt,
                updatedAt: muestra.updatedAt,
                'cliente.nombreCliente': muestra.cliente ? muestra.cliente.nombreCliente : null
            }));
        }).flat(); 

        const fields = [
            '_id',
            'Responsable',
            'NombreOrganismo',
            'Comentario',
            'Peso',
            'ToRecepcion',
            'Analisis._id',
            'Analisis.Type',
            'Analisis.Estado',
            'Analisis.createdAt',
            'Analisis.updatedAt',
            'createdAt',
            'updatedAt',
            'cliente.nombreCliente'
        ];

        const csv = parse(muestrasFlat, { fields });

        res.header('Content-Type', 'text/csv');
        res.attachment('muestras.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Error al exportar muestras', error });
    }
};


// Elimina una muestra
muestrasCtrl.eliminarMuestra = async (req, res) => {
    try {
        const muestra = await Muestra.findById(req.params.id);
        if (!muestra) {
            return res.status(404).json({ message: 'Muestra no encontrada' });
        }
        await muestra.remove();
        res.json({ message: 'Muestra eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = muestrasCtrl;
