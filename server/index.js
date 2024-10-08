import express from "express"

import cors from 'cors'

import bodyParser from 'body-parser';

import 'dotenv/config'

import userRoute from './routes/users.js'
import productRoute from "./routes/products.js";
import orderRoute from "./routes/requests.js";
import orderGroupRoute from "./routes/ordersgroup.js";
import financierRoute from "./routes/Financiers.js";
import getTableRoute  from "./routes/tables.js";
import getCategoryRoute  from "./routes/categories.js";
import getCompanyRoute  from "./routes/company.js";



const app = express();
const JWT_SECRET = '66ee87a985073'

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

app.use(cors());

app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/requested', orderRoute)
app.use('/orderGroup', orderGroupRoute)
app.use('/financier', financierRoute)
app.use('/table', getTableRoute)
app.use('/category', getCategoryRoute)
app.use('/company', getCompanyRoute)


app.listen(3001, () => console.log('RODANDO SERVIDOR'))
