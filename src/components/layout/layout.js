import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import './layout.css'; 
import energizouLogo from '../../assets/images/energizou-logo1.png';
import energizouBackground from '../../assets/images/energizou-background.png';

function LayoutComponent() {
    const navigate = useNavigate(); 
    const location = useLocation(); 

    const isHomePage = location.pathname === '/';

    return (
        <div className='layout-container'>
            <div className='layout-up'>
                <img src={energizouLogo} alt='Energizou Logo' onClick={() => navigate('/')} />
            </div>
            <div className='layout-background'>
                {isHomePage && (
                    <div className='layout-text'>
                        <h2>Projeto Energizou </h2> 
                        <h3>Para rodar o projeto siga os seguintes passos:</h3>
                        <h4> 
                           1 - Rode o script de banco de dados que pode ser encontrado no repositório da API <br/>
                           2 - Rode a API <br/>
                           3 - Clique no link abaixo.</h4>
                        <a href="/lista-empresas" onClick={(e) => {
                            e.preventDefault();
                            navigate('/lista-empresas');
                        }}>ACESSAR PROJETO</a>
                    </div>
                )}
                <img src={energizouBackground} alt='Energizou Background' />
            </div>
        </div>
    );
}

export default LayoutComponent;