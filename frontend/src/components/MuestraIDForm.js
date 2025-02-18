import React, { useState } from 'react';

const MuestraIDForm = ({ onSubmit }) => {
    const [muestraID, setMuestraID] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (muestraID.trim() === '') {
            alert('Por favor, ingresa un ID de muestra');
            return;
        }
        onSubmit(muestraID); // Aquí se llama la función que debe ser pasada como prop
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto' }}>
            <div className="form-group">
                <label htmlFor="muestraID">ID de Muestra:</label>
                <input
                    type="text"
                    id="muestraID"
                    value={muestraID}
                    onChange={(e) => setMuestraID(e.target.value)}
                    className="form-control"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Buscar</button>
        </form>
    );
};

export default MuestraIDForm;
