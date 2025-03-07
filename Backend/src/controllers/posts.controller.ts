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
  const type = req.header('type')

  const { ...postData } = req.body

  try {
    let newPost

    if (type === 'regular') {
      newPost = await prisma.regularPost.create({
        data: {
          description: postData.description,
          imageList: postData.imageList,
          posterId: postData.posterId,
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
          description: postData.description,
          teamId: postData.teamId,
          imageList: postData.imageList,
          applyingUserList: []
        }
      })
    } else {
      res.status(400).json({ message: 'Invalid post type' })
      return
    }

    res.status(201).json(newPost)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}


// suppression d'un post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id;

  try {
    // Vérifier si le post existe dans l'une des deux tables
    const regularPost = await prisma.regularPost.findUnique({ where: { id: postId } });
    const offerPost = await prisma.offerPost.findUnique({ where: { id: postId } });

    if (!regularPost && !offerPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Supprimer dans la table correspondante
    if (regularPost) {
      await prisma.regularPost.delete({ where: { id: postId } });
    } else {
      await prisma.offerPost.delete({ where: { id: postId } });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
};
