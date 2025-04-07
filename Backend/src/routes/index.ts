import { Router } from 'express'
import userRouter from './user.routes'
import postRouter from './posts.routes'
import messagesRouter from './messages.routes'
import authRouter from './auth.routes'
import teamRouter from './teams.routes'
import feedRouter from './feed.routes'

const router = Router()

// Ajouter les routes
router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/messages', messagesRouter)
router.use('/auth', authRouter)
router.use('/teams', teamRouter)
router.use('/feed', feedRouter)

export default router
