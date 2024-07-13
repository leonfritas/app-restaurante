import express from "express";
import { getTable, joinTable } from "../controllers/table.js";

const getTableRoute = express.Router()


getTableRoute.get('/getTable', getTable)
getTableRoute.post('/joinTable', joinTable)

export default getTableRoute