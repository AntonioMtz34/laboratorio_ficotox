import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const Navigation = () => {
  const { user, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  // Cierra la sesión del usuario, borra el token de autenticación y redirige a la página de inicio.
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Marca del sistema en la barra de navegación */}
        <Link className="navbar-brand" to="/">
          Ficotox Lab
        </Link>

        {/* Verifica si el usuario ha iniciado sesión */}
        {user ? (
          <ul className="navbar-nav ms-auto d-flex">
            {/* Enlaces disponibles para cualquier usuario autenticado */}
            <li className="nav-item">
              <Link className="nav-link" to="/recepcion">Recepción</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/inicio">Muestras</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/lotes">Lotes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notes">Pendientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">Manejo de clientes</Link>
            </li>

            {/* Sección exclusiva para administradores */}
            {user.rol === 'Administrador' && (
              <li className="nav-item">
                <Link className="nav-link" to="/administracion">Administración</Link>
              </li>
            )}

            {/* Botón para cerrar sesión */}
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        ) : (
          // Si el usuario no ha iniciado sesión, solo se muestra la opción de iniciar sesión
          <ul className="navbar-nav ms-auto d-flex">
            <li className="nav-item">
              <Link className="nav-link" to="/">Iniciar Sesión</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
