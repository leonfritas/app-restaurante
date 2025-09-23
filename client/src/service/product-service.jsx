import axios from "axios";
import { baseURL } from '../service/api.jsx';

export async function productList(database, idGrupoPedido) {
  try {   
    const response = await axios.post(`${baseURL}/orderGroup/orderGroupListProduct`, {
      idGrupoPedido: idGrupoPedido,
      database: database
    });    
    console.log(response.data)
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
