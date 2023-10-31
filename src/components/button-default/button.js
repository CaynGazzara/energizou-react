import React from 'react';
import PropTypes from 'prop-types';
import './button.css';

// O componente ButtonDefault é uma função que recebe três propriedades: label, className e onClick.
const ButtonDefault = ({ label, className, onClick }) => {
  return (
    // Renderiza um botão com a classe "custom-button" e qualquer classe adicional especificada em "className".
    <button className={`custom-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

// Defina os tipos de propriedades esperados para o componente ButtonDefault usando PropTypes.
ButtonDefault.propTypes = {
  label: PropTypes.string.isRequired, 
  className: PropTypes.string, 
  onClick: PropTypes.func, 
};

export default ButtonDefault;
