import { RequestHandler, Router } from 'express'
import {
  login,
  uuidLogin,
  registerEntity
} from '../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/login', login as RequestHandler)
authRouter.post('/fast-login/:id', uuidLogin as RequestHandler)
authRouter.post('/register', registerEntity as RequestHandler)

export default authRouter