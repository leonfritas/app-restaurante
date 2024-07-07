import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginContext } from './context/LoginContext';
import { RegisterContext } from './context/RegisterContext.jsx';
import HomePage from './pages/homePage.jsx'
import EditarPedidoPage from './pages/editarPedidoPage.jsx';
import NovoPedidoPage from './pages/novoPedidoPage.jsx';
import FinanceiroPage from './pages/Financeiro.jsx'
import ListUserPage from './pages/ListUserPage.jsx';
import RegisterPage from './pages/registerPage.jsx';

import Login from './pages/login.jsx';
// import Err from './components/err';

export default function AppRoutes() {
    const [isLogged, setIsLogged] = useState(false);
    const [idGrupoPedido, setIdGrupoPedido] = useState();
    const [ativoAdm, setAtivoAdm] = useState();
    const [isCreated, setIsCreated] = useState(false); // Inicializando como false
    const [nomeGrupoPedido, setNomeGrupoPedido] = useState('');     

    return (
        <LoginContext.Provider value={{ isLogged, setIsLogged, idGrupoPedido, setIdGrupoPedido, ativoAdm, setAtivoAdm, nomeGrupoPedido, setNomeGrupoPedido }}>
            <RegisterContext.Provider value={{ isCreated, setIsCreated }}>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Login />} />                        
                        {/* {isLogged ? <Route exact path='/home' element={<HomePage />} /> : <Route exact path='/home' element={<Err />}  /> } */}
                        <Route exact path='/home' element={<HomePage />} />
                        <Route exact path="/novopedido" element={<NovoPedidoPage />} />
                        <Route exact path="/editarpedido" element={<EditarPedidoPage />} />
                        <Route exact path="/cadastro" element={<RegisterPage />} />                    
                        <Route exact path='/lista' element={<ListUserPage />}></Route>
                        <Route exact path='/financeiro' element={<FinanceiroPage />}></Route>
                    </Routes>
                </BrowserRouter>
            </RegisterContext.Provider>
        </LoginContext.Provider>
    );
}
