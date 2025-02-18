import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

const ListadeClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  // Obtiene la lista de clientes desde la API y la almacena en el estado
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/clientes');
      setClientes(res.data);
    } catch (error) {
      console.error('Error al obtener los datos de clientes:', error);
    }
  };

  // Elimina un cliente después de la confirmación del usuario
  const handleDelete = async (clienteId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/api/clientes/${clienteId}`);
        fetchData(); // Recarga la lista después de la eliminación
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  // Filtra los clientes cuyo nombre, ID, correo o teléfono coincidan con la búsqueda
  const filteredClientes = clientes.filter(cliente => {
    const nombreCliente = cliente.nombreCliente ? cliente.nombreCliente.toLowerCase() : '';
    const id = cliente._id ? cliente._id.toLowerCase() : '';
    const email = cliente.email ? cliente.email.toLowerCase() : '';
    const phone = cliente.phone ? cliente.phone.toLowerCase() : '';
    const query = searchQuery.toLowerCase();

    return (
      nombreCliente.includes(query) ||
      id.includes(query) ||
      email.includes(query) ||
      phone.includes(query)
    );
  });

  // Ordena la lista de clientes según el campo y la dirección seleccionados
  const sortClientes = (clientes, field, direction) => {
    return clientes.sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Cambia el criterio de ordenación cuando el usuario selecciona un campo
  const handleSortChange = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Aplica el ordenamiento a la lista filtrada de clientes
  const sortedClientes = sortClientes(filteredClientes, sortField, sortDirection);

  return (
    <div className="container mt-4">
      <div className="row mt-4 align-items-center">
        {/* Barra de búsqueda */}
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <Link to="/createCliente" className="btn btn-primary">Registrar Cliente</Link>
        </div>
      </div>

      <div className="row mt-4 align-items-center" style={{ marginBottom: '20px' }}>
        <div className="col-auto">
          <label>Ordenar por: </label>
        </div>
        {/* Selector de campo para ordenar clientes */}
        <div className="col-auto">
          <select
            className="form-control"
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Seleccionar campo</option>
            <option value="nombreCliente">Nombre</option>
            <option value="_id">ID</option>
            <option value="email">Correo</option>
            <option value="phone">Teléfono</option>
          </select>
        </div>

        <div className="col-auto">
          <button
            className="btn btn-secondary"
            onClick={() => handleSortChange(sortField)}
          >
            {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
          </button>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>ID</th>
              <th>Correo</th>
              <th>Teléfono</th>
              {user.rol === 'Administrador' && <th>Eliminar</th>}
            </tr>
          </thead>
          <tbody>
            {sortedClientes.map(cliente => (
              <tr key={cliente._id}>
                <td>{cliente.nombreCliente}</td>
                <td>
                  <Link className="text-primary" to={`/clientes/${cliente._id}`}>
                    {cliente._id}
                  </Link>
                </td>
                <td>{cliente.email}</td>
                <td>{cliente.phone}</td>
                {user.rol === 'Administrador' && (
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(cliente._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadeClientes;


