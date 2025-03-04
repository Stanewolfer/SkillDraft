
import express, { RequestHandler } from 'express';
import { registerUser, uuidLogin, login } from '../controllers/user.controller';


const router = express.Router();

router.post('/register',  registerUser as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/uuid-login', uuidLogin as RequestHandler);

export default router;
