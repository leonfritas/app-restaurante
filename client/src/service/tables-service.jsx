import Axios from "axios";

export async function getTable(action, idGrupoPedido) {
  try {
    if (action === "disponiveis") {
      const response = await Axios.post("https://api.leonardoribeirodev.com/table/getTable", {
        database: sessionStorage.getItem("database"),
      });
      return response.data;
    } else if (action === "ocupadas") {
      const response = await Axios.post("https://api.leonardoribeirodev.com/table/getOrderTable", {
        idGrupoPedido: idGrupoPedido,
        database: sessionStorage.getItem("database"),
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching tables:", error);
    return []; // sempre retorna array pra não quebrar no .map
  }
}

  export async function joinTable(idGrupoPedido, idMesa){  
    if (idGrupoPedido > 0) {      
        await Axios.post("https://api.leonardoribeirodev.com/table/joinTable", {          
          idMesa: idMesa,
          idGrupoPedido: idGrupoPedido,
          database: sessionStorage.getItem("database")
        });

    } else {      
      openModal('msg', null, null, 'Pedido não encontrado');
    }

  }
