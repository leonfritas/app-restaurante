import Axios from "axios";
import { baseURL } from '../service/api.jsx';

export async function getOrderList(database) {
    try {      
        const response = await Axios.post(`${baseURL}/orderGroup/orderGroupList`, {
        dataEntrada: '2024-01-01',
        database: database
        });  
        return response.data;      
    } catch (error) {      
        if (error.response) {
            console.error('Erro na resposta:', error.response);
        } else {
            console.error('Erro desconhecido:', error.message);
        }
    }
};

export async function cancelOrder(database, idGrupoPedido) {
    try {      
        await Axios.post(`${baseURL}/orderGroup/orderGroupCancel`, {
          idGrupoPedido: idGrupoPedido,
          database: database
        });     
    } catch (error) {      
        if (error.response) {
            console.error('Erro na resposta:', error.response);
        } else {
            console.error('Erro desconhecido:', error.message);
        }
    }
};

export async function saveObsOrder(idGrupoPedido, observacao, database) {
    try {      
        await Axios.post(`${baseURL}/orderGroup/orderGroupSaveObs`, {
            idGrupoPedido: idGrupoPedido,
            observacao: observacao,
            database: database
        }); 
    } catch (error) {      
        if (error.response) {
            console.error('Erro na resposta:', error.response);
        } else {
            console.error('Erro desconhecido:', error.message);
        }
    }
};

 