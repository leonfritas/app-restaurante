import { useState, useEffect, useContext } from "react";
import "./css/novoPedido.css";
import './css/home.css'
import Axios from "axios";
import { LoginContext } from '../context/LoginContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons'; 
import { ConfirmModal } from '../geral.jsx'
import { MsgModal } from '../geral.jsx'
import Menu from "./Menu.jsx";
import Loading from "./Loading.jsx";
import Navbar from "./navbar.jsx";


export default function Home() {
  const [grupoPedido, setGrupoPedido] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { idGrupoPedido, setIdGrupoPedido, setNomeGrupoPedido, 
         confirmModal, setConfirmModal, msgModal, setMsgModal } = useContext(LoginContext);
  const [verPedido, setVerPedido] = useState(false);
  const [listaProduto, setListaProduto] = useState(); 
  const [setCardUnirMesa] = useState(false); 
  const [table, setTable] = useState();
  const [textModal, setTextModal] = useState(); 
  const [functionModal, setFunctionModal] = useState(); 
  const [link, setLink] = useState();
  const [menuOpen, setMenuOpen] = useState(null);
  const [mesasOpen, setMesasOpen] = useState(null);
  const [mostrarObservacao, setMostrarObservacao] = useState(false);
  const [observacao, setObservacao] = useState();

  function closeModal(action){
    if (action === 'msg') {
      setMsgModal(false);
    } else {
      setConfirmModal(false);
    }
  }

  function openModal(action, idGrupoPedido, nomeGrupoPedido, msg){
    if(action !== 'msg'){
      if(action === 'edit'){
        setTextModal('Deseja Editar o Pedido?');
        setFunctionModal(() => () => editarPedido(idGrupoPedido, nomeGrupoPedido)); 
        setLink('/editarPedido');     
      }else if(action === 'cancel'){      
        setTextModal('Deseja Cancelar o Pedido?');
        setFunctionModal(() => () => cancelarPedido(idGrupoPedido));
        setLink(''); 
      }
      setConfirmModal(true);
    }else if(action === 'msg'){         
      setTextModal(msg);      
      setMsgModal(true);      
      setCardUnirMesa(false);    
    }
  }

  const atualizarLista = async () => {
    try {      
      const response = await Axios.post('http://localhost:3001/orderGroup/orderGroupList', {
        dataEntrada: '2024-01-01'
      });  
      setGrupoPedido(response.data[0]);
      setRemoveLoading(true);
    } catch (error) {      
      if (error.response) {
        console.error('Erro na resposta:', error.response);
      } else {
        console.error('Erro desconhecido:', error.message);
      }
    }
  };

  useEffect(() => {
    atualizarLista();

    const interval = setInterval(() => {
      atualizarLista();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  function editarPedido(idGrupoPedido, nomeGrupoPedido) {        
    setIdGrupoPedido(idGrupoPedido); 
    setNomeGrupoPedido(nomeGrupoPedido);
    setConfirmModal(false);
  }

  async function cancelarPedido(idGrupoPedido) {    
    if (idGrupoPedido > 0) {
        await Axios.post("http://localhost:3001/orderGroup/orderGroupCancel", {
          idGrupoPedido: idGrupoPedido
        });
        atualizarLista();      
    } else {
      openModal('msg', null, null, 'Pedido não encontrado.');      
    }
    setConfirmModal(false);
  }

  function listarProdutos(idGrupoPedido){
    if (idGrupoPedido > 0) { 
      setRemoveLoading(false);   
        Axios.post("http://localhost:3001/orderGroup/orderGroupListProduct", {
          idGrupoPedido: idGrupoPedido
        }).then((response) => {
          setListaProduto(response.data[0]);                        
        })      
        atualizarLista();
      }
  }

  useEffect(() => {
    listarProdutos();
  }, [])
  
  function mostrarPedido(index, idGrupoPedido){
    const divCardVerPedido = document.getElementsByClassName('divCardVerPedido');
    const divCardListProduct = document.getElementsByClassName('divCardListProduct');
    const buttonVerPedido = document.getElementsByClassName('buttonVerPedido');

    for(let i = 0; i < divCardVerPedido.length; i++) {
      divCardVerPedido[i].classList.remove('mostrarPedido');
      divCardListProduct[i].classList.remove('divCardListProductMostrar');            
      buttonVerPedido[i].innerHTML = 'Ver Pedido';        
      setListaProduto('');
    }

    if (!verPedido && buttonVerPedido[index].innerHTML === 'Ver Pedido'){      
      divCardVerPedido[index].classList.add('mostrarPedido');
      divCardListProduct[index].classList.add('divCardListProductMostrar');          
      listarProdutos(idGrupoPedido); 
      buttonVerPedido[index].innerHTML = 'Fechar Pedido';  
      setVerPedido(true);         
    }else{      
      buttonVerPedido[index].innerHTML = 'Ver Pedido';
      setVerPedido(false);
    }  
    setRemoveLoading(true);        
  }

  function abrirMenu(idGrupoPedido){
    setMenuOpen(menuOpen === idGrupoPedido ? null : idGrupoPedido);
    setIdGrupoPedido(idGrupoPedido)    
  }

  function mostrarMesas(action, idGrupoPedido){
    setRemoveLoading(false);
    if (action == 'disponiveis'){
      setIdGrupoPedido(idGrupoPedido);
      setMesasOpen(true);
      getTable('disponiveis', null)
    }else if(action == 'ocupadas'){
      setIdGrupoPedido(idGrupoPedido);
      setMesasOpen(true);
      getTable('ocupadas', idGrupoPedido);
    }    
  }

  function getTable(action, idGrupoPedido){
    if(action == 'disponiveis'){
      Axios.get("http://localhost:3001/table/getTable")
      .then((response) => {
          setTable(response.data[0]);        
      })
      .catch((error) => {
          console.error("Error fetching tables:", error);
      });
    }else if(action == 'ocupadas'){      
      Axios.post("http://localhost:3001/table/getOrderTable", {
        idGrupoPedido: idGrupoPedido
      })
      .then((response) => {
          setTable(response.data[0]);        
      })
      .catch((error) => {
          console.error("Error fetching tables:", error);
      });
    }
    setRemoveLoading(true);
  }

  useEffect(() => {    
      getTable('disponiveis', null);      
  }, []);

  function unirMesa(idMesa){  
    if (idGrupoPedido > 0) {      
        Axios.post("http://localhost:3001/table/joinTable", {          
          idMesa: idMesa,
          idGrupoPedido: idGrupoPedido
        });
        atualizarLista();
        setMesasOpen(null);   
        setMenuOpen(null);   
    } else {      
      openModal('msg', null, null, 'Pedido não encontrado');
    }
    getTable('ocupadas', null);
  }

  function adicionarObservacao(){
    setMostrarObservacao(true);
  }

  function fecharMenu(){
    setMenuOpen(null);
    setMostrarObservacao(false);
  }

  function salvarObservacao(observacao, idGrupoPedido){
    if (idGrupoPedido > 0) {      
      Axios.post("http://localhost:3001/orderGroup/orderGroupSaveObs", {
        idGrupoPedido: idGrupoPedido,
        observacao: observacao
      });
      atualizarLista();
      setMesasOpen(null);   
      setMenuOpen(null);   
      setMostrarObservacao(false);
    } else {      
      openModal('msg', null, null, 'Pedido não encontrado');
    }
  }

  return (
    <>
      <Navbar />
      <main className="lg:my-20 xl:my-20"> 
        <Menu />       
        <div className="">
          { mesasOpen === null ?
          <div>
            {grupoPedido && grupoPedido.map((value, index) => (                         
              <div key={value.idGrupoPedido} className={`cardContainer ${index !== 0 ? 'mb-8' : ''}`}>                              
                { menuOpen !== value.idGrupoPedido ? 
                  <div className='cardContent'>
                    <div className="cardPrincipal">
                      <div className="cardPrincipalTop">    
                        <p className="statusPedido">{value.idGrupoPedido} - {value.statusPedido}</p>                                                    
                        <button onClick={() => abrirMenu(value.idGrupoPedido)}>
                          <FontAwesomeIcon className="iconMenu" icon={faEllipsisVertical}  />
                        </button>
                      </div>                    
                      <p className="cardNomeGrupoPedido">{value.nomeGrupoPedido}</p>                                                      
                    </div>
                    <div className="cardInfo">                  
                      <p className=""> {value.horaPedido}</p>                    
                      {value.mesaAdicional !== value.nomeMesa ? 
                        <div className="mesaAdicional">
                          <p>{value.nomeMesa}</p>                        
                          <p>{value.mesaAdicional}</p>
                        </div>                  
                        : 
                        <p className="">{value.nomeMesa}</p>
                      }
                      <p className="">R$ {value.valorPedido.toFixed(2)}</p>
                    </div>                                           
                    <div className="cardButton">
                      {value.ativoBaixa === 'PAGO' && (
                        <button className="cardInfo">
                          Pedido Pago
                        </button>
                      )}

                      {value.ativoBaixa === 'PENDENTE' && (
                        <>
                          <button className="buttonCancelar" onClick={() => openModal('cancel', value.idGrupoPedido)}>
                            Cancelar
                          </button>                        
                          <button className="buttonEditar" onClick={() => openModal('edit', value.idGrupoPedido, value.nomeGrupoPedido)} >
                            Editar
                          </button>                        
                        </>
                      )}
                    </div>              
                    {!removeLoading ? 
                      <Loading />                 
                      : 
                      <div onClick={() => mostrarPedido(index, value.idGrupoPedido)} className='divCardVerPedido' >
                        <button className='buttonVerPedido' >Ver Pedido</button>                     
                        <div className= {`divCardListProduct`}  >
                          {listaProduto && listaProduto.map((value, index) => (                        
                            <div key={value.idProduto} className={`${index !== 0 ? 'cardListProduct' : 'cardListProduct'}`}>                                              
                              <p>{value.nomeProduto}</p>                                                                                                                                                                                               
                              <p>{value.quantidade}</p> 
                              <p>R$ {value.preco.toFixed(2)}</p>                               
                            </div>             
                          ))}               
                        </div>                      
                      </div>
                    }

                    {confirmModal ?
                    <ConfirmModal
                      isOpen={functionModal}                    
                      isClose={() => closeModal()}
                      contentLabel="Modal de Edição de Produto"                      
                      text={textModal}
                      link={link}
                    />
                    : ''}

                    {msgModal ?
                    <MsgModal
                      isClose={() => closeModal('msg')}                
                      contentLabel="Modal de Edição de Produto"                            
                      text={textModal}                    
                    />
                    : ''}
                  </div> 
                : 
                  <div className="menuContainer">
                    <div className="menuTop">
                      <span></span> 
                      <button onClick={() => fecharMenu()}>
                        <FontAwesomeIcon className="closeButtonMenu" icon={faXmark} />
                      </button>                     
                      
                    </div>
                    {!mostrarObservacao?   
                    <div className="menuItems">
                      {/* <button onClick={() => mostrarMesas('disponiveis', value.idGrupoPedido)}>Juntar Mesas</button> */}
                      <button onClick={() => mostrarMesas('ocupadas', value.idGrupoPedido)}>Ver Mesas</button>
                      <button onClick={() => adicionarObservacao(value.idGrupoPedido)}>Observação</button>
                    </div>
                    : 
                    <div className="divMostrarObservacao">
                      <textarea onChange={(e) => setObservacao(e.target.value)} className="textareaObservacao" name="" id="">{value.textoObservacao}</textarea>
                      <button onClick={() => salvarObservacao(observacao, idGrupoPedido)} className="buttonObservacao">Salvar</button>
                    </div>
                    }
                  </div> 
                }   
              </div>
            ))}
          </div>  
          :           
          <div className="divContainerMesa">                                      
            {table.map((value) => (
                <div key={value.idMesa} >
                    <button onClick={() => unirMesa(value.idMesa, value.idGrupoPedido)} className={`hover:bg-green-700 butonMesa ${value.idGrupoPedido > 0 ? 'mesaOcupada' : ''}`} >{value.nomeMesa}</button>
                </div>                
            ))}               
            <button onClick={() => setMesasOpen(null)} className="butonMesa bg-red-500 hover:bg-red-700 text-white font-bold">Voltar</button>                                       
          </div>}                                   
          {!removeLoading && <Loading />}  
        </div>        
      </main>
    </>
  );
}
