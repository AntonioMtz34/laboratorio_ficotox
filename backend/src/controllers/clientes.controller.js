const clientesCtrl = {};
const Cliente = require('../models/Cliente');
const Muestra = require('../models/Muestra');

// Manda a llamar a todos los clientes registrados
clientesCtrl.getClientes = async (req, res) => {

    const clientes = await Cliente.find(); //Busca a todos los clientes registrados
    // Verifica que haya clientes registrados
    if (!clientes || clientes.length === 0) {
        return res.json([{ message: "no clientes" }]);
    }
    res.json(clientes);// Devuelve los clientes
}

// Registra un nuevo cliente
clientesCtrl.createCliente = async (req, res) => {
    const { nombreCliente, phone, email, address, razonSocial } = req.body; // Obtiene los valores de los parametros enviados

    // Validaciones del nombre del cliente
    if (!nombreCliente || nombreCliente.trim() === '') {
        return res.status(400).json({ message: 'El nombre del cliente es requerido' });
    }
    const regex = /^[a-zA-Z]/;
    if (!regex.test(nombreCliente)) {
        return res.status(400).json({ message: 'El nombre del cliente debe empezar con una letra' });
    }

    try {
        // Verificar si el usuario ya existe en la base de datos
        const existingCliente = await Cliente.findOne({ nombreCliente });
        if (existingCliente) {
            return res.status(409).json({ message: 'El cliente ya existe' });
        }
        // Verifica que no exista otro cliente con el mismo numero asociado
        const existingNumber = await Cliente.findOne({ phone });
        if (existingNumber) {
            return res.status(409).json({ message: 'El número ya está registrado' });
        }
        // Verifica si existe algun cliente con ese correo
        const existingEmail = await Cliente.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        // Si el usuario no existe, crearlo
        const newCliente = new Cliente({
            nombreCliente: nombreCliente,
            phone: phone,
            email: email,
            address: address,
            razonSocial: razonSocial,
            active: true
        });

        await newCliente.save(); // Registra al cliente en la base de datos
        res.status(201).json({ message: 'Cliente creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtiene la informacion de un cliente en especifíco
clientesCtrl.getCliente = async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    res.json(cliente); // Devuelve el cliente
};

// Actualiza la información de un cliente
clientesCtrl.actualizarCliente = async (req, res) => {
    const { nombreCliente, phone, email, address, razonSocial} = req.body; // Recibe la informacion actualizada del cliente
    if (!nombreCliente || nombreCliente.trim() === '') {
        return res.json({ message: 'v' });
    }
    const regex = /^[a-zA-Z]/;
    if (!regex.test(nombreCliente)) {
        return res.json({ message: 'l' });
    }
    await Cliente.findOneAndUpdate({_id: req.params.id}, {
        nombreCliente,
        phone,
        email,
        address,
        razonSocial
    });
    res.json({message: 'Cliente actualizado'});
};

//Elimina un cliente junto con sus muestras asociadas
clientesCtrl.deleteCliente = async (req, res) => {
    try {
        const authorId = req.params.id
        console.log(authorId);
        // Eliminar todas las notas asociadas al usuario
        //const temp = await Cliente.findById(authorId);
        //await Muestra.deleteMany({ cliente: authorID});
        // Eliminar al usuario
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cliente y muestras asociadas eliminadas' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = clientesCtrl;
