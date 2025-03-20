import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { UserContext } from './UserContext';
import { Link } from "react-router-dom";

const Lotes = () => {
    const [lotes, setLotes] = useState([]); // Almacena el arreglo de lotes
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useContext(UserContext); // Obtiene el usuario para determinar permisos

    useEffect(() => {
        getLotes();
    }, []);

    // Obtiene los lotes desde la API y los almacena en el arreglo de lotes
    const getLotes = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/lotes');
            setLotes(res.data);
        } catch (error) {
            console.error("Error al obtener los lotes:", error);
        }
    };

    // Muestra una confirmación y, si el usuario acepta, elimina el lote de la base de datos
    const handleDelete = async (loteId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este lote?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:4000/api/lotes/${loteId}`);
                getLotes(); // Recarga la lista después de eliminar
            } catch (error) {
                console.error("Error al eliminar el lote:", error);
            }
        }
    };

    // Maneja la actualización del estado con el término de búsqueda ingresado por el usuario
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Cambia el criterio de ordenamiento cuando el usuario selecciona un campo
    const handleSortChange = (field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
    };

    // Filtra los lotes según los criterios de búsqueda y las fechas, y los ordena según el campo y dirección seleccionados
    const sortedLotes = lotes
        .filter(lote => {
            const isDateInRange = !startDate || !endDate || (
                lote.createdAt.split('T')[0] >= startDate &&
                lote.createdAt.split('T')[0] <= endDate
            );

            return isDateInRange && (
                lote.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lote._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lote.cliente.nombreCliente?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => {
            if (!sortField) return 0;

            const getValue = (obj, path) => path.split('.').reduce((value, key) => value[key], obj);

            const aValue = sortField === 'cliente' ? getValue(a, 'cliente.nombreCliente') : getValue(a, sortField);
            const bValue = sortField === 'cliente' ? getValue(b, 'cliente.nombreCliente') : getValue(b, sortField);

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col">
                    <input
                        type="text"
                        placeholder="Buscar lotes..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="form-control"
                    />
                </div>
                <div className="col-auto">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="col-auto">
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="col-auto">
                    {/* Selector para elegir el campo de ordenamiento de los lotes */}
                    <select onChange={(e) => handleSortChange(e.target.value)} className="form-control">
                        <option value="">Ordenar por...</option>
                        <option value="Comentario">Comentario</option>
                        <option value="_id">ID</option>
                        <option value="date">Fecha de Registro</option>
                        <option value="cliente.nombreCliente">Cliente</option>
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

            <div className="table-responsive">
                {/* Tabla que muestra los lotes */}
                <table className="table table-striped table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>NombredelLote</th>
                            <th>ID</th>
                            <th>Fecha de Registro</th>
                            <th>Cliente</th>
                            <th>Muestras</th>
                            {user.rol === 'Administrador' && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLotes.map(lote => (
                            <tr key={lote._id}>
                                <td>{lote.nombre}</td>
                                <td>{lote._id}</td>
                                <td>{format(new Date(lote.createdAt), 'dd/MM/yyyy')}</td>
                                <td>{lote.cliente?.nombreCliente || 'N/A'}</td>
                                <td>
    <ul className="list-unstyled mb-0">
        {lote.muestras.map((muestra, index) => (
            <li key={index}>
                <Link to={`/Muestra/${muestra._id}/edit`}>{muestra._id}</Link>
            </li>
        ))}
    </ul>
</td>
                                {user.rol === 'Administrador' && (
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(lote._id)}
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

export default Lotes;
