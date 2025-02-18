import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { UserContext } from './UserContext';

export default function RecepcionMuestras() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]); // Almacena los clientes
    const { user } = useContext(UserContext); // Guarda el usuario que esta usando el sistema
    const { setSampleType } = useContext(UserContext); // Se guarda el tipo de muestra como valor global
    // Valores a almacenar en caso de que se reagende la muestra
    const [motivo, setMotivo] = useState(''); 
    const [descripcion, setDescripcion] = useState('');
    const [rechazar, setRechazar] = useState(false);
    const [clienteRegular, setClienteRegular] = useState(false);
    const [fechaAgenda, setFechaAgenda] = useState(new Date());
    const [cliente, setCliente] = useState(''); 

    const [type, setType] = useState('agua'); // tipo de muestra 
    const [errors, setErrors] = useState([]); // Muestra los errores a la hora de crear un nota
    const [dataLoaded, setDataLoaded] = useState(false); // Evita que se trabe la opcion de seleccion de cliente al evitar que se recargue múltiples veces
    // Maneja los checklist de los requerimientos para las muestras de molusco
    const [va, setVa] = useState();
    const [vb, setVb] = useState();
    const [vc, setVc] = useState();
    const [vd, setVd] = useState();
    const [ve, setVe] = useState();
    const [vf, setVf] = useState();
    const [vi, setVi] = useState();

    const updateDescripcion = () => {
        let newDescripcion = '';
        if (type === 'molusco') {
            if (!va) newDescripcion += 'No se presenta en talla comercial\n';
            if (!vb) newDescripcion += 'Se presentan alteraciones\n';
            if (!vc) newDescripcion += 'En el momento de su presentacion han transcurrido mas de 24 horas despues de haber sido extraidas\n';
            if (!vd) newDescripcion += 'No se presentan en bolsa de plastico transparente como contenedor primario\n';
            if (!ve) newDescripcion += 'El contenedor primario no tiene adherida una etiqueta de identificacion y presenta alteraciones en donde se presenta la informacion requerida en los campos 1, 8, 10 y 13 de este formato (como minimo)\n';
            if (!vf) newDescripcion += 'El contenedor primario no es transportado en una hielera con blue ice/hielo suficiente para mantener una temperatura entre 4 y 10 grados centigrados\n';
            if (!vi) newDescripcion += 'No se presenta la cantidad suficiente para los analisis solicitados\n'; 
        }
    
        setDescripcion(newDescripcion.trim());
      };

    const { id: routeId } = useParams(); // Access route parameter

    useEffect(() => {
        const fetchData = async () => {
          const res = await axios.get('http://localhost:4000/api/clientes');
          if (!res.data || res.data.length === 0) {
            alert("No hay clientes creados. Por favor, crea un cliente.");
            navigate("/");
          }
          setClientes(res.data);
          if (!dataLoaded) { 
            setCliente(res.data[0].nombreCliente);
            setDataLoaded(true); 
        }
        
        };
    
        fetchData();
        updateDescripcion();
      }, [routeId, va, vb, vc, vd, ve, vf, vi]);

      // Crea una nota 
      const onSubmit = async (e) => {
        e.preventDefault();

        if (rechazar === false) {
            navigate("/create");
        }

        setSampleType(type); 

        const newNote = {
            cliente: cliente,
            fechaAgenda: fechaAgenda,
            motivo: motivo,
            descripcion: descripcion,
            responsable: user ? user.username : 'Unknown'
        };

        let verification = true;
        const today = new Date();
        const agendaDate = new Date(newNote.fechaAgenda);
        const newErrors = [];

        if (agendaDate <= today) {
            verification = false;
            newErrors.push('La fecha agendada debe ser posterior al día de hoy.');
        }

        if (!motivo || motivo.trim() === '') {
            verification = false;
            newErrors.push('El motivo es obligatorio.');
        }

        if (verification) {
            try {
                await axios.post('http://localhost:4000/api/notes', newNote); // Registra la nota en la base de datos
                navigate("/notes");
            } catch (error) {
                newErrors.push('Error al crear la nota. Por favor, inténtalo de nuevo.');
            }
        }

        setErrors(newErrors);
    };

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        switch (name) {
            case 'type':
                setType(value);
                break;
            case 'motivo':
                setMotivo(value);
                break;
            case 'descripcion':
                setDescripcion(value);
                break;
            case 'va':
                setVa(type === 'checkbox' ? (checked ? value : '') : value);
                break;
            case 'vb':
                setVb(type === 'checkbox' ? (checked ? value : '') : value);
                break;
            case 'vc':
                setVc(type === 'checkbox' ? (checked ? value : '') : value);
                break;
            case 'vd':
                setVd(type === 'checkbox' ? (checked ? value : '') : value);
                break;
            case 've':
                setVe(type === 'checkbox' ? (checked ? value : '') : value);
                break;
            case 'vf':
                setVf(type === 'checkbox' ? (checked ? value : '') : value);
                break;
            case 'vi':
                setVi(type === 'checkbox' ? (checked ? value : '') : value);
                break;
            default:
                break;
        }
    };

    // Verifica que el checklist este bien para proceder
    const allChecked = (type) => {
    if (type === 'molusco') {
        return va && vb && vc && vd && ve && vf && vi;
    } else {
        return true;
    }
    };
    const onChangeAgenda = fechaAgenda => {
        setFechaAgenda(fechaAgenda);
    };

    const handleRechazar = () => {
        if (rechazar == false) {
            setRechazar(true);
        }
        else {
            setRechazar(false);
        }
    };

    // Función para renderizar los checkbox con sus etiquetas
    const renderCheckbox = (name, labelTrue, value, setValue) => (
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ maxWidth: '600px', wordWrap: 'break-word' }}>{labelTrue}: </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ marginRight: '10px' }}>
                    <input
                        type="checkbox"
                        name={name}
                        value="Si"
                        checked={value === true}
                        onChange={(e) => setValue(e.target.checked ? true : "")}
                    />
                    Si
                </label>
                <label>
                    <input
                        type="checkbox"
                        name={name}
                        value="No"
                        checked={value === false}
                        onChange={(e) => setValue(e.target.checked ? false : "")}
                    />
                    No
                </label>
            </div>
        </div>
    );



    if (rechazar === false) {
        return (
            // Pantalla principal de recepcion de muestras
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4><strong>Recepción de muestras</strong></h4>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label><strong>Tipo de muestra:</strong> </label>
                        <select
                            className="form-control"
                            name="type"
                            onChange={onInputChange}
                            value={type}
                        >

                            <option value="agua">Agua</option>
                            <option value="molusco">Moluscos</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    {type === "molusco" && (
                            <>

                                {renderCheckbox("va", "Se presenta en talla comercial", va, setVa)}
                                {renderCheckbox("vb", "Se presentan sin alteraciones", vb, setVb)}
                                {renderCheckbox("vc", "En el momento de su presentacion no han transcurrido mas de 24 horas despues de haber sido extraidas", vc, setVc)}
                                {renderCheckbox("vd", "Se presentan en bolsa de plastico transparente como contenedor primario", vd, setVd)}
                                {renderCheckbox("ve", "El contenedor primario tiene adherida una etiqueta de identificacion y sin alteraciones en donde se presenta la informacion requerida en los campos 1, 8, 10 y 13 de este formato (como minimo) ", ve, setVe)}
                                {renderCheckbox("vf", "El contenedor primario es transportado en una hielera con blue ice/hielo suficiente para mantener una temperatura entre 4 y 10 grados centigrados", vf, setVf)}
                                {renderCheckbox("vi", "Se presenta la cantidad suficiente para los analisis solicitados", vi, setVi)}

                            </>
                        )}

                    <div className="form-group " style={{ marginBottom: '20px' }}>
                        <label><strong>Comentarios</strong></label>
                        <textarea
                            className="form-control"
                            placeholder="Contenido"
                            name="motivo"
                            onChange={onInputChange}
                            required
                            value={motivo}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '10px' }}><strong>De acuerdo a la inspección visual de la muestra:</strong></label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <form onSubmit={onSubmit}>
                            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }} disabled={!allChecked(type)}>
                                Acepta
                            </button>
                            </form>
                            <button type="button" className="btn btn-danger" onClick={handleRechazar}>
                                Rechaza
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="col-md-6 offset-md-3" >
                {errors.length > 0 && (
                <div className="error-messages">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            {/* Muestra la pantalla de Reprogramacion de cita */}
                <div className="card card-body" style={{ marginTop: '20px' }}>
                    <h4>Reprogramacion de cita</h4>
                    <div className="form-group">
                        <label>¿Es un cliente regular?</label>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="clienteRegular"
                                checked={clienteRegular}
                                onChange={(e) => setClienteRegular(e.target.checked)}
                            />
                            <label className="form-check-label">Sí</label>
                        </div>
                    </div>
                    {clienteRegular === true && (
                        <>
                            <label><strong>Cliente:</strong></label>
                            <select
                                className="form-control" style={{ marginBottom: '20px' }}
                                name="receptor"
                                onChange={(e) => setCliente(e.target.value)}
                                value={cliente}
                            >
                                {clientes.map(Cliente =>
                                    <option key={Cliente._id} value={Cliente.nombreCliente}>
                                        {Cliente.nombreCliente}
                                    </option>
                                )}
                            </select>
                        </>
                    )}
                    {clienteRegular === false && (
                        <>
                            <div className="form-group"  >
                                <label><strong>Nombre de cliente:</strong></label>
                                <input
                                    type="text"
                                    className="form-control "
                                    value={cliente}
                                    onChange={(e) => setCliente(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group"  >
                        <label><strong>Motivo de reprogramación:</strong></label>
                        <textarea
                            className="form-control " style={{ marginBottom: '20px' }}
                            placeholder="motivo"
                            name="motivo"
                            onChange={onInputChange}
                            required
                            value={motivo}
                        />
                        {type === "molusco" && (
                        <>
                            {!va && renderCheckbox("va", "Se presenta en talla comercial", va, setVa)}
                            {!vb && renderCheckbox("vb", "Se presentan sin alteraciones", vb, setVb)}
                            {!vc && renderCheckbox("vc", "En el momento de su presentacion no han transcurrido mas de 24 horas despues de haber sido extraidas", vc, setVc)}
                            {!vd && renderCheckbox("vd", "Se presentan en bolsa de plastico transparente como contenedor primario", vd, setVd)}
                            {!ve && renderCheckbox("ve", "El contenedor primario tiene adherida una etiqueta de identificacion y sin alteraciones en donde se presenta la informacion requerida en los campos 1, 8, 10 y 13 de este formato (como minimo) ", ve, setVe)}
                            {!vf && renderCheckbox("vf", "El contenedor primario es transportado en una hielera con blue ice/hielo suficiente para mantener una temperatura entre 4 y 10 grados centigrados", vf, setVf)}
                            {!vi && renderCheckbox("vi", "Se presenta la cantidad suficiente para los analisis solicitados", vi, setVi)}
                        </>
                    )}
                        <label><strong>Comentarios:</strong></label>
                        <textarea
                            className="form-control" tyle={{ marginBottom: '20px' }}
                            placeholder="Opcional"
                            name="descripcion"
                            onChange={onInputChange}
                            required
                            value={descripcion}
                        />
                    </div>
                    <div className="form-group"   >
                        <label><strong>Fecha de reprogramación:</strong> </label>
                        <DatePicker
                            className="form-control"
                            selected={fechaAgenda}
                            onChange={onChangeAgenda}
                            dateFormat="dd/MM/yyyy"
                            value={format(fechaAgenda, 'dd/MM/yyyy')}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <form onSubmit={onSubmit}>
                            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
                                Guardar
                            </button>
                        </form>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button type="button" className="btn btn-secondary" onClick={handleRechazar}>
                                Regresar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

