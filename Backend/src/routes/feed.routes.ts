import { Router } from 'express'
import { generateFeed } from '../controllers/feed.controller'


const feedRouter = Router()

feedRouter.get('/generate/:userId', generateFeed)

export default feedRouter