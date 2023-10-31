import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import './save-company.css';
import ButtonDefault from '../button-default/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { onlyNumbers, validateCNPJ, isValidEmail, validateCEP,  } from '../shared-functions/shared-functions';

function SaveCompany() {
    const location = useLocation();
    const navigate = useNavigate();
    const { state: { company } } = location;
    const isEdit = !!company;
    const [formData, setFormData] = useState({
        nome_cliente: '',
        senha: '',
        razao_social: '',
        cnpj: '',
        cep: '',
        endereco: '',
        numero: '',
        telefone: '',
        email: '',
    });
    const [validationCnpjError, setValidationCnpjError] = useState('');
    const [validationCepError, setValidationCepError] = useState('');
    const [validationTelError, setValidationTelError] = useState('');
    const [validationEmailError, setValidationEmailError] = useState('');
    const [formValid, setFormValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isFormComplete, setIsFormComplete] = useState(false);

    const checkFormCompleteness = () => {
        const {
            nome_cliente,
            senha,
            razao_social,
            cnpj,
            cep,
            endereco,
            numero,
            telefone,
            email,
        } = formData;

        const isCnpjValid = !validationCnpjError;
        const isCepValid = !validationCepError;
        const isTelValid = !validationTelError;
        const isEmailValid = !validationEmailError;

        if (
            nome_cliente &&
            senha &&
            razao_social &&
            cnpj &&
            cep &&
            endereco &&
            numero &&
            telefone &&
            email &&
            isCnpjValid &&
            isCepValid &&
            isTelValid &&
            isEmailValid
        ) {
            setIsFormComplete(true);
        } else {
            setIsFormComplete(false);
        }
    };

    const handleCepBlur = async (event) => {
        const cep = onlyNumbers(event.target.value);
        if (cep.length === 8) {
            const response = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
            const data = await response.json();
            setFormData({
                ...formData,
                endereco: data.logradouro,
            });
        }
    };

    useEffect(() => {
        checkFormCompleteness();
    }, [formData]);

    useEffect(() => {
        validateForm();
    }, [formData]);

    useEffect(() => {
        validateForm();
    }, [formData, validationCnpjError, validationCepError, validationTelError, validationEmailError]);

    useEffect(() => {
        if (company) {
            setFormData({
                nome_cliente: company.nome_cliente || '',
                senha: company.senha || '',
                razao_social: company.razao_social || '',
                cnpj: company.cnpj || '',
                cep: company.cep || '',
                endereco: company.endereco || '',
                numero: company.numero || '',
                telefone: company.telefone || '',
                email: company.email || '',
            });
        }
    }, [company]);

    const validateForm = () => {
        if (
            formData.nome_cliente?.trim() === '' ||
            formData.senha?.trim() === '' ||
            formData.razao_social?.trim() === '' ||
            formData.cnpj?.trim() === '' ||
            formData.cep?.trim() === '' ||
            formData.endereco?.trim() === '' ||
            formData.numero?.trim() === '' ||
            formData.telefone?.trim() === '' ||
            formData.email?.trim() === ''
        ) {
            setFormValid(false);
            setErrorMessage('Por favor, preencha todos os campos.');
        } else {
            setFormValid(true);
            setErrorMessage('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cnpjValidation = validateCNPJ(formData.cnpj);

        if (cnpjValidation) {
            setValidationCnpjError(cnpjValidation);
        } else {
            setValidationCnpjError('');
        }

        if (!cnpjValidation && !validationCepError && !validationTelError && !validationEmailError && formValid) {
            formData.cnpj = onlyNumbers(formData.cnpj);
            formData.cep = onlyNumbers(formData.cep);
            formData.telefone = onlyNumbers(formData.telefone);
            if (company && company.id) {
                const clienteId = company.id;
                fetch(`http://localhost:3800/empresas/${clienteId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log('Cliente atualizado com sucesso');
                            navigate('/lista-empresas', { state: {} });
                        } else {
                            console.error('Erro ao atualizar cliente');
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao atualizar cliente:', error);
                    });
            } else {
                fetch('http://localhost:3800/empresas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log('Novo cliente criado com sucesso');
                            navigate('/lista-empresas', { state: {} });
                        } else {
                            console.error('Erro ao criar novo cliente');
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao criar novo cliente:', error);
                    });
            }
        }
    };

    function validateField(fieldName, value) {
        switch (fieldName) {
            case 'cnpj':
                return validateCNPJ(value) ? '' : 'CNPJ inválido';
            case 'cep':
                return validateCEP(value) ? '' : 'CEP inválido';
            case 'email':
                return isValidEmail(value) ? '' : 'Email inválido';
            default:
                return '';
        }
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const fieldError = validateField(name, value);

        setFormData({
            ...formData,
            [name]: value,
        });

        switch (name) {
            case 'cnpj':
                setValidationCnpjError(fieldError);
                break;
            case 'cep':
                setValidationCepError(fieldError);
                break;
            case 'telefone':
                setValidationTelError(fieldError);
                break;
            case 'email':
                setValidationEmailError(fieldError);
                break;
            default:
                break;
        }
    };

    const handleCancelCompany = () => {
        navigate('/lista-empresas', { state: {} });
    };

    return (
        <div className="company-form">
            <h2>Formulário de Cadastro</h2>
            <form onSubmit={handleSubmit}>
                <div className="field-container">
                    <div>
                        <label htmlFor="nome_cliente">Nome do Cliente:</label>
                        <input
                            type="text"
                            id="nome_cliente"
                            name="nome_cliente"
                            value={formData.nome_cliente}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="senha">Senha:</label>
                        <input
                            type="text"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="field-container">
                    <div>
                        <label htmlFor="razao_social">Nome da Empresa (Razão Social):</label>
                        <input
                            type="text"
                            id="razao_social"
                            name="razao_social"
                            value={formData.razao_social}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="cnpj">CNPJ:</label>
                        <InputMask
                            mask="99.999.999/9999-99"
                            maskChar=" "
                            type="text"
                            id="cnpj"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleChange}
                        />
                        {validationCnpjError && <span style={{ color: 'red' }}>{validationCnpjError}</span>}
                    </div>
                </div>
                <div className="field-container">
                    <div>
                        <label htmlFor="cep">CEP:</label>
                        <InputMask
                            mask="99999-999"
                            maskChar=" "
                            type="text"
                            id="cep"
                            name="cep"
                            value={formData.cep}
                            onChange={handleChange}
                            onBlur={handleCepBlur}
                        />
                        {validationCepError && <span style={{ color: 'red' }}>{validationCepError}</span>}
                    </div>
                    <div>
                        <label htmlFor="endereco">Endereço:</label>
                        <InputMask
                            mask={''}
                            type="text"
                            id="endereco"
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="field-container">
                    <div>
                        <label htmlFor="numero">Número:</label>
                        <InputMask
                            mask="999"
                            maskChar=" "
                            type="text"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="telefone">Telefone:</label>
                        <InputMask
                            mask="+55 (99) 99999-9999"
                            maskChar=" "
                            type="text"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                        />
                        {validationTelError && <span style={{ color: 'red' }}>{validationTelError}</span>}
                    </div>
                </div>
                <div className="field-container">
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {validationEmailError && <span style={{ color: 'red' }}>{validationEmailError}</span>}
                    </div>
                </div>
                <ButtonDefault
                    label={isEdit ? 'Editar' : 'Cadastrar'}
                    className="button__cadastrar"
                    disabled={!formValid}
                    onClick={handleSubmit}
                />

                <ButtonDefault label="Cancelar" className="button__cancelar" onClick={handleCancelCompany} />
            </form>
            <div className="error-message">{errorMessage}</div>
        </div>
    );
}

export default SaveCompany;