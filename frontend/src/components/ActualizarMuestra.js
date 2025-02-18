import React, { useState } from 'react';
import axios from 'axios';
import MuestraIDForm from './MuestraIDForm'; 

const ActualizarMuestra = () => {
    const [muestra, setMuestra] = useState(null);
    const [content, setContent] = useState('');
    const [estado, setEstado] = useState('');
    const [type, setType] = useState('');

    //Manda a llamar los datos de la muestra que se planea editar
    const handleSearch = async (muestraID) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/muestras/${muestraID}`);
            setMuestra(res.data);
            setContent(res.data.content || '');
            setEstado(res.data.estado || '');
            setType(res.data.type || '');
        } catch (error) {
            console.error('Error fetching sample:', error);
            alert('No se encontró la muestra');
        }
    };

    //Actualiza la muestra
    const handleUpdate = async () => {
        try {
            const res = await axios.put(`http://localhost:4000/api/muestras/${muestra._id}`, {
                content,
                estado,
            });
            alert('Muestra actualizada correctamente');
            setMuestra(res.data);
        } catch (error) {
            console.error('Error updating sample:', error);
            alert('Error al actualizar la muestra');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ced4da', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <MuestraIDForm onSubmit={handleSearch} /> 
            {muestra && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Muestra ID: {muestra._id}</h3>
                    <div className="form-group">
                        <label htmlFor="content">Comentarios:</label>
                        <input
                            type="text"
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="form-control"
                            style={{ 
                                width: '100%', 
                                height: '50px', 
                                border: '2px solid #ced4da',
                                borderRadius: '5px',  
                                padding: '0.375rem 0.75rem'
                            }} 
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label><strong>Estado:</strong></label>
                        <select
                            className="form-control"
                            name="estado"
                            onChange={(e) => setEstado(e.target.value)}  
                            value={estado}
                            style={{ 
                                border: '2px solid #ced4da',  
                                borderRadius: '5px' 
                            }}
                        >
                            <option value="recibido">Recibido</option>
                            <option value="procesado">Procesado</option>
                            <option value="positivo">Positivo</option>
                            <option value="negativo">Negativo</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label><strong>Análisis Solicitados:</strong></label>
                        <div className="form-control" style={{ 
                            backgroundColor: '#f8f9fa', 
                            border: '2px solid #ced4da',  
                            borderRadius: '5px', 
                            padding: '0.375rem 0.75rem',
                            minHeight: '50px' 
                        }}>
                            {type}
                        </div>
                    </div>
                    <button onClick={handleUpdate} className="btn btn-success">Actualizar Muestra</button>
                </div>
            )}
        </div>
    );
};

export default ActualizarMuestra;

