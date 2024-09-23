import express from 'express'

import { listaProduto, productDelete, productRegister } from '../controllers/product.js'

const productRoute = express.Router()

productRoute.post('/listProduct', listaProduto);
productRoute.post('/productRegister', productRegister);
productRoute.delete('/productDelete/:idProduto', productDelete);


export default productRoute

