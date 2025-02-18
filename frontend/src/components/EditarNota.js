import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const EditNote = () => {
  const { noteId } = useParams(); // Obtiene el ID de la nota desde la URL
  const navigate = useNavigate(); // Hook para la navegación

  // Estado para almacenar los datos de la nota
  const [note, setNote] = useState({
    motivo: '',
    descripcion: '',
    cliente: '',
    responsable: '',
    fechaAgenda: new Date()
  });

  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Carga los datos de la nota desde la API cuando el componente se monta
  useEffect(() => {
    axios.get(`http://localhost:4000/api/notes/${noteId}`)
      .then(response => {
        const noteData = response.data;
        setNote({
          ...noteData,
          fechaAgenda: new Date(noteData.fechaAgenda) // Convierte la fecha a un objeto Date válido
        });
        setLoading(false);
      })
      .catch(error => {
        setError(error.message); // Guarda el mensaje de error si la solicitud falla
        setLoading(false);
      });
  }, [noteId]);

  // Maneja los cambios en los campos del formulario y actualiza el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value
    }));
  };

  // Maneja el envío del formulario para actualizar la nota
  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const agendaDate = new Date(note.fechaAgenda);

    // Validación: La fecha debe ser futura
    if (agendaDate <= today) {
      setError('La fecha de agenda debe ser una fecha futura.');
      return;
    }

    axios.put(`http://localhost:4000/api/notes/${noteId}`, note)
      .then(response => {
        alert('Nota actualizada exitosamente!');
        navigate('/notes'); // Redirige a la lista de notas después de actualizar
      })
      .catch(error => {
        setError(error.message);
      });
  };

  // Maneja el cambio de fecha en el DatePicker
  const handleDateChange = (date) => {
    setNote(prevNote => ({
      ...prevNote,
      fechaAgenda: date
    }));
  };

  // Regresa a la página anterior
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="col-md-6 offset-md-3">
      <div className="card card-body" style={{ marginTop: '20px' }}>
        <h4>Reprogramación de cita</h4>
        <form onSubmit={handleSubmit}>
          {/* Información del cliente */}
          <div className="form-group">
            <p><strong>Cliente:</strong> {note.cliente}</p>

            {/* Campo para el motivo de la reprogramación */}
            <label><strong>Motivo de reprogramación:</strong></label>
            <textarea
              className="form-control"
              placeholder="Motivo"
              name="motivo"
              onChange={handleChange}
              required
              value={note.motivo}
              style={{ marginBottom: '20px' }}
            />

            {/* Campo para comentarios opcionales */}
            <label><strong>Comentarios:</strong></label>
            <textarea
              className="form-control"
              placeholder="Opcional"
              name="descripcion"
              onChange={handleChange}
              value={note.descripcion}
              style={{ marginBottom: '20px' }}
            />
          </div>

          {/* Campo para la nueva fecha de reprogramación */}
          <div className="form-group">
            <label><strong>Fecha de reprogramación:</strong></label>
            <DatePicker
              className="form-control"
              selected={note.fechaAgenda}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* Botones para guardar o cancelar */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
              Guardar
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              Regresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
