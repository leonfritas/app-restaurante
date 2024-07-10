import express from "express";

import { grupoPedidoCancelar, grupoPedidoFinalizar, grupoPedidoInserir, grupoPedidoListar, grupoPedidoSalvar, grupoPedidoEditar, grupoPedidoListarProduto } from '../controllers/requestedGroup.js'

const orderGroupRoute = express.Router()

orderGroupRoute.get('/orderGroupInsert', grupoPedidoInserir)
orderGroupRoute.post('/orderGroupCancel', grupoPedidoCancelar)
orderGroupRoute.post('/orderGroupSave', grupoPedidoSalvar)
orderGroupRoute.post('/orderGroupFinalize', grupoPedidoFinalizar)
orderGroupRoute.post('/orderGroupList', grupoPedidoListar)
orderGroupRoute.post('/orderGroupEdit', grupoPedidoEditar)
orderGroupRoute.post('/orderGroupListProduct', grupoPedidoListarProduto)

export default orderGroupRoute
