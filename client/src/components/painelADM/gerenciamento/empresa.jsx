import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../../context/LoginContext.jsx";
import Axios from "axios";
import { baseURL } from '../../../service/api';

export default function Empresa() {
    const { nomeEmpresa, setNomeEmpresa } = useContext(LoginContext);
    const [ empresa, setEmpresa ] = useState();    
    const [ razaoSocial, setRazaoSocial ] = useState();
    const [ cnpj, setCnpj ] = useState();
    const [ endereco, setEndereco ] = useState();
    const [ telefone, setTelefone ] = useState();
    const [ email, setEmail ] = useState();
    const [ site, setSite ] = useState();
    const [ logo, setLogo ] = useState();
    const [ removeLoading, setRemoveLoading ] = useState(true);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ modalMessage, setModalMessage ] = useState("");

    function getCompany(idEmpresa){
        Axios.post(`${baseURL}/company/getCompany`, {
                idEmpresa: idEmpresa,            
                database: sessionStorage.getItem("database")
        }).then((response) => {    
            if (response.data[0]) {                
                setNomeEmpresa(response.data[0].nomeEmpresa); 
                setRazaoSocial(response.data[0].razaoSocial);  
                setCnpj(response.data[0].numeroCNPJ);  
                setEndereco(response.data[0].nomeEndereco);  
                setTelefone(response.data[0].numeroTelefone);                   
                setEmail(response.data[0].email);  
                setSite(response.data[0].site);                  
            }
        }).catch((error) => {
            console.error('Erro ao fazer login:', error);
            setModalMessage(error.response?.data?.message || 'Erro ao buscar dados da empresa.');
            setModalOpen(true);
        }).finally(() => {
            setRemoveLoading(true);
        });
    }

    useEffect(() => {
        getCompany(1);
    }, [])

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 overflow-auto">        
            <form className="w-full max-w-4xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full md:w-[90%]">
                <div className="w-full">
                    <label htmlFor="empresa" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Empresa</label>
                    <input type="text" id="empresa" onChange={((e) => setNomeEmpresa(e.target.value))} value={nomeEmpresa} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite o nome da empresa" required />
                </div>
                <div className="w-full">
                    <label htmlFor="razaoSocial" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razão Social</label>
                    <input type="text" id="razaoSocial" onChange={((e) => setRazaoSocial(e.target.value))} value={razaoSocial} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite a razão social" required />
                </div>
                <div className="w-full">
                    <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CNPJ</label>
                    <input type="text" id="cnpj" onChange={((e) => setCnpj(e.target.value))} value={cnpj} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite o CNPJ" required />
                </div>                
                <div className="w-full">
                    <label htmlFor="endereco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Endereço</label>
                    <input type="text" id="endereco" onChange={((e) => setEndereco(e.target.value))} value={endereco} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite o Endereço" required />
                </div>  
                <div className="w-full">
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
                    <input type="tel" id="phone" onChange={((e) => setTelefone(e.target.value))} value={telefone} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite o telefone" required />
                </div>
                <div className="w-full">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email" id="email" onChange={((e) => setEmail(e.target.value))} value={email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite o seu email" required />
                </div>                 
                <div className="w-full">
                    <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website</label>
                    <input type="url" id="website" onChange={((e) => setSite(e.target.value))} value={site} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite o seu website" required />
                </div>
                </div>
                <label htmlFor="logo" className="block mt-6 mb-2 text-sm font-medium text-gray-900 dark:text-white">Logo</label>
                <div className="flex items-center justify-center w-full mb-6">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
                </div> 
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Salvar</button>
            </form>
        </div>
    );
}
