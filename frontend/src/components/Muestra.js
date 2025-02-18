import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const EditMuestra = () => {
    // Estados para manejar los datos de la muestra
    const [comentario, setComentario] = useState('');
    const [fechaRecepcion, setFechaRecepcion] = useState(new Date());
    const [_id, setId] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [clienteNombre, setClienteNombre] = useState('');
    const [nombreOrganismo, setNombreOrganismo] = useState('');
    const [responsable, setResponsable] = useState('');
    const [contacto, setContacto] = useState('');
    const [peso, setPeso] = useState('');
    const [temperaturaRecepcion, setTemperaturaRecepcion] = useState('');
    const [analisisSolicitado, setAnalisisSolicitado] = useState('Acido Domoico'); // Tipo de análisis por defecto

    const { id } = useParams(); // Obtiene el ID de la muestra desde la URL
    const navigate = useNavigate();

    useEffect(() => {
        obtenerDatosMuestra();
    }, [id]);

    useEffect(() => {
        if (clienteId) {
            obtenerDatosCliente(clienteId);
        }
    }, [clienteId]);

    // Obtiene los datos de la muestra desde la API y los almacena en el estado
    const obtenerDatosMuestra = async () => {
        try {
            if (id) {
                const respuesta = await axios.get(`http://localhost:4000/api/muestras/${id}`);
                const muestra = respuesta.data;

                setComentario(muestra.Comentario);
                setFechaRecepcion(new Date(muestra.date));
                setResponsable(muestra.Responsable);
                setTemperaturaRecepcion(muestra.ToRecepcion);
                setPeso(muestra.Peso);
                setClienteId(muestra.cliente); // Se almacena el ID del cliente
                setNombreOrganismo(muestra.NombreOrganismo);
                setId(id);
            }
        } catch (error) {
            console.error('Error al obtener los datos de la muestra:', error);
        }
    };

    // Obtiene el nombre del cliente y su contacto desde la API usando su ID
    const obtenerDatosCliente = async (clienteId) => {
        try {
            const respuesta = await axios.get(`http://localhost:4000/api/clientes/${clienteId}`);
            setClienteNombre(respuesta.data.nombreCliente);
            setContacto(respuesta.data.phone);
        } catch (error) {
            console.error('Error al obtener los datos del cliente:', error);
        }
    };

    // Redirige al usuario a la página de edición de la muestra
    const handleEditarMuestra = async (e) => {
        e.preventDefault();

        if (!id) {
            alert("Error: No se pudo identificar la muestra.");
            return;
        }

        navigate(`/Muestra/${id}/edit`);
    };

    return (
        <div>
            <div className="col-md-4">
                <div className="card card-body">
                    <h4>Muestra: {_id}</h4>
                    <div className="form-group">
                        <label>Cliente: </label>
                        <p>{clienteNombre}</p>
                    </div>
                    <div className="form-group">
                        <label>Contacto: </label>
                        <p>{contacto}</p>
                    </div>
                    <div className="form-group">
                        <label>Fecha de recepción: </label>
                        <p>{format(fechaRecepcion, 'dd/MM/yyyy')}</p>
                    </div>
                    <div className="form-group">
                        <label>Nombre del organismo:</label>
                        <p>{nombreOrganismo}</p>
                    </div>
                    <div className="form-group">
                        <label>Cantidad/Peso de organismos recibidos:</label>
                        <div className="input-group">
                            <p>{peso} gr</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Temperatura en el momento de la recepción:</label>
                        <div className="input-group">
                            <p>{temperaturaRecepcion}°C</p>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label>Análisis solicitados: </label>
                        <p>{analisisSolicitado}</p>
                    </div>
                    <div className="form-group">
                        <label>Comentarios:</label>
                        <p>{comentario}</p>
                    </div>
                    <form onSubmit={handleEditarMuestra}>
                        <button type="submit" className="btn btn-primary">
                            Editar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditMuestra;
