const usersCtrl = {};
const User = require('../models/User');
const Note = require('../models/Note');

usersCtrl.getUsers = async (req, res) => {

    const users = await User.find();
    /*if (!users || users.length === 0) {
        // If no users are found, respond with a default user object
        return res.json([{ username: "no users" }]);
    }*/
    res.json(users);
}

usersCtrl.createUser = async (req, res) => {
    const { username } = req.body;
    if (!username || username.trim() === '') {
        return res.json({ message: 'v' });
    }
    const regex = /^[a-zA-Z]/;
    if (!regex.test(username)) {
        return res.json({ message: 'l' });
    }
    try {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ message: 'El usuario ya existe' });
        }
        // Si el usuario no existe, crearlo
        const newUser = new User({ username });
        await newUser.save();
        res.json({ message: 'User creaded' });

    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

usersCtrl.deleteUser = async (req, res) => {
    try {

        const authorId = req.params.id
        // Eliminar todas las notas asociadas al usuario
        const temp = await User.findById(authorId);
        const attributeValue = temp['username'];
        await Note.deleteMany({ author: attributeValue});
        // Eliminar al usuario
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and associated notes deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = usersCtrl;
