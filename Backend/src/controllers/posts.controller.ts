import { Request, Response } from 'express'
import { prisma } from '../config'

// Récupération de tous les posts en BDD
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const regularPosts = await prisma.regularPost.findMany()
    const offerPosts = await prisma.offerPost.findMany()

    res.json({ regularPosts, offerPosts })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Récupération d'un post via son ID (dans les deux collections)
export const getPost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id

  try {
    const regularPost = await prisma.regularPost.findUnique({
      where: { id: postId }
    })

    if (regularPost) {
      res.json({ type: 'regular', post: regularPost })
      return
    }

    const offerPost = await prisma.offerPost.findUnique({
      where: { id: postId }
    })

    if (offerPost) {
      res.json({ type: 'offer', post: offerPost })
      return
    }

    res.status(404).json({ message: 'Post not found' })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Récupération de tous les posts d'un créateur ou d'une équipe
export const getPostsByPosterId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const posterId = req.params.posterId

  try {
    // Récupérer les posts réguliers où le posterId correspond
    const regularPosts = await prisma.regularPost.findMany({
      where: { posterId }
    })

    // Récupérer les posts d'offre où le teamId correspond
    const offerPosts = await prisma.offerPost.findMany({
      where: { teamId: posterId } // Correspond au créateur de l'offre
    })

    // Retourner une seule réponse contenant les deux types de posts
    res.json({ regularPosts, offerPosts })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Création d'un post
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { posterId, description, title, type } = req.body
  let imageList: string[] = []

  if (req.files) {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[]
    }
    imageList = files?.images?.map(
      file => `${req.protocol}://localhost:5000/uploads/${file.filename}`
    ) || []
  }

  try {
    let newPost

    if (type === 'regular') {
      newPost = await prisma.regularPost.create({
        data: {
          posterId,
          description,
          title,
          imageList,
          likes: 0,
          likesList: [],
          reposts: 0,
          repostsList: [],
          comments: []
        }
      })
    } else if (type === 'offer') {
      newPost = await prisma.offerPost.create({
        data: {
          teamId: posterId,
          description,
          title,
          imageList,
          applyingUserList: []
        }
      })
      res.status(201).json({
        message: "Offer post created successfully here's the post's id",
        postId: newPost.id
      })
    } else {
      res.status(400).json({ message: 'Invalid post type' })
      return
    }

    res.status(201).json(newPost)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const postId = req.params.id
  const { title, content } = req.body
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[]
  }
  const imageList =
    files?.images?.map(
      file => `${req.protocol}://localhost:5000/uploads/${file.filename}`
    ) || []

  try {
    let updatedPost

    // Rechercher le post dans la table regularPost
    updatedPost = await prisma.regularPost.findUnique({
      where: { id: postId }
    })

    if (updatedPost) {
      updatedPost = await prisma.regularPost.update({
        where: { id: postId },
        data: { title, description: content, imageList: imageList }
      })
    } else {
      // Rechercher le post dans la table offerPost
      updatedPost = await prisma.offerPost.findUnique({
        where: { id: postId }
      })

      if (updatedPost) {
        updatedPost = await prisma.offerPost.update({
          where: { id: postId },
          data: { title, description: content, imageList: imageList }
        })
      } else {
        res.status(404).json({ message: 'Post not found' })
        return
      }
    }

    res.json(updatedPost)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// suppression d'un post
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const postId = req.params.id

  try {
    // Vérifier si le post existe dans l'une des deux tables
    const regularPost = await prisma.regularPost.findUnique({
      where: { id: postId }
    })
    const offerPost = await prisma.offerPost.findUnique({
      where: { id: postId }
    })

    if (!regularPost && !offerPost) {
      res.status(404).json({ message: 'Post not found' })
      return
    }

    // Supprimer dans la table correspondante
    if (regularPost) {
      await prisma.regularPost.delete({ where: { id: postId } })
    } else {
      await prisma.offerPost.delete({ where: { id: postId } })
    }

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
