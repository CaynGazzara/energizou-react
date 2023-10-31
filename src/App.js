import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutComponent from './components/layout/layout';
import ListaEmpresa from './components/company-list/company-list';
import SaveCompany from './components/save-company/save-company'

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<LayoutComponent />} />
            <Route
                path="/lista-empresas"
                element={
                    <>
                        <ListaEmpresa />
                    </>
                }
            />
            <Route path="/save-company" element={
                <>
                    <SaveCompany />
                    <LayoutComponent />
                </>
            }
            />
        </Routes>
    );
}

export default App;