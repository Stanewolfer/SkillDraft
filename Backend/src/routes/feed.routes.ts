import { Router, RequestHandler } from 'express'
import { fetchUserFeed } from '../controllers/feed.controller'

const feedRouter = Router()

feedRouter.get('/fetch/:userId', fetchUserFeed as RequestHandler)

export default feedRouter
