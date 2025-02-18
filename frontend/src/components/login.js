import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setUser, setToken } = useContext(UserContext);
  const { email, password } = formData;
  const navigate = useNavigate();

  // Maneja la actualización del estado con los valores ingresados en el formulario
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Envía las credenciales al servidor y, si son correctas, almacena el usuario y el token de autenticación
  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/user/login', formData);
      setUser(res.data.user); // Almacena la información del usuario autenticado
      setToken(res.data.token); // Guarda el token de autenticación para futuras solicitudes
      localStorage.setItem('token', res.data.token);
      alert('Inicio de sesión exitoso');
      navigate('/inicio'); // Redirige a la página de inicio después de un inicio de sesión exitoso
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Hubo un error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div>
      {/* Formulario de inicio de sesión */}
      <form onSubmit={onSubmit} style={formStyle}>
        <h2 style={titleStyle}>Inicio de Sesión</h2>
        <div style={formGroupStyle}>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            style={inputStyle}
            required
          />
        </div>
        <button type="submit" style={submitButtonStyle}>Iniciar Sesión</button>
      </form>
    </div>
  );
};

{/* Estilos en línea para el formulario de inicio de sesión */}


const formStyle = {
  maxWidth: '400px',
  margin: 'auto',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
};

const titleStyle = {
  marginBottom: '20px',
  fontSize: '28px',
  textAlign: 'center',
  
};

const formGroupStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#000000',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

export default Login;
