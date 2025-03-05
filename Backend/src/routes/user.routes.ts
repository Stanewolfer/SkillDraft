import { RequestHandler, Router } from 'express';
import { registerUser, uuidLogin, login, getUsers, getUserById } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/register', registerUser as RequestHandler);
userRouter.post('/login', login as RequestHandler);
userRouter.post('/uuid-login/:id', uuidLogin as RequestHandler);
userRouter.get('/get-users', getUsers);
userRouter.get('/get-user-by-id/:id', getUserById)

export default userRouter;
