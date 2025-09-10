import Axios from "axios";

export async function getOrderList(database) {
    try {      
        const response = await Axios.post('https://f8d3a9035cb7.ngrok-free.app/orderGroup/orderGroupList', {
        dataEntrada: '2024-01-01',
        database: database
        });  
        return response.data[0];      
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
        await Axios.post("https://f8d3a9035cb7.ngrok-free.app/orderGroup/orderGroupCancel", {
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
        await Axios.post("https://f8d3a9035cb7.ngrok-free.app/orderGroup/orderGroupSaveObs", {
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

 