import { RequestHandler, Router } from 'express'

import {
  createConv,
  getConvById,
  getConvsByUserId,
  startOrGetConv,
  updateConv
} from '../controllers/convs.controller'

const convsRouter = Router()

convsRouter.post('/create', createConv as RequestHandler)
convsRouter.get('/get-user-convs/:userId', getConvsByUserId as RequestHandler)
convsRouter.get('/get-team-convs/:teamId', getConvsByUserId as RequestHandler)
convsRouter.post('/start-or-get', startOrGetConv as unknown as RequestHandler);
convsRouter.get('/get-conv/:convId', getConvById as RequestHandler)
convsRouter.put('/update/:convId', updateConv as RequestHandler)
convsRouter.delete('/delete/:convId', updateConv as RequestHandler)

export default convsRouter