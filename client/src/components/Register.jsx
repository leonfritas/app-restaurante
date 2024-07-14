import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { LoginContext } from "../context/LoginContext.jsx";
import { MsgModal } from "../geral.jsx";

export default function Register() {
  const [realName, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [userName, setUserName] = useState("");
  const [senha, setSenha] = useState("");
  const [checkAdmin, setUserAdmin] = useState(false);
  const [userCheck, setUserCheck] = useState(false);
  const navigate = useNavigate();
  const { msgModal, setMsgModal} = useContext(LoginContext);
  const [textModal, setTextoModal ] = useState();

  function register (){
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
            openModal('msg', "Erro ao tentar cadastrar. Resposta vazia do servidor.");
            return;
          }          
          if (response.data[0][0].usuarioDuplicado == 0){
            if (response.data[0][0].idFuncionario > 0) {
              openModal("msg",
                "Funcionário: " +
                  response.data[0][0].nomeFuncionario +
                  " cadastrado com sucesso."
              );
              navigate("/lista");
            } else {
              openModal("msg",
                "Erro ao tentar cadastrar. Resposta inválida do servidor."
              );
            }
          }else{
            openModal("msg", 'Nome de usuário inválido.')
          }  
        })
        .catch(() => {
          openModal("msg",
            "Erro ao tentar cadastrar. Por favor, tente novamente mais tarde."
          );
        });
    } else {
      openModal("msg","Preencha seu nome, usuário e senha para continuar.");
    }
    // setMsgModal(false)
  }

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

  function closeModal(){
    setMsgModal(false);
  }

  function openModal(action, msg){
    if(action == 'msg'){
      setTextoModal(msg)
      setMsgModal(true)
    }
  }

  return (
    <div className=" flex flex-col justify-center ">
      <div className="bg-white mx-auto max-w-md py-8 px-10 shadow rounded-lg">
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
        </div>

        <div className="mb-4">
          <p>
            Após a <strong>CONFIRMAÇÃO</strong> do <strong>CADASTRO</strong>, pode fechar a tela.
          </p>
        </div>
        {msgModal ?
          <MsgModal
          isClose={closeModal}
          text={textModal}

          />
        : ''}
      </div>
    </div>
  );
}
