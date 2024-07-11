import express from "express";
import { getCategory } from "../controllers/category.js";

const getCategoryRoute = express.Router()


getCategoryRoute.get('/getCategory', getCategory)


export default getCategoryRoute