import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { LoginContext } from './context/LoginContext'
import { useState } from 'react'
import Login from './login/login'
import Home from './components/home'
import Err from './components/err'
import NovoPedido from './components/homeNovoPedido'



export default function AppRoutes(){

    const [isLogged, setIsLogged] = useState(false);

    return(
        <LoginContext.Provider value={ {isLogged, setIsLogged} }>
            <BrowserRouter>
                <Routes>                
                    <Route exact path="/" element={<Login />} />
                    {isLogged?<Route exact path="/home" element={<Home />} />:<Route exact path="/home" element={<Err />} />}
                    <Route exact path="/novopedido" element={<NovoPedido />} />
                </Routes>
            </BrowserRouter>
        </LoginContext.Provider>  
    )
}