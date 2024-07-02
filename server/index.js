import express from "express"
import cors from 'cors'

import userRoute from './routes/users.js'
import productRoute from "./routes/products.js";
import orderRoute from "./routes/requests.js";
import orderGroupRoute from "./routes/ordersgroup.js";
import realizarBaixaRouter from "./routes/realizarBaixa.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cors());

app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/requested', orderRoute)
app.use('/orderGroup', orderGroupRoute)
app.use('/realizarBaixa', realizarBaixaRouter)
''


app.listen(3001, () => console.log('RODANDO SERVIDOR'))
