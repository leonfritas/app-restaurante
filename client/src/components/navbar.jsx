import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from '../context/LoginContext';
import './css/navbar.css'

export default function Navbar() {
    const { ativoAdm, nomeEmpresa, nomeFuncionario } = useContext(LoginContext);


    return (
        <nav className="xl:bg-[#1B262C] lg:bg-[rgb(27,38,44)] p-4 sm:py-6 sm:px-8 fixed inset-x-0 z-50">
            <div className="hidden sm:flex sm:justify-between sm:items-center fixed top-0 left-0 w-full bg-[#1B262C]">
                <div className="flex items-center">
                    <Link to='/home'>
                        <button className="text-white text-xl font-semibold ml-4 mb-0.5">
                            <p>HEST |</p>
                        </button>
                    </Link>
                    <div>
                        <p className="text-white mx-2">  {nomeEmpresa !== ''? nomeEmpresa : 'Não existe empresa cadastrada'} | {nomeFuncionario !== ''? nomeFuncionario : ''}</p>    
                    </div>
                    
                </div>
               
                <div className="flex space-x-4 mx-2 my-2">
                        <Link  to='/painelAdmin'>
                            <button className="bg-[#3282B8] hover:bg-[#0E4C75] text-white font-bold py-2 px-4 rounded ">
                                Painel Administrador
                            </button>
                        </Link>
                </div>
            </div>

            <div className="sm:hidden fixed bottom-0 left-0 w-full  sm:bg-[#1b262c]">
    <div className=" flex flex-col ">
        <Link to='/home'>
        </Link>
        <div className="flex flex-row space-x-2 items-center justify-center bg-[#1b262c] p-2">
    {ativoAdm && (
        <>
            <Link to='/painelAdmin'>
                <button
                    className="px-4 py-2 text-center text-sm font-medium text-white bg-[#3282B8] hover:bg-[#0E4C75]"
                >
                    Painel Administrador
                </button>
            </Link>
        </>
    )}
</div>

    </div>
            </div>
        </nav>
    );
}
