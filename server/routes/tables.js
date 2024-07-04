import express from "express";
import { getTable } from "../controllers/table.js";

const getTableRoute = express.Router()


getTableRoute.get('/getTable', getTable)

export default getTableRoute