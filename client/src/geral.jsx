import { Link } from "react-router-dom";



export const mensagem = (mensagem) => {
  alert(mensagem);
};

export const mensagemPergunta = (mensagemPergunta) => {
  let confirm;
  confirm = window.confirm(mensagemPergunta);
  return confirm;
};

export function ConfirmModal(props){   
  const handleConfirm = () => {
    if (props.isOpen) {
      props.isOpen();
    }
    props.isClose();
  };
  
  return(
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
      <div className="relative p-5 bg-white w-50  m-auto flex-col flex rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">{props.text}</h1>
        <div className="flex justify-center">
          <Link to={props.link} className="mx-4">
            <button 
            className="bg-green-500 hover:bg-green-700 text-white font-bold mx-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleConfirm}
            >
              Sim
            </button>
          </Link>
          <button
            onClick={props.isClose}
            className="bg-red-500 hover:bg-red-800 text-white font-bold mx-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Cancelar
          </button>
        </div>
      </div>  
    </div>  
  )
}

export function MsgModal(props){   
  const handleConfirm = () => {
    if (props.isClose) {
      props.isClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
      <div className="relative p-5 bg-white w-50 m-auto flex-col flex rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">{props.text}</h1>
        <div className="flex justify-center">
          <button 
            className="bg-green-500 hover:bg-green-700 text-white font-bold mx-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleConfirm}
          >
            Ok
          </button>
        </div>
      </div>  
    </div>  
  );
}
