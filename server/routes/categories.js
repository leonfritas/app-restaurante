import express from "express";
import { getCategory, filterByCategory } from "../controllers/category.js";

const getCategoryRoute = express.Router()


getCategoryRoute.post('/getCategory', getCategory)
getCategoryRoute.post('/filterByCategory', filterByCategory)


export default getCategoryRoute