import express from "express";
import { realizarBaixa, movimentoRealizado } from "../controllers/Financier.js";

const financierRoute = express.Router()


financierRoute.post('/realizarBaixa', realizarBaixa)
financierRoute.post('/movimentoRealizado', movimentoRealizado)

export default financierRoute