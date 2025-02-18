import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { UserContext } from './UserContext';

const ManejoCliente = () => {
  // Estados para almacenar la información del cliente
  const [nombreCliente, setnombreCliente] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [muestras, setMuestras] = useState([]); // Lista de muestras asociadas al cliente

  const { user } = useContext(UserContext);
  const { id } = useParams(); // Obtiene el ID del cliente desde la URL
  const navigate = useNavigate();

  // Si el cliente existe, solicita su información y las muestras asociadas desde la API.
  useEffect(() => {
    if (id) {
      fetchData();
      fetchMuestras();
    }
  }, [id]);

  // Obtiene los datos del cliente desde la API y los actualiza en el estado.
  const fetchData = async () => {
    try {
      const clienteRes = await axios.get(`http://localhost:4000/api/clientes/${id}`);
      setnombreCliente(clienteRes.data.nombreCliente);
      setAddress(clienteRes.data.address);
      setPhone(clienteRes.data.phone);
      setRazonSocial(clienteRes.data.razonSocial);
      setEmail(clienteRes.data.email);
    } catch (error) {
      console.error('Error al obtener los datos del cliente:', error);
    }
  };

  // Obtiene las muestras asociadas al cliente y las guarda en el estado.
  const fetchMuestras = async () => {
    try {
      const muestrasRes = await axios.get(`http://localhost:4000/api/muestras/cliente/${id}`);
      setMuestras(muestrasRes.data);
    } catch (error) {
      console.error('Error al obtener las muestras:', error);
    }
  };

  // Redirige al usuario a la página de edición del cliente.
  const onSubmit = async (e) => {
    e.preventDefault();
    navigate('/editCliente/' + id);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          {/* Tarjeta con la información del cliente */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Cliente</h4>
              <div className="form-group mb-3">
                <label className="fw-bold">Nombre de la compañía</label>
                <p className="text-muted">{nombreCliente}</p>
              </div>
              <div className="form-group mb-3">
                <label className="fw-bold">Razón social</label>
                <p className="text-muted">{razonSocial}</p>
              </div>
              <div className="form-group mb-3">
                <label className="fw-bold">Teléfono</label>
                <p className="text-muted">{phone}</p>
              </div>
              <div className="form-group mb-3">
                <label className="fw-bold">Correo electrónico</label>
                <p className="text-muted">{email}</p>
              </div>
              <div className="form-group mb-3">
                <label className="fw-bold">Dirección</label>
                <p className="text-muted">{address}</p>
              </div>
              {/* Solo los administradores pueden editar la información del cliente */}
              {user.rol === 'Administrador' && (
                <form onSubmit={onSubmit}>
                  <button type="submit" className="btn btn-primary w-100">
                    Editar
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {/* Tabla que muestra las muestras asociadas al cliente */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4">Muestras</h4>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Responsable</th>
                      <th>Muestra ID</th>
                      <th>Fecha de Elaboración</th>
                      <th>Análisis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {muestras.map((muestra) => (
                      <tr key={muestra._id}>
                        <td>{muestra.Responsable}</td>
                        <td>
                          <Link
                            to={`/Muestra/${muestra._id}/edit`}
                            className="text-primary"
                          >
                            {muestra._id}
                          </Link>
                        </td>
                        <td>{format(new Date(muestra.createdAt), 'dd/MM/yyyy')}</td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {muestra.Analisis.map((analisis, index) => (
                              <li key={index}>
                                <span
                                  className={`badge ${
                                    analisis.Estado === 'positivo'
                                      ? 'bg-danger'
                                      : analisis.Estado === 'negativo'
                                      ? 'bg-success'
                                      : analisis.Estado === 'pendiente'
                                      ? 'bg-secondary'
                                      : 'bg-warning'
                                  }`}
                                >
                                  {analisis.Type} ({analisis.Estado})
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManejoCliente;

