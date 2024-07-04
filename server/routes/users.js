import express from 'express'

import { listar, cadastrar, login, deleteUser} from '../controllers/user.js'

const userRoute = express.Router()

userRoute.get('/userList', listar)
userRoute.post('/register', cadastrar)
userRoute.post('/login', login)
userRoute.delete('/deleteUser/:id', deleteUser)


export default userRoute

