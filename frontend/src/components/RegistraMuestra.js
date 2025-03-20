import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { generateLabelXml } from './labelGenerator2';//cambio de impresora 
const RegistraMuestra = () => {
    const [isSubmitting, setIsSubmitting] = useState(false); // Previene subir multiples solicitudes de mueestras y generar errores con los contadores.
    const [dataLoaded, setDataLoaded] = useState(false); // verifica que no hayan multiples instancias de el useffect donde se reinicie el valor del tipo de muestra  
    const navigate = useNavigate();
    // Manejan la funcionalidad de los lotes
    const [lote, setLote] = useState(false);
    const [selectedLote, setSelectedLote] = useState(null);
    const [lotes, setLotes] = useState([]); //Almacena los lotes de la base de datos
    const [loteRegistrado, setLoteRegistrado] = useState('');
    const [NombreLote, setNombreLote] = useState('');
    // Manejan la funcionalidad de los clientes
    const [clienteSelected, setClienteSelected] = useState('');
    const [clientes, setClientes] = useState([]); // Almancena los clientes que se tienen registados
    // Datos generales de la muestra
    const [analisis, setAnalisis] = useState([]); // Guarda los analisis que se van a asociar
    const { user } = useContext(UserContext);
    const [Comentario, setComentario] = useState('');
    const [NombreOrganismo, SetNombreorganismo] = useState('');
    const [Peso, setPeso] = useState('');
    const [ToRecepcion, setToRecepcion] = useState('');
    const { sampleType } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch clientes
                const clientRes = await axios.get('http://localhost:4000/api/clientes'); // Solicita al API los clientes
                if (!clientRes.data || clientRes.data.length === 0) {
                    alert("No hay clientes creados. Por favor, crea un cliente.");
                    navigate("/");
                }
                setClientes(clientRes.data);

                // Fetch lotes
                const lotRes = await axios.get('http://localhost:4000/api/lotes'); // Solicita al API los lotes
                if (lotRes.data) {
                    setLotes(lotRes.data);
                }
                // Esto solo se corre una vez
                if (!dataLoaded) {
                    setClienteSelected(clientRes.data[0]._id);
                    if (sampleType === 'agua') {
                        SetNombreorganismo('agua');
                    }
                    setDataLoaded(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [dataLoaded, sampleType, navigate]);

    // Obtiene los contadores
    const fetchContadores = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/contador');
            return response.data;
        } catch (error) {
            console.error('Error fetching contadores:', error);
            return {};
        }
    };

    // Genera los objetos analisis junto con su respectivo contador
    const generateAnalisisIds = (analisis, contadores) => {
        return analisis.map(analisisItem => {
            const count = contadores[`contador${analisisItem.Type}`] || 0;
            const year = new Date().getFullYear();
            const lastTwoDigitsOfYear = year.toString().slice(-2);
            const newId = `${analisisItem.Type}-${lastTwoDigitsOfYear}-${count + 1}`;
            return { ...analisisItem, _id: newId };
        });
    };

    const getLetterFromIndex = (index) => {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[index] || "Z"; // Si el índice supera 25, usa "Z"
    };

    const actualizarUltimoAnalisis = async (selectedLote) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/lotes/${selectedLote._id}/cantidadMuestras`);
            const { cantidadMuestras, analisis } = res.data;
    
            const letra = getLetterFromIndex(cantidadMuestras);
    
            if (!Array.isArray(analisis) || analisis.length === 0) {
                console.error("Error: No hay análisis registrados en el lote.");
                return [];
            }
    
            // Mantener la estructura del objeto en la actualización
            const nuevoAnalisis = analisis.map(analisisItem => ({
                ...analisisItem,
                _id: `${analisisItem._id}-${letra}` // Conservar el objeto y solo modificar el _id
            }));
    
            return nuevoAnalisis;
        } catch (error) {
            console.error("Error al actualizar análisis:", error);
            return [];
        }
    };
    
    
    




    const onSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Previene múltiples llamadas

        //Verifica que las entradas sean válidas
        if (!NombreOrganismo || !/^[A-Za-záéíóúüñ\s]+$/.test(NombreOrganismo)) {
            alert('Por favor, ingresa un nombre de organismo válido (solo letras y espacios).');
            return;
        }
        if (selectedLote == "" && selectedLote) {
            alert('Por favor, Selecciona un lote asociado al cliente.');
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

        setIsSubmitting(true);
        const contadores = await fetchContadores();
        let updatedAnalisis;
       
        if (lote) {
            if (loteRegistrado === "si") {
                // Genera los IDs para cada análisis
                updatedAnalisis = await actualizarUltimoAnalisis(selectedLote, updatedAnalisis);   
            }
            else {
                // Genera el ID con notacion de lote
                updatedAnalisis = generateAnalisisIds(analisis, contadores);
                updatedAnalisis = updatedAnalisis.map(analisisItem => ({
                    ...analisisItem,
                    _id: `${analisisItem._id}-A`
                }));
            }
        } else {
           
            // Genera los IDs para cada análisis
            updatedAnalisis = generateAnalisisIds(analisis, contadores);
            console.log(updatedAnalisis);
        }


        // Genera el objeto Muestra
        const newMuestra = {
            Analisis: updatedAnalisis,
            Responsable: user ? user.username : 'Unknown',
            Comentario: Comentario,
            ToRecepcion: ToRecepcion,
            NombreOrganismo: NombreOrganismo,
            Peso: Peso,
            ClienteId: clienteSelected,
        };


        try {
            const res = await axios.get(`http://localhost:4000/api/contador`); // Obtiene los contadores
            const contador = res.data;
            if (!contador) {
                throw new Error('Contador no encontrado');
            }

            const response = await axios.post('http://localhost:4000/api/muestras', newMuestra);
            // Verifica si la muestra se registró correctamente
            if (response.data && response.data.message === 'Muestra guardada') {
                const muestraId = response.data.muestra._id; // ID de la muestra creada
                console.log('Muestra registrada correctamente');

                // Asocia la muestra a un lote en caso de estar contemplado
                if (lote) {
                    if (selectedLote) {
                        // Guarda la muestra en el lote seleccionado
                        const loteResponse = await axios.post(`http://localhost:4000/api/lotes/${selectedLote._id}/muestra/${muestraId}`);
                        if (loteResponse.data && loteResponse.data.message === 'Muestra agregada al lote') {
                            console.log('Muestra asociada correctamente al lote');
                        } else {
                            throw new Error('Error asociando muestra al lote');
                        }
                    }

                    else {
                       
                        const newLote = {
                            muestraId: muestraId,
                            clienteId: clienteSelected,
                            Nombre: NombreLote,
                        };
                        // Crea un nuevo lote
                        const loteResponse = await axios.post(`http://localhost:4000/api/lotes`, newLote);
                        if (loteResponse.data && loteResponse.data.message === 'Lote registrado exitosamente') {
                            console.log('Muestra asociada correctamente al lote');
                        } else {
                            throw new Error('Error asociando muestra al lote');
                        }
                        // Incrementa el contador
                        for (const analysis of newMuestra.Analisis) {
                            await axios.post(`http://localhost:4000/api/contador/${analysis.Type}`);
    
                        }
                    }
                }
                else {
                    // Incrementa el contador
                    for (const analysis of newMuestra.Analisis) {
                        await axios.post(`http://localhost:4000/api/contador/${analysis.Type}`);

                    }
                }
                for (const analysis of newMuestra.Analisis) {
                    // Genera el XML para la etiqueta con el ID de la muestra                    
                    // Envía la solicitud para imprimir la etiqueta
                    const labelXml = generateLabelXml(analysis._id);
                    try {
                        await axios.post('http://localhost:4000/api/print/print', { labelData: labelXml });
                        alert('Se mando a imprimir una etiqueta.');

                    } catch (error) {
                        console.error('Error printing label:', error);
                        alert('Failed to print label');
                    }

                }

            }

            navigate("/inicio"); // En caso de crear la muestra, manda al inicio
        } catch (error) {
            console.error('Error creating muestra:', error);
        }

    };


    // Actualiza valores de la muestra
    const onInputChange = (e) => {
        switch (e.target.name) {
            case 'content':
                setComentario(e.target.value);
                break;
            case 'peso':
                setPeso(e.target.value);
                break;
            case 'ToRecepcion':
                setToRecepcion(e.target.value);
                break;
            case 'NombreOrganismo':
                SetNombreorganismo(e.target.value);
                break;
            case 'clienteSelected':
                setSelectedLote("");
                setClienteSelected(e.target.value);
                break;
            case 'loteRegistrado':
                setLoteRegistrado(e.target.value);
                break;
            case 'NombreLote':
                setNombreLote(e.target.value);
            default:
                break;
        }
    };

    // Permite seleccionar los analisis asociados a la muestra
    const onCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            const newAnalisis = {
                Estado: 'pendiente', // Estado fijo con el que se registran las muestras
                _id: '',
                Metodo: '', // Queda pendiente
                Type: value, // El valor del análisis seleccionado
            };
            setAnalisis([...analisis, newAnalisis]);
        } else {
            setAnalisis(analisis.filter((item) => item.Type !== value));
        }
    };

    // Guarda el valor de lote seleccionado
    const handleLoteSelect = (event) => {
        const selectedLoteId = event.target.value;
        if (selectedLoteId) {
            const selectedLote = lotes.find(lote => lote._id === selectedLoteId);
            setSelectedLote(selectedLote);
        }
    }


    return (
        <div className="container">
            <div className="col-md-6">
                <div className="card card-body">
                    <h4>Registrar Muestra</h4>
                    <div className="form-group">
                        <label><b>Cliente:</b></label>
                        {/* Muestra los clientes registrados */}
                        <select
                            className="form-control"
                            name="clienteSelected"
                            onChange={onInputChange}
                            value={clienteSelected}
                        >
                            {clientes.map(cliente => (
                                <option key={cliente._id} value={cliente._id}>
                                    {cliente.nombreCliente}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                            <label> Se recibe un lote? </label>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="lote"
                                    checked={lote}
                                    onChange={() => setLote(prevState => !prevState)}
                                />
                                <span style={{ marginLeft: '5px' }}>Sí</span>
                            </div>
                        </div>

                        {lote && (
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                <label style={{ marginRight: '10px' }}>¿El lote ya está registrado?</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="loteRegistrado"
                                        value="si"
                                        checked={loteRegistrado === 'si'}
                                        onChange={onInputChange}
                                    />
                                    <span style={{ marginLeft: '5px' }}>Sí</span>
                                    <input
                                        type="radio"
                                        name="loteRegistrado"
                                        value="no"
                                        checked={loteRegistrado === 'no'}
                                        onChange={onInputChange}
                                        style={{ marginLeft: '20px' }}
                                    />
                                    <span style={{ marginLeft: '5px' }}>No</span>
                                </div>
                            </div>
                        )}
                        { loteRegistrado === 'no' && lote && (

                            <div style={{
                                marginTop: '10px',
                                padding: '15px',
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                border: '1px solid #f5c6cb',
                                borderRadius: '5px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}>
                                <div className="form-group">
                                    <label><b>Nombre del Lote:</b></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="NombreLote"
                                        value={NombreLote}
                                        onChange={onInputChange}
                                    />
                                </div>
                                ¡Un nuevo lote se creará para este cliente!
                            </div>
                        )}

                        {lote && loteRegistrado === 'si' && (
                            // Muestra los lotes registrados acorde al cliente
                            <div>
                                <div className="form-group">
                                    <label><b>Seleccionar Lote:</b></label>
                                    <select
                                        className="form-control"
                                        name="loteSelected"
                                        onChange={handleLoteSelect}
                                        value={selectedLote ? selectedLote._id : ''}
                                    >
                                        <option value="">Seleccione un lote</option>
                                        {lotes.filter(lote => lote.cliente._id === clienteSelected).length > 0 ? (
                                            lotes.filter(lote => lote.cliente._id === clienteSelected).map(lote => (
                                                <option key={lote._id} value={lote._id}>
                                                    {lote.nombre} - {new Date(lote.createdAt).toLocaleDateString()}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No hay lotes asociados para el cliente seleccionado</option>
                                        )}
                                    </select>
                                </div>


                            </div>
                        )}
                    </div>
                    {sampleType === 'agua' ? (
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <div>
                                <label><b>Tipo de muestra:</b></label>
                                <div className="form-control" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', padding: '0.375rem 0.75rem' }}>
                                    {NombreOrganismo}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label><b>Nombre del organismo:</b></label>
                            <input
                                type="text"
                                className="form-control"
                                name="NombreOrganismo"
                                value={NombreOrganismo}
                                onChange={onInputChange}
                            />
                        </div>
                    )}
                    {sampleType === 'agua' ? (
                        <div className="form-group">
                            <label><b>Profundidad del agua:</b></label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="peso"
                                    value={Peso}
                                    onChange={onInputChange}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text">m</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label><b>Cantidad/peso de organismos recibidos:</b></label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="peso"
                                    value={Peso}
                                    onChange={onInputChange}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text">gr</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label><b>Temperatura en el momento de la recepción:</b></label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="ToRecepcion"
                                value={ToRecepcion}
                                onChange={onInputChange}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text">°C</span>
                            </div>
                        </div>
                    </div>
                    {sampleType === 'agua' ? (
                        <div>
                            <div className="form-group">
                                <label><b>Análisis solicitados:</b></label>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="analisis"
                                            value="FITO"
                                            onChange={onCheckboxChange}
                                        /> Fitoplanton
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="analisis"
                                            value="CLR"
                                            onChange={onCheckboxChange}
                                        /> Clorofila
                                    </label>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div>
                            <div className="form-group">
                                <label><b>Análisis solicitados:</b></label>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="analisis"
                                            value="ASP"
                                            onChange={onCheckboxChange}
                                        /> Ácido domoico
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="analisis"
                                            value="DSP"
                                            onChange={onCheckboxChange}
                                        /> Toxinas lipofílicas
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="analisis"
                                            value="PSP"
                                            onChange={onCheckboxChange}
                                        /> Toxinas Paralizantes
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
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
                    <form onSubmit={onSubmit}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            Registrar Muestra
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default RegistraMuestra;
