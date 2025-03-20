import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';
import { generateLabelXml } from './labelGenerator2';

const EditMuestra = () => {
    // Estados para manejar los datos del formulario, incluyendo detalles de la muestra, cliente y análisis
    const [Comentario, setComentario] = useState('');
    const [date, setDate] = useState(new Date());
    const [_id, setId] = useState('');
    const [clienteSelected, setClienteSelected] = useState('');
    const [NombreOrganismo, setNombreorganismo] = useState('');
    const [Peso, setPeso] = useState('');
    const [estado, setEstado] = useState('');
    const [ToRecepcion, setToRecepcion] = useState('');
    const [Analisis, setAnalisis] = useState([]); // Almacena los diferentes análisis asociados a la muestra

    const { id } = useParams(); // Obtiene el ID de la muestra desde la URL
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [id]);

    // Carga los datos de la muestra desde la API y los almacena en el estado
    const fetchData = async () => {
        try {
            if (id) {
                const muestraRes = await axios.get(`http://localhost:4000/api/muestras/${id}`);
                const muestraData = muestraRes.data;
                setComentario(muestraData.Comentario);
                setDate(new Date(muestraData.date));
                setToRecepcion(muestraData.ToRecepcion);
                setPeso(muestraData.Peso);
                setNombreorganismo(muestraData.NombreOrganismo);
                setId(id);
                setAnalisis(muestraData.Analisis);
                setClienteSelected(muestraData.cliente.nombreCliente);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Verifica que los campos obligatorios tengan información válida antes de enviar
        if (!NombreOrganismo || !/^[A-Za-záéíóúüñ\s]+$/.test(NombreOrganismo)) {
            alert('Por favor, ingresa un nombre de organismo válido (solo letras y espacios).');
            return;
        }
        if (!Peso || isNaN(parseFloat(Peso))) {
            alert('Por favor, ingresa un peso válido.');
            return;
        }
        if (!ToRecepcion || isNaN(parseFloat(ToRecepcion))) {
            alert('Por favor, ingresa una temperatura válida.');
            return;
        }

        // Crea un objeto con los datos actualizados de la muestra y lo envía a la API para su actualización
        const newMuestra = {
            Comentario,
            ToRecepcion,
            NombreOrganismo,
            Peso,
            Analisis
        };

        try {
            await axios.put(`http://localhost:4000/api/muestras/${_id}`, newMuestra);
            navigate('/inicio');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Genera e imprime una etiqueta con el ID del análisis seleccionado
    const printLabel = async (id) => {
        const labelXml = generateLabelXml(id);
        try {
            const response = await axios.post('http://localhost:4000/api/print/print', { labelData: labelXml });
            alert(response.data);
        } catch (error) {
            console.error('Error printing label:', error);
            alert('Failed to print label');
        }
    };

    // Maneja los cambios en los valores de los campos del formulario y actualiza el estado correspondiente
    const onInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'content':
                setComentario(value);
                break;
            case 'NombreOrganismo':
                setNombreorganismo(value);
                break;
            case 'peso':
                setPeso(value);
                break;
            case 'ToRecepcion':
                setToRecepcion(value);
                break;
            case 'estado':
                setEstado(value);
                break;
            default:
                break;
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header">
                    <h4 className="mb-0"><strong> Muestra: {_id}</strong></h4>
                </div>
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        {/* Muestra el nombre del cliente de manera no editable */}
                        <div className="form-group mb-3">
                            <label><strong>Cliente</strong></label>
                            <div className="form-control-plaintext bg-light border rounded py-2 px-3">
                                {clienteSelected}
                            </div>
                        </div>

                        {/* Sección para detalles del organismo */}
                        <div className="form-group mb-3">
                            <label><strong>Detalles del organismo</strong></label>
                            <div className="row">
                                <div className="col-sm-6 mb-3">
                                    {/* Permite la edición del nombre del organismo solo si no es "agua" */}
                                    {NombreOrganismo === 'agua' ? (
                                        <div className="form-control-plaintext bg-light border rounded py-2 px-3">
                                            {NombreOrganismo}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="NombreOrganismo"
                                            value={NombreOrganismo}
                                            onChange={onInputChange}
                                            placeholder="Nombre del Organismo"
                                        />
                                    )}
                                </div>
                                {/* Campo de entrada para ingresar el peso del organismo recibido */}
                                <div className="col-sm-3 mb-3">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="peso"
                                            value={Peso}
                                            onChange={onInputChange}
                                            placeholder="Peso"
                                        />
                                        <span className="input-group-text">gr</span>
                                    </div>
                                </div>
                                {/* Campo de entrada para la temperatura de recepción */}
                                <div className="col-sm-3 mb-3">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="ToRecepcion"
                                            value={ToRecepcion}
                                            onChange={onInputChange}
                                            placeholder="Temperatura"
                                        />
                                        <span className="input-group-text">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container">
    <div className="row">
        <label><strong>Análisis Solicitados</strong></label>
        {Analisis.map((item, index) => {
            let bgColor;
            switch (item.Estado) {
                case 'positivo': bgColor = 'rgba(255, 0, 0, 0.5)'; break;
                case 'negativo': bgColor = 'rgba(0, 128, 0, 0.5)'; break;
                case 'pendiente': bgColor = 'rgba(128, 128, 128, 0.5)'; break;
                case 'procesado': bgColor = 'rgba(255, 165, 0, 0.5)'; break;
                default: bgColor = '#fff';
            }

            return (
                <div key={index} className="col-md-4 col-sm-12 mb-3">
                    <div className="p-3 border rounded" style={{ backgroundColor: bgColor }}>
                        <p><strong>Tipo:</strong> {item.Type}</p>
                        <p><strong>ID:</strong> {item._id}</p>

                        <label><strong>Estado:</strong></label>
                        <select
                            className="form-select mt-2"
                            value={item.Estado}
                            onChange={(e) => {
                                const newAnalisis = [...Analisis];
                                newAnalisis[index].Estado = e.target.value;
                                setAnalisis(newAnalisis);
                            }}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="procesado">Procesado</option>
                            <option value="positivo">Positivo</option>
                            <option value="negativo">Negativo</option>
                        </select>

                        <button
                            onClick={() => printLabel(item._id)}
                            className="btn btn-secondary mt-2 w-100"
                        >
                            Imprimir Etiqueta
                        </button>
                    </div>
                </div>
            );
        })}
    </div>

</div>

     


                        <div className="form-group">
                            <label><b>Observaciones:</b></label>
                            <textarea
                                className="form-control"
                                placeholder="Comentarios"
                                name="content"
                                onChange={onInputChange}
                                required
                                value={Comentario}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditMuestra;

