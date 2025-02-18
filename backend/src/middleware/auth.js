// Se utiliza para generar un token y autentificar usuarios
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_secreto';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = auth;
