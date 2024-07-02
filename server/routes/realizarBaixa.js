import express from "express";
import { realizarBaixa } from "../controllers/realizarBaixa.js";

const realizarBaixaRouter = express.Router()


realizarBaixaRouter.post('/realizarBaixa', realizarBaixa)

export default realizarBaixaRouter