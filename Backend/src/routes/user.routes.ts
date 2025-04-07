import { Router } from 'express'
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller'
import { uploadAvatar } from '../middleware/multer'

const userRouter = Router()

userRouter.get('/get-users', getUsers)
userRouter.get('/get-user-by-id/:id', getUserById)
userRouter.put('/update-user/:id', uploadAvatar,updateUser)
userRouter.delete('/delete-user/:id', deleteUser)

export default userRouter
