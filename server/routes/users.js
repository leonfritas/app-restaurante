import express from 'express'

import { listar, cadastrar, login} from '../controllers/user.js'

const userRoute = express.Router()

userRoute.get('/userList', listar)
userRoute.post('/register', cadastrar)
userRoute.post('/login', login)


export default userRoute

