import { conectDB } from '../db.js';

// Função genérica para executar queries no SQL Server
async function executeQuery(database, sql, params = {}) {
    try {
        const pool = await conectDB(database);
        const request = pool.request();

        // Adiciona parâmetros dinamicamente
        for (const key in params) {
            request.input(key, params[key]);
        }

        const result = await request.query(sql);
        return result.recordset;
    } catch (err) {
        console.error("Erro ao executar a query:", err);
        throw err;
    }
}

// Salvar grupo de pedido
export const grupoPedidoSalvar = async (req, res) => {
    const { idGrupoPedido, nomeGrupoPedido, idMesa, textoObservacao, database } = req.body;

    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_grupoPedido_salvar @idGrupoPedido, @nomeGrupoPedido, @idMesa, @textoObservacao';
        const result = await executeQuery(database, sql, { idGrupoPedido, nomeGrupoPedido, idMesa, textoObservacao });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao salvar grupo de pedido." });
    }
};

// Cancelar grupo de pedido
export const grupoPedidoCancelar = async (req, res) => {
    const { idGrupoPedido, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_GrupoPedido_Cancelar @idGrupoPedido';
        const result = await executeQuery(database, sql, { idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao cancelar grupo de pedido." });
    }
};

// Inserir grupo de pedido
export const grupoPedidoInserir = async (req, res) => {
    const { idFuncionario, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_GrupoPedido_Inserir @idFuncionario';
        const result = await executeQuery(database, sql, { idFuncionario });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao inserir grupo de pedido." });
    }
};

// Listar grupos de pedido
export const grupoPedidoListar = async (req, res) => {
    const { dataEntrada, ativoPedidoPronto, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_GrupoPedido_Listar @dataEntrada;'//, @ativoPedidoPronto';
        const result = await executeQuery(database, sql, { dataEntrada, ativoPedidoPronto });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao listar grupos de pedido." });
    }
};

// Finalizar grupo de pedido
export const grupoPedidoFinalizar = async (req, res) => {
    const { idGrupoPedido, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_GrupoPedido_Finalizar @idGrupoPedido';
        const result = await executeQuery(database, sql, { idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao finalizar grupo de pedido." });
    }
};

// Editar grupo de pedido
export const grupoPedidoEditar = async (req, res) => {
    const { idGrupoPedido, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_GrupoPedido_Editar @idGrupoPedido';
        const result = await executeQuery(database, sql, { idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao editar grupo de pedido." });
    }
};

// Listar produtos do grupo de pedido
export const grupoPedidoListarProduto = async (req, res) => {
    const { idGrupoPedido, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_GrupoPedido_ListarProduto @idGrupoPedido';
        const result = await executeQuery(database, sql, { idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao listar produtos do grupo de pedido." });
    }
};

// Salvar observação do grupo de pedido
export const grupoPedidoSaveObs = async (req, res) => {
    const { idGrupoPedido, observacao, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_GrupoPedido_salvarObservacao @idGrupoPedido, @observacao';
        const result = await executeQuery(database, sql, { idGrupoPedido, observacao });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao salvar observação do grupo de pedido." });
    }
};
