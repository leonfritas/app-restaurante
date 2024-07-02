import express from "express";

import { grupoPedidoCancelar, grupoPedidoFinalizar, grupoPedidoInserir, grupoPedidoListar, grupoPedidoSalvar,} from '../controllers/requestedGroup.js'

const orderGroupRoute = express.Router()

orderGroupRoute.get('/orderGroupInsert', grupoPedidoInserir)
orderGroupRoute.post('/orderGroupCancel', grupoPedidoCancelar)
orderGroupRoute.post('/orderGroupSave', grupoPedidoSalvar)
orderGroupRoute.post('/orderGroupFinalize', grupoPedidoFinalizar)
orderGroupRoute.post('/orderGroupList', grupoPedidoListar)

export default orderGroupRoute
