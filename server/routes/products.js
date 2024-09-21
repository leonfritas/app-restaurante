import express from 'express'

import { listaProduto, productRegister } from '../controllers/product.js'

const productRoute = express.Router()

productRoute.post('/listProduct', listaProduto)
productRoute.post('/productRegister', productRegister)


export default productRoute

