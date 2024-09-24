import "../../css/novoPedido.css";
import Cadastro from "./cadastro";
import Tabela from "./tabela";

export default function Gerenciamento() {
 


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 overflow-auto">
      
      <Cadastro />
      
      <Tabela />
      
    </div>
  );
}
