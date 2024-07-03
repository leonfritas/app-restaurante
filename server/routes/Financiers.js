import express from "express";
import { realizarBaixa } from "../controllers/Financier.js";

const FinancierRouter = express.Router()


FinancierRouter.post('/realizarBaixa', realizarBaixa)

export default FinancierRouter