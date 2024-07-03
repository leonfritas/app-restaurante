import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginContext } from './context/LoginContext';
import Login from './login-register/login/login';
import Home from './components/home';
import Err from './components/err';
import NovoPedido from './components/homeNovoPedido';
import Register from './login-register/register/register';
import { RegisterContext } from './context/RegisterContext.jsx';
import ListUser from './components/ListUsers.jsx';
import EditarPedido from './components/homeEditarPedido.jsx';

export default function AppRoutes() {
    const [isLogged, setIsLogged] = useState(false);
    const [idGrupoPedido, setIdGrupoPedido] = useState();
    const [ativoAdm, setAtivoAdm] = useState();
    const [isCreated, setIsCreated] = useState(false); // Inicializando como false

    return (
        <LoginContext.Provider value={{ isLogged, setIsLogged, idGrupoPedido, setIdGrupoPedido, ativoAdm, setAtivoAdm }}>
            <RegisterContext.Provider value={{ isCreated, setIsCreated }}>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route exact path='/home' element={<Home />} />
                        <Route exact path="/novopedido" element={<NovoPedido />} />
                        <Route exact path="/editarpedido" element={<EditarPedido />} />
                        <Route exact path="/cadastro" element={<Register />} />
                        {isCreated ? <Route exact path="/" element={<Home />} /> : <Route exact path="/" element={<Err />} />}
                        <Route exact path='/lista' element={<ListUser/>}></Route>

                    </Routes>
                </BrowserRouter>
            </RegisterContext.Provider>
        </LoginContext.Provider>
    );
}
