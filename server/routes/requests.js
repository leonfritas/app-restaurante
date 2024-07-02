import express from "express";

import { pedidoinserir, pedidoExcluir} from '../controllers/request.js'

const orderRoute = express.Router()

orderRoute.post('/requestInsert', pedidoinserir)

orderRoute.post('/requestDelete', pedidoExcluir)

export default orderRoute

