import { Router } from 'express'
import { createPost, deletePost, getPost, getPosts, getPostsByPosterId, updatePost } from '../controllers/posts.controller'
import { uploadPostWithTextAndImages } from '../middleware/multer'


const postRouter = Router()

postRouter.get('/get-all-posts', getPosts)
postRouter.get('/get-post/:id', getPost)
postRouter.get('/get-post-of/:posterId', getPostsByPosterId)
postRouter.post('/create', uploadPostWithTextAndImages, createPost)
postRouter.put('/update/:id', uploadPostWithTextAndImages, updatePost) // Reusing createPost for updates
postRouter.delete('/delete-post/:id', deletePost)

export default postRouter