import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CreateCliente = () => {
    // Estados para manejar los datos del formulario
    const [nombreCliente, setnombreCliente] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [editing, setEditing] = useState(false);
    const [muestras, setMuestras] = useState([]);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID del cliente desde la URL

    useEffect(() => {
        if (id) {
            fetchData(); // Carga los datos del cliente si está en modo edición
            fetchMuestras(); // Carga las muestras asociadas al cliente
        }
    }, [id]);

    // Obtiene los datos de un cliente desde la API si se está editando
    const fetchData = async () => {
        try {
            const clienteRes = await axios.get(`http://localhost:4000/api/clientes/${id}`);
            setnombreCliente(clienteRes.data.nombreCliente);
            setAddress(clienteRes.data.address);
            setPhone(clienteRes.data.phone);
            setRazonSocial(clienteRes.data.razonSocial);
            setEmail(clienteRes.data.email);
            setEditing(true);
        } catch (error) {
            console.error('Error al obtener datos del cliente:', error);
        }
    };

    // Obtiene todas las muestras asociadas al cliente
    const fetchMuestras = async () => {
        try {
            const muestrasRes = await axios.get(`http://localhost:4000/api/muestras/cliente/${id}`);
            setMuestras(muestrasRes.data);
        } catch (error) {
            console.error('Error al obtener muestras:', error);
        }
    };

    // Valida que el nombre del cliente comience con mayúscula y solo tenga letras y espacios
    const validateNombreCliente = (value) => {
        return /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]*(\s[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]*)*$/.test(value);
    };

    // Valida que la razón social comience con mayúscula y solo contenga letras, puntos y espacios
    const validateRazonSocial = (value) => {
        return /^[A-ZÁÉÍÓÚÜÑ][A-Za-zÁÉÍÓÚÜÑa-záéíóúüñ\s.]*$/.test(value);
    };

    // Maneja la entrada del número de teléfono y lo almacena en formato internacional
    const onChangePhone = (value, country, e, formattedValue) => {
        setPhone(formattedValue);
    };

    // Maneja el envío del formulario, ya sea para registrar o actualizar un cliente
    const onSubmit = async (e) => {
        e.preventDefault();

        // Validaciones antes de enviar los datos
        if (!validateNombreCliente(nombreCliente)) {
            alert('El nombre del cliente debe empezar con mayúscula y no contener caracteres especiales.');
            return;
        }
        if (!validateRazonSocial(razonSocial)) {
            alert('La razón social debe empezar con mayúscula y solo contener letras, puntos y espacios.');
            return;
        }

        // Obtiene solo los dígitos del teléfono sin caracteres especiales
        const phoneNumber = phone.replace(/[^0-9]/g, '');
        if (phoneNumber.length !== 12) {
            alert('El teléfono debe contener 12 dígitos en formato internacional.');
            return;
        }

        // Objeto con los datos a enviar
        const newCliente = {
            nombreCliente,
            phone: phoneNumber, 
            email,
            address,
            razonSocial
        };

        try {
            if (editing) {
                await axios.put(`http://localhost:4000/api/clientes/${id}`, newCliente);
            } else {
                await axios.post('http://localhost:4000/api/clientes', newCliente);
            }

            // Reiniciar los campos después del envío exitoso
            setnombreCliente('');
            setPhone('');
            setEmail('');
            setAddress('');
            setRazonSocial('');

            navigate('/clientes'); // Redirige a la lista de clientes
        } catch (error) {
            setError(error.response?.data?.message || 'Error al crear cliente');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mt-4 align-items-center">
            <div className="col-md-8">
                <div className="card card-body">
                    <h3>{editing ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h3>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label><strong>Nombre de la compañía</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={nombreCliente}
                                onChange={(e) => setnombreCliente(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Razón Social</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={razonSocial}
                                onChange={(e) => setRazonSocial(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Teléfono</strong></label>
                            <PhoneInput
                                country={'mx'}
                                value={phone}
                                onChange={onChangePhone}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                    className: 'form-control'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Correo electrónico</strong></label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Dirección</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editing ? 'Actualizar' : 'Guardar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCliente;

