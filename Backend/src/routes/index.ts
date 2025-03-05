import { Router } from 'express';
import userRouter from './user.routes';
import uploadRouter from './upload.routes';
import postRouter from './posts.routes';
import messagesRouter from './messages.routes';

const router = Router();

// Ajouter les routes
router.use('/users', userRouter);
router.use('/uploads', uploadRouter);
router.use('/posts', postRouter)
router.use('/messages', messagesRouter)

export default router;
