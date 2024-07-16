import express from "express";
import { getTable, joinTable, getOrderTable } from "../controllers/table.js";

const getTableRoute = express.Router()


getTableRoute.get('/getTable', getTable)
getTableRoute.post('/joinTable', joinTable)
getTableRoute.post('/getOrderTable', getOrderTable)

export default getTableRoute