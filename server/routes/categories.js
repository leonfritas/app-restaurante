import express from "express";
import { getCategory, filterByCategory, categoryRegister } from "../controllers/category.js";

const getCategoryRoute = express.Router()


getCategoryRoute.get('/getCategory', getCategory)
getCategoryRoute.post('/filterByCategory', filterByCategory)
getCategoryRoute.post('/addCategory', categoryRegister)


export default getCategoryRoute