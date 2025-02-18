const usersCtrl = {};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_secreto';

// Obtiene los usuarios
usersCtrl.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
        return res.json([{ username: "no users" }]);
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registra un usuario
usersCtrl.createUser = async (req, res) => {
  const { username, email, password ,rol} = req.body; // asocia estos valores a los parametros enviados desde el frontend
  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, rol });
    await newUser.save(); // Guarda el nuevo usuario
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Hace inicio de sesion de un usuario
usersCtrl.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Genera un token que expira en 1 hora
    console.log(token,user);
    return res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtiene un usuario
usersCtrl.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualiza la informacion de un usuario
usersCtrl.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    let updatedFields = { username, email };

    // Si se proporciona una nueva contraseña, encripta antes de actualizar
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Elimina un usuario
usersCtrl.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = usersCtrl;

