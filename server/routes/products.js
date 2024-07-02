import express from 'express'

import { listaProduto, productRegister } from '../controllers/product.js'

const productRoute = express.Router()

productRoute.get('/listProduct', listaProduto)
productRoute.post('/productRegister', productRegister)


export default productRoute

