import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginContext } from './context/LoginContext';
import { RegisterContext } from './context/RegisterContext.jsx';
import HomePage from './pages/homePage.jsx'
import EditarPedidoPage from './pages/editarPedidoPage.jsx';
import NovoPedidoPage from './pages/novoPedidoPage.jsx';
import FinanceiroPage from './pages/Financeiro.jsx'
import ListUserPage from './pages/ListUserPage.jsx';
import Login from './pages/login.jsx';


export default function AppRoutes() {
    const [isLogged, setIsLogged] = useState(false);
    const [idGrupoPedido, setIdGrupoPedido] = useState();
    const [ativoAdm, setAtivoAdm] = useState();
    const [isCreated, setIsCreated] = useState(false); 
    const [nomeGrupoPedido, setNomeGrupoPedido] = useState('');   
    const [confirmModal, setConfirmModal] = useState(false);  
    const [msgModal, setMsgModal] = useState(false);
    const [idFuncionario, setIdFuncionario] = useState();  

    return (
        <LoginContext.Provider value={{ isLogged, setIsLogged, idGrupoPedido, setIdGrupoPedido, 
                                        ativoAdm, setAtivoAdm, nomeGrupoPedido, setNomeGrupoPedido, 
                                        confirmModal, setConfirmModal, msgModal, setMsgModal, idFuncionario, setIdFuncionario }}>
            <RegisterContext.Provider value={{ isCreated, setIsCreated }}>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Login />} />                        
                        {/* {isLogged ? <Route exact path='/home' element={<HomePage />} /> : <Route exact path='/home' element={<Err />}  /> } */}
                        <Route exact path='/home' element={<HomePage />} />
                        <Route exact path="/novopedido" element={<NovoPedidoPage />} />
                        <Route exact path="/editarpedido" element={<EditarPedidoPage />} />
                        <Route exact path='/lista' element={<ListUserPage />}></Route>
                        <Route exact path='/financeiro' element={<FinanceiroPage />}></Route>
                    </Routes>
                </BrowserRouter>
            </RegisterContext.Provider>
        </LoginContext.Provider>
    );
}
