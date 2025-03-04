
import express, { RequestHandler } from 'express';
import { registerUser, uuidLogin, login, getUsers } from '../controllers/user.controller';


const router = express.Router();

router.post('/register',  registerUser as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/uuid-login/:id', uuidLogin as RequestHandler);
router.get("/users", getUsers)

export default router;
