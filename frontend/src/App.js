import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import RegistraMuestra from './components/RegistraMuestra';
import EditMuestra from './components/EditMuestra';
import CreateCliente from './components/CreateCliente';
import ManejoCliente from './components/ManejoCliente';
import Muestra from './components/Muestra';
import ListadeMuestras from './components/ListadeMuestras';
import RecepcionMuestras from './components/RecepcionMuestras';
import ListadeClientes from './components/ListadeClientes';
import Note from './components/Note';
import Register from './components/Registro';
import Inicio from './components/login';
import Recuperacion from './components/recuperacion';
import Administracion from './components/Administracion';
import EditarNota from './components/EditarNota';
import ModificarPassword from './components/ModificarPassword';
import Lotes from './components/Lotes';
function App() {
  return (
    <Router>
      <Navigation />
      <Routes>   
        <Route path="/" element={<Inicio />} /> 
        <Route path="/recuperacion" element={<Recuperacion />} />
        <Route path="/administracion" element={<Administracion />} />
        <Route path="/inicio" element={<ListadeMuestras />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/muestra/:id" element={<Muestra />} />    
        <Route path="/lotes" element={<Lotes/>} />
        <Route path="/modificarPassword/:userId" element={<ModificarPassword />} />
        <Route path="/muestra/:id/edit" element={<EditMuestra />} />
        <Route path="/editCliente/:id" element={<CreateCliente />} />
        <Route path="/createCliente" element={<CreateCliente />} />
        <Route path="/clientes/:id" element={<ManejoCliente />} />
        <Route path="/create" element={<RegistraMuestra />} />
        <Route path="/clientes" element={<ListadeClientes />} />
        <Route path="/recepcion" element={<RecepcionMuestras />} />
        <Route path="/notes" element={<Note />} />
        <Route path="/notes/:noteId/edit" element={<EditarNota />} />
        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
