import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  // Estado para almacenar los datos del formulario de registro
  const [formData, setFormData] = useState({ username: '', email: '', password: '', rol: '' });

  // Extrae los valores de los campos del formulario
  const { username, email, password, rol } = formData;

  // Maneja los cambios en los campos del formulario y actualiza el estado
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Envía los datos del formulario a la API para registrar un nuevo usuario
  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/user', formData); // Envío de datos a la API
      console.log(res.data); 
      alert('Usuario registrado exitosamente'); 
      
      // Reinicia el formulario después de un registro exitoso
      setFormData({ username: '', email: '', password: '', rol: '' }); 
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      
      // Muestra detalles del error si existen en la respuesta de la API
      if (err.response && err.response.data) {
        console.error('Detalles del error:', err.response.data);
      }
      
      alert('Hubo un error al registrar el usuario. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="container">
      {/* Formulario de registro de usuario */}
      <form onSubmit={onSubmit} className="form">
        <h2 className="title">Registro de Usuario</h2>

        {/* Campo de entrada para el nombre de usuario */}
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="username" value={username} onChange={onChange} className="input" required />
        </div>

        {/* Campo de entrada para el correo electrónico */}
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input type="email" name="email" value={email} onChange={onChange} className="input" required />
        </div>

        {/* Campo de entrada para la contraseña */}
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" name="password" value={password} onChange={onChange} className="input" required />
        </div>

        {/* Selección del rol del usuario */}
        <div className="form-group">
          <label>Rol:</label>
          <select name="rol" value={rol} onChange={onChange} className="input" required>
            <option value="">Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Laboratorista">Laboratorista</option>
          </select>
        </div>

        {/* Botón para enviar el formulario */}
        <button type="submit" className="submit-button">Registrar</button>
      </form>
    </div>
  );
};

export default Register;

