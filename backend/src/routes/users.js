const { Router } = require('express');
const router = Router();
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/users.controller');
const auth = require('../middleware/auth');

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/login')
  .post(loginUser);

// Perfil protegido por autenticación
router.get('/profile', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
