import express from "express";
import { realizarBaixa } from "../controllers/Financier.js";

const financierRoute = express.Router()


financierRoute.post('/realizarBaixa', realizarBaixa)

export default financierRoute