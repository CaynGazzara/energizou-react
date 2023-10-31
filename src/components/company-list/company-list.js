import React, { useState, useEffect } from 'react';
import './company-list.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faTrash } from '@fortawesome/free-solid-svg-icons';
import CompanyFilter from '../filter/filter';
import '../filter/filter.css';
import ButtonDefault from '../button-default/button';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutComponent from '../layout/layout';
import { maskCnpj, maskCep, maskTelefone, onlyNumbers } from '../shared-functions/shared-functions'; 

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [showTable, setShowTable] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/lista-empresas';

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:3800/empresas');
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleFilter = async (cnpj) => {
    if (onlyNumbers(cnpj).length !== 0) {
      const response = await fetch('http://localhost:3800/empresas/' + onlyNumbers(cnpj));
      if (response.status !== 200) return;
      const data = await response.json();
      setCompanies(data);
    } else {
      const response = await fetch('http://localhost:3800/empresas');
      if (response.status !== 200) return;
      const data = await response.json();
      setCompanies(data);
    }
  };

  const deleteCompany = (index, clienteId) => {
    fetch(`http://localhost:3800/empresas/${clienteId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          updateInterfaceAfterDeletion(index);
        } else {
          console.error('Erro ao excluir cliente');
        }
      })
      .catch((error) => {
        console.error('Erro ao excluir cliente:', error);
      });
  };

  const updateInterfaceAfterDeletion = (index) => {
    const updatedCompanies = [...companies];
    updatedCompanies.splice(index, 1);

    setCompanies(updatedCompanies);
  };

  const handleEditCompany = (company) => {
    navigate('/save-company', { state: { company } });
  };

  const handleCreateCompany = () => {
    navigate('/save-company', { state: {} });
  };

  return (
    <div className="company-list-container">
      <LayoutComponent className="overlay-layout" />
      <div className="filter-and-create-container">
        <ButtonDefault label="Criar Empresa" className="create-button" onClick={handleCreateCompany} />
        <div className="filter-container">
          <CompanyFilter onFilter={handleFilter} />
        </div>
      </div>
      <div className="table-container">
        {showTable && (
          <div className="table-wrapper">
            <table className="company-table">
              <thead>
                <tr>
                  <th>Nome do Cliente</th>
                  <th>Senha</th>
                  <th>Nome da Empresa (Razão Social)</th>
                  <th>CNPJ</th>
                  <th>CEP</th>
                  <th>Endereço</th>
                  <th>Número</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Editar</th>
                  <th>Deletar</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index}>
                    <td>{company.nome_cliente}</td>
                    <td>{company.senha}</td>
                    <td>{company.razao_social}</td>
                    <td>{maskCnpj(company.cnpj)}</td>
                    <td>{maskCep(company.cep)}</td> 
                    <td>{company.endereco}</td>
                    <td>{company.numero}</td>
                    <td>{maskTelefone(company.telefone)}</td> 
                    <td>{company.email}</td>
                    <td className="edit-td edit-cell">
                      <FontAwesomeIcon icon={faPaintBrush} onClick={() => handleEditCompany(company)} />
                    </td>
                    <td className="edit-td delete-cell">
                      <FontAwesomeIcon icon={faTrash} onClick={() => deleteCompany(index, company.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;