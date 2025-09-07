import axios from "axios";

export async function productList(database, idGrupoPedido) {
  try {   
    const response = await axios.post("http://localhost:3001/orderGroup/orderGroupListProduct", {
      idGrupoPedido: idGrupoPedido,
      database: database
    });
    
    return response.data; // não force [0], deixe a API decidir
  } catch (error) {      
    if (error.response) {
      console.error('Erro na resposta:', error.response);
    } else {
      console.error('Erro desconhecido:', error.message);
    }
    return []; // em caso de erro, devolve array vazio
  }
};
