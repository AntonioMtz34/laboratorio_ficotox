import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { format as DateFormat } from 'date-fns';
import { Link } from 'react-router-dom';
import { format as timeagoFormat } from 'timeago.js';
import { UserContext } from './UserContext';

const NotesList = () => {
    const [notes, setNotes] = useState([]);// Almacena las notas en un arreglo.
    const { user } = useContext(UserContext);// Obtiene el usuario del contexto.

    useEffect(() => {
        getNotes();
    }, []);
    // Obtiene todas las notas regitradas
    const getNotes = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/notes');
            const sortedNotes = res.data.sort((a, b) => new Date(a.fechaAgenda) - new Date(b.fechaAgenda));// Ordena las notas por fecha
            setNotes(sortedNotes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };
// Pestaña que pregunta por la confirmacion de eliminar la nota
    const handleDelete = (noteId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta nota?");
        if (confirmDelete) {
            deleteNote(noteId);
        }
    };
// Elimina las notas de la API.
    const deleteNote = async (noteId) => {
        try {
            await axios.delete(`http://localhost:4000/api/notes/${noteId}`);
            getNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
        <div className="row">
            {notes.length === 0 ? (
                <div className="col-md-12">
                    <div className="alert alert-info text-center">
                        <strong>No hay notas pendientes.</strong> Todas las tareas han sido completadas o no se han registrado notas aún.
                    </div>
                </div>
            ) : (
                notes.map(note => (
                    <div className="col-md-4 mt-4 p-2" key={note._id}>
                         {/* Muestra todas las notas ordenadas */}
                        <div className="card note-card">
                            {new Date(note.fechaAgenda) >= new Date() ? (
                                <>
                                    <div className="card-header d-flex justify-content-between align-items-center note-header">
                                        <h5 className="note-title">Aviso reprogramación {timeagoFormat(note.fechaAgenda)}</h5>
                                        <Link className="btn btn-secondary" to={"/notes/" + note._id + "/edit"}>
                                            Editar
                                        </Link>
                                    </div>
                                    <div className="card-body note-body">
                                        <p><strong>Contenido:</strong> {note.motivo}</p>
                                        <p><strong>Responsable:</strong> {note.responsable}</p>
                                        <p><strong>Fecha de reprogramación:</strong> {DateFormat(new Date(note.fechaAgenda), 'dd/MM/yyyy')}</p>
                                        <p><strong>Cliente:</strong> {note.cliente}</p>
                                        <p><strong>Registrado:</strong> {DateFormat(new Date(note.createdAt), 'dd/MM/yyyy')}</p>
                                        <p><strong>Actualizado:</strong> {DateFormat(new Date(note.updatedAt), 'dd/MM/yyyy')}</p>
                                    </div>
                                    {user.rol === 'Administrador' && (
                                        <div className="card-footer note-footer d-flex justify-content-between">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(note._id)}
                                            >
                                                Eliminar
                                            </button>
                                            <small className="text-muted">ID: {note._id}</small>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="card-header d-flex justify-content-between align-items-center note-header-vencida">
                                        <h5 className="note-title">Fecha vencida {timeagoFormat(note.fechaAgenda)}</h5>
                                        <Link className="btn btn-secondary" to={"/notes/" + note._id + "/edit"}>
                                            Reprogramar
                                        </Link>
                                    </div>
                                    <div className="card-body note-body">
                                        <p><strong>Contenido:</strong> {note.motivo}</p>
                                        <p><strong>Responsable:</strong> {note.responsable}</p>
                                        <p><strong>Fecha de reprogramación:</strong> {DateFormat(new Date(note.fechaAgenda), 'dd/MM/yyyy')}</p>
                                        <p><strong>Cliente:</strong> {note.cliente}</p>
                                        <p><strong>Registrado:</strong> {DateFormat(new Date(note.createdAt), 'dd/MM/yyyy')}</p>
                                    </div>
                                    {user.rol === 'Administrador' && (
                                        <div className="card-footer note-footer d-flex justify-content-between">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(note._id)}
                                            >
                                                Eliminar
                                            </button>
                                            <small className="text-muted">ID: {note._id}</small>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotesList;
