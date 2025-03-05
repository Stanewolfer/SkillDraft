import { Router } from 'express';
import userRouter from './user.routes';
import uploadRouter from './upload.routes';
import postRouter from './posts.routes';

const router = Router();

// Ajouter les routes
router.use('/users', userRouter);
router.use('/uploads', uploadRouter);
router.use('/posts', postRouter)

export default router;
