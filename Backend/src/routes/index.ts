import { Router } from 'express';
import userRouter from './user.routes';
import uploadRouter from './upload.routes';

const router = Router();

// Ajouter les routes
router.use('/users', userRouter);
router.use('/uploads', uploadRouter);

export default router;
