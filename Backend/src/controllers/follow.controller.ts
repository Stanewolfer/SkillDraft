import { Request, Response } from 'express'
import { prisma } from '../config'

// fonction pour créer une relation de suivi entre deux utilisateurs
export const createFollow = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { followerId, followedId } = req.body
  let existingFollow = null
  try {
    // Vérifier si la relation de suivi existe déjà dans la table Follow pour les utilisateurs
    existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    })

    // vérifier si la relation de suivi existe déjà dans la table Follow pour les teams
    if (!existingFollow) {
      existingFollow = await prisma.teamFollow.findFirst({
        where: {
          userId: followerId,
          teamId: followedId
        }
      })
    }

    if (existingFollow) {
      res.status(400).json({ message: 'Follow relationship already exists' })
      return
    }

    let follow
    // Check si followedId correspond à une équipe ou un utilisateur
    const team = await prisma.team.findUnique({
      where: { id: followedId }
    })

    if (team) {
      // Créer une relation de suivi pour une équipe
      follow = await prisma.teamFollow.create({
        data: {
          userId: followerId,
          teamId: followedId
        }
      })
    } else {
      // Créer une relation de suivi pour un utilisateur
      follow = await prisma.follow.create({
        data: {
          followerId,
          followedId
        }
      })
    }
    res.status(201).json(follow)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// fonction pour récupérer tous les abonnés d'un utilisateur
export const getFollowers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id

  try {
    const followers = await prisma.follow.findMany({
      where: {
        followedId: userId
      },
      include: {
        follower: true // Include follower details if needed
      }
    })
    res.status(200).json({ count: followers.length, followers })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// fonction pour récupérer tous les utilisateurs suivis par un utilisateur
export const getFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id

  try {
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId
      },
      include: {
        followed: true // Include followed details if needed
      }
    })
    res.status(200).json({ count: following.length, following })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// fonction pour suprimer une relation de suivi entre deux utilisateurs
export const deleteFollow = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { followerId, followedId } = req.body

  try {
    const follow = await prisma.follow.deleteMany({
      where: {
        followerId,
        followedId
      }
    })
    res.status(200).json(follow)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
