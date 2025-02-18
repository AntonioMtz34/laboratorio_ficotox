import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

const ListadeMuestras = () => {
    // Estado para almacenar la lista de muestras obtenidas desde la API
    const [muestras, setMuestras] = useState([]);
    
    // Estado para la búsqueda de muestras
    const [searchQuery, setSearchQuery] = useState('');
    
    // Estado para manejar la ordenación de la lista
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    
    // Estado para manejar el filtro por rango de fechas
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Obtiene la información del usuario desde el contexto
    const { user } = useContext(UserContext);

    // Llama a la función para obtener las muestras cuando el componente se monta
    useEffect(() => {
        getMuestras();
    }, []);

    // Una vez cargadas las muestras, establece el rango de fechas por defecto
    useEffect(() => {
        if (muestras.length > 0) {
            const oldestDate = muestras.reduce((oldest, muestra) => {
                const muestraDate = new Date(muestra.createdAt);
                return muestraDate < oldest ? muestraDate : oldest;
            }, new Date(muestras[0].createdAt));

            setStartDate(format(oldestDate, 'yyyy-MM-dd'));
            setEndDate(format(new Date(), 'yyyy-MM-dd'));
        }
    }, [muestras]);

    // Obtiene la lista de muestras desde la API y la almacena en el estado
    const getMuestras = async () => {
        const res = await axios.get('http://localhost:4000/api/muestras');
        setMuestras(res.data);
    };

    // Maneja la eliminación de una muestra después de la confirmación del usuario
    const handleDelete = async (muestraId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta muestra?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:4000/api/muestras/${muestraId}`);
                getMuestras(); // Recarga la lista después de la eliminación
            } catch (error) {
                console.error("Error al eliminar la muestra:", error);
            }
        }
    };

    // Actualiza el estado de búsqueda con el valor ingresado por el usuario
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Cambia el campo y la dirección de ordenamiento de la lista de muestras
    const handleSortChange = (field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
    };

    // Filtra y ordena las muestras según la búsqueda, rango de fechas y ordenamiento seleccionado
    const sortedMuestras = muestras
        .filter(muestra => {
            const isDateInRange = !startDate || !endDate || (
                (muestra.createdAt.split('T')[0]) >= startDate && 
                (muestra.createdAt.split('T')[0]) <= endDate
            );

            return isDateInRange && (
                muestra.Responsable?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                muestra._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                muestra.cliente.nombreCliente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                muestra.Analisis.some(analisis => analisis.Estado.toLowerCase().includes(searchQuery.toLowerCase())) ||
                muestra.Analisis.some(analisis => analisis.Type.toLowerCase().includes(searchQuery.toLowerCase()))
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
                {/* Barra de búsqueda */}
                <div className="col">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="form-control"
                    />
                </div>
                {/* Filtros de rango de fecha */}
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
                {/* Menú desplegable para ordenamiento */}
                <div className="col-auto">
                    <select onChange={(e) => handleSortChange(e.target.value)} className="form-control">
                        <option value="">Ordenar por...</option>
                        <option value="Responsable">Responsable</option>
                        <option value="_id">ID</option>
                        <option value="date">Fecha de Elaboración</option>
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
                <table className="table table-striped table-bordered">
                    {/* Encabezados de la tabla */}
                    <thead className="table-light">
                        <tr>
                            <th>Responsable</th>
                            <th>ID</th>
                            <th>Fecha de Elaboración</th>
                            <th>Cliente</th>
                            <th>Análisis</th>
                            {user.rol === 'Administrador' && (
                                <th>Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMuestras.map(muestra => (
                            <tr key={muestra._id}>
                                <td>{muestra.Responsable}</td>
                                <td>
                                    <Link className="text-primary" to={`/Muestra/${muestra._id}/edit`}>
                                        {muestra._id}
                                    </Link>
                                </td>
                                <td>{format(new Date(muestra.createdAt), 'dd/MM/yyyy')}</td>
                                <td>{muestra.cliente?.nombreCliente || 'N/A'}</td>
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
                                {user.rol === 'Administrador' && (
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(muestra._id)}
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

export default ListadeMuestras;
