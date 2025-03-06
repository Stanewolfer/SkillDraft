import express from 'express';
import { uploadRoute } from '../controllers/uploads.controller';

const router = express.Router();

// Définir la route d'upload
router.post('/upload', uploadRoute);

export default router;
