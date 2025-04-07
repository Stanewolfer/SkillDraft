import { Router } from 'express'
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller'
import { upload } from '../middleware/multer'

const userRouter = Router()

userRouter.get('/get-users', getUsers)
userRouter.get('/get-user-by-id/:id', getUserById)
userRouter.put('/update-user/:id', upload.single('avatar'),updateUser)
userRouter.delete('/delete-user/:id', deleteUser)

export default userRouter
