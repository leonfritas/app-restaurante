import express from "express";
import { getCompany } from "../controllers/company.js";

const getCompanyRoute = express.Router()


getCompanyRoute.post('/getCompany', getCompany)


export default getCompanyRoute