
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ModificarPassword = () => {
  const { userId } = useParams(); // Obtiene el ID del usuario desde la URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  // Maneja la actualización del estado con la nueva contraseña ingresada
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Modifica la contraseña del usuario después de validar la entrada
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: La contraseña debe tener al menos 8 caracteres y contener un número
    if (password.length < 8 || !/\d/.test(password)) {
      alert('La contraseña debe tener al menos 8 caracteres y contener al menos un número.');
      return;
    }

    try {
      // Envía la nueva contraseña al servidor para actualizarla
      await axios.put(`http://localhost:4000/api/user/${userId}`, { password });
      alert('Contraseña modificada correctamente');
      navigate('/Administracion'); // Redirige a la página de administración después de la modificación
    } catch (error) {
      console.error('Error al modificar la contraseña:', error);
      alert('Error al modificar la contraseña. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Modificar Contraseña</h2>
        <div className="form-group">
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="input"
            required
          />
        </div>
        <button type="submit" className="submit-button">Modificar</button>
      </form>
    </div>
  );
};

export default ModificarPassword;
