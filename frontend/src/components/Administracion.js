import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Administracion = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/user');
      setUsers(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleRegisterUser = () => {
    navigate('/Registrar');
  };

  const handleModifyPassword = (userId) => {
    navigate(`/ModificarPassword/${userId}`);
  };

  const handleExportToCSV = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/muestras/export/csv', {
        responseType: 'blob', // Importante para recibir el archivo como blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'muestras.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Administración</h2>
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleModifyPassword(user._id)}
                  >
                    Modificar Contraseña
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
        <div className="col-auto">
          <button onClick={handleRegisterUser} className="btn btn-primary">
            Registrar Usuario
          </button>
        </div>

        <div className="col-auto">
      <h2 className="mb-4">Informacion de muestras</h2>

          <button onClick={handleExportToCSV} className="btn btn-secondary">
            Exportar a CSV
          </button>
        </div>
      </div>
  
  );
};

export default Administracion;


