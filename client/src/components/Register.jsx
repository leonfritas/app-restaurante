import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Loading from "./Loading.jsx";
import ModalRegister from "../components/modals/ModalRegister.jsx";

export default function Register() {
  const [realName, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [userName, setUserName] = useState("");
  const [senha, setSenha] = useState("");
  const [checkAdmin, setUserAdmin] = useState(false);
  const [userCheck, setUserCheck] = useState(false);
  const navigate = useNavigate();
  const [removeLoading, setRemoveLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const register = () => {
    const ativoAdminValue = checkAdmin ? 1 : 0;
    const ativoFuncionarioValue = userCheck ? 1 : 0;

    if (realName !== "" && userName !== "" && senha !== "" && cpf !== "") {
      Axios.post("http://localhost:3001/users/register", {
        realName: realName,
        cpf: cpf,
        userName: userName,
        senha: senha,
        checkAdmin: ativoAdminValue,
        userCheck: ativoFuncionarioValue,
      })
        .then((response) => {
          if (!response.data) {
            setModalMessage("Erro ao tentar cadastrar. Resposta vazia do servidor.");
            setShowModal(true);
            setRemoveLoading(true);
            return;
          }          
          if (response.data[0][0].usuarioDuplicado == 0){
            if (response.data[0][0].idFuncionario > 0) {
              setModalMessage(
                "Funcionário: " +
                  response.data[0][0].nomeFuncionario +
                  " cadastrado com sucesso."
              );
              setShowModal(true);
              navigate("/lista");
            } else {
              setModalMessage(
                "Erro ao tentar cadastrar. Resposta inválida do servidor."
              );
              setShowModal(true);
            }
          }else{
            setModalMessage('Nome de usuário inválido.');
            setShowModal(true);
          }  
        })
        .catch(() => {
          setModalMessage(
            "Erro ao tentar cadastrar. Por favor, tente novamente mais tarde."
          );
          setShowModal(true);
        });
    } else {
      setModalMessage("Preencha seu nome, usuário e senha para continuar.");
      setShowModal(true);
    }
  };

  const formatCPF = (value) => {
    value = value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{3})/, "$1.$2");
    } else if (value.length > 0) {
      value = value.replace(/(\d{3})/, "$1");
    }

    return value;
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
  };

  const handleAdminCheckboxChange = (e) => {
    setUserAdmin(e.target.checked);
  };

  const handleUserCheckboxChange = (e) => {
    setUserCheck(e.target.checked);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-indigo-600">
      <div className="bg-white mx-auto max-w-md py-8 px-10 shadow rounded-lg">
        <h1 className="text-center font-bold mb-5 text-2xl">Área de Registro</h1>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nome completo..."
            value={realName}
            onChange={(e) => setName(e.target.value)}
            className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="cpf"
            placeholder="Digite seu CPF..."
            value={cpf}
            onChange={handleCPFChange}
            className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="user"
            placeholder="Nome de Usuário..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="senha"
            placeholder="Senha..."
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <input
            type="checkbox"
            id="admin"
            name="admin"
            checked={checkAdmin}
            onChange={handleAdminCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="admin"> Administrador</label>
        </div>

        <div className="mb-4">
          <input
            type="checkbox"
            id="user"
            name="user"
            checked={userCheck}
            onChange={handleUserCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="user"> Usuário</label>
        </div>

        <div className="mb-4">
          <button
            onClick={register}
            className="inline-block w-full px-8 py-4 leading-none text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow focus:outline-none"
          >
            Criar Conta
          </button>
          {!removeLoading && <Loading />}
        </div>

      </div>

      {/* Modal de Mensagem */}
      <ModalRegister isOpen={showModal} onCancel={closeModal}>
        {modalMessage}
      </ModalRegister>

    </div>
  );
}
