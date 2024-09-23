import express from "express";
import { getCategory, filterByCategory, categoryRegister, categoryDelete } from "../controllers/category.js";

const getCategoryRoute = express.Router()


getCategoryRoute.post('/getCategory', getCategory)
getCategoryRoute.post('/filterByCategory', filterByCategory)
getCategoryRoute.post('/addCategory', categoryRegister)
getCategoryRoute.delete('/categoryDelete/:idCategoria', categoryDelete)


export default getCategoryRoute