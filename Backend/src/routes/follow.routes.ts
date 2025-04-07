import { RequestHandler, Router } from 'express'
import { createFollow, deleteFollow, getFollowers, getFollowing } from '../controllers/follow.controller'

const followRouter = Router()

followRouter.post('/create', createFollow as RequestHandler)
followRouter.get('/:id/followers',  getFollowers as RequestHandler)
followRouter.get('/:id/following',  getFollowing as RequestHandler)
followRouter.delete('/delete', deleteFollow as RequestHandler)

export default followRouter