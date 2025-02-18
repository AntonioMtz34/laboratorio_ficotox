import React, { createContext, useState } from 'react';
// Maneja variables globales para usar en el codigo
 

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [sampleType, setSampleType] = useState(null); // Agregar estado para el tipo de muestra

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, sampleType, setSampleType }}>
      {children}
    </UserContext.Provider>
  );
};
