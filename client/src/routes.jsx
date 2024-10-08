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
import Painel from './components/painelADM/painel.jsx';
import PainelLogin from './components/painelADM/loginPainel.jsx';
import Gerenciamento from './components/painelADM/gerenciamento/gerenciamento.jsx';


export default function AppRoutes() {
    const [isLogged, setIsLogged] = useState(false);
    const [idGrupoPedido, setIdGrupoPedido] = useState();
    const [ativoAdm, setAtivoAdm] = useState();
    const [isCreated, setIsCreated] = useState(false); 
    const [nomeGrupoPedido, setNomeGrupoPedido] = useState('');   
    const [confirmModal, setConfirmModal] = useState(false);  
    const [msgModal, setMsgModal] = useState(false);
    const [idFuncionario, setIdFuncionario] = useState();  
    const [database, setDataBase] = useState(); 
    const [nomeEmpresa, setNomeEmpresa] = useState();
    const [nomeFuncionario, setNomeFuncionario] = useState();

    return (
        <LoginContext.Provider value={{ isLogged, setIsLogged, idGrupoPedido, setIdGrupoPedido, 
                                        ativoAdm, setAtivoAdm, nomeGrupoPedido, setNomeGrupoPedido, 
                                        confirmModal, setConfirmModal, msgModal, setMsgModal, idFuncionario,
                                        setIdFuncionario, database, setDataBase, nomeEmpresa, setNomeEmpresa, nomeFuncionario, 
                                        setNomeFuncionario }}>
            <RegisterContext.Provider value={{ isCreated, setIsCreated }}>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Login />} />                        
                        {/* {isLogged ? <Route exact path='/home' element={<HomePage />} /> : <Route exact path='/home' element={<Err />}  /> } */}
                        <Route exact path='/home' element={<HomePage />} />
                        <Route exact path="/novopedido" element={<NovoPedidoPage />} />
                        <Route exact path="/editarpedido" element={<EditarPedidoPage />} />
                        <Route exact path='/usuarios' element={<ListUserPage />}></Route>
                        <Route exact path='/financeiro' element={<FinanceiroPage />}></Route>
                        <Route exact path='/painelAdmin' element={<Painel />}></Route>
                        <Route exact path='/loginPainel' element={<PainelLogin />}></Route>
                        <Route exact path='/painelAdmin/estoque' element={<Gerenciamento />}></Route>
                    </Routes>
                </BrowserRouter>
            </RegisterContext.Provider>
        </LoginContext.Provider>
    );
}
