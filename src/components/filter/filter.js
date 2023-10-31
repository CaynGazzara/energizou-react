import React, { useState } from 'react';
import ButtonDefault from '../button-default/button';
import { onlyNumbers, maskCnpj } from '../shared-functions/shared-functions'; 
import InputMask from 'react-input-mask';

const CompanyFilter = ({ onFilter }) => {
  const [cnpj, setCnpj] = useState('');

  const handleFilter = () => {
    const filteredCnpj = onlyNumbers(cnpj); // Usar a função onlyNumbers para obter apenas os dígitos
    onFilter(filteredCnpj);
  };

  const handleCnpjChange = (e) => {
    const newValue = e.target.value;
    setCnpj(newValue);

    if (newValue.trim() === '') {
      onFilter('');
    }
  };

  return (
    <div className="company-filter-container">
      <div className="input-container">
        <InputMask
          className="input-container"
          mask="99.999.999/9999-99"
          placeholder="Filtrar por CNPJ"
          maskChar=" "
          type="text"
          value={maskCnpj(cnpj)} // Usar a função maskCnpj para formatar o CNPJ exibido
          onInput={handleCnpjChange}
        />
      </div>
      <ButtonDefault label="Filtrar" className="filter-button" onClick={handleFilter} />
    </div>
  );
};

export default CompanyFilter;