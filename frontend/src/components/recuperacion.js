import React from 'react';

const EnDesarrollo = () => {
  return (
    <div style={containerStyle}>
      <h1 style={textStyle}>En Desarrollo</h1>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const textStyle = {
  fontSize: '32px',
  color: '#333',
};

export default EnDesarrollo;
