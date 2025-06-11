import { Request, Response } from 'express'
import { prisma } from '../config'
import { getPost } from './posts.controller'

/**
 * Génère et stocke/met à jour le fil d'actualité d'un utilisateur.
 * Cette fonction devrait être appelée en arrière-plan ou déclenchée par des événements (ex: nouveau post, nouvel abonnement).
 * @param userId L'ID de l'utilisateur pour lequel générer le fil d'actualité.
 */
export const generateAndStoreFeed = async (userId: string) => {
  try {
    // Récupérer les utilisateurs suivis directs
    const followings = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followedId: true }
    })
    const followedUserIds = followings.map(follow => follow.followedId)

    // Récupérer les utilisateurs suivis par les utilisateurs suivis
    const followers = await prisma.follow.findMany({
      where: { followedId: userId },
      select: { followedId: true }
    })
    const followedByUserIds = followers.map(follow => follow.followedId) 

    // Combiner tous les IDs d'utilisateurs pertinents
    const allRelevantUserIds = [...new Set([...followedUserIds, ...followedByUserIds, userId])]
    const teamFollows = await prisma.teamFollow.findMany({
      where: { userId: userId },
      select: { teamId: true }
    })
    const followedTeamIds = teamFollows.map(teamFollow => teamFollow.teamId)

    // Récupérer les regular posts des utilisateurs suivis (et de leurs suivis)
    const regularPosts = await prisma.regularPost.findMany({
      where: {
        posterId: {
          in: allRelevantUserIds
        }
      },
      select: {
        id: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Récupérer les offer posts des équipes suivies
    const offerPosts = await prisma.offerPost.findMany({
      where: {
        teamId: {
          in: followedTeamIds
        }
      },
      select: {
        id: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Combiner tous les IDs de posts pertinents et leurs dates de création
    const allRelevantPostIds = [
      ...regularPosts.map(p => ({
        id: p.id,
        createdAt: p.createdAt,
        type: 'regular'
      })),
      ...offerPosts.map(p => ({
        id: p.id,
        createdAt: p.createdAt,
        type: 'offer'
      }))
    ]

    // Trier par date de création
    allRelevantPostIds.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    // Obtenir les éléments de fil d'actualité existants pour l'utilisateur
    const existingFeedItems = await prisma.feed.findMany({
      where: { userId: userId },
      select: { regularPostId: true, offerPostId: true }
    })

    const existingPostIds = new Set<string>()
    existingFeedItems.forEach(item => {
      if (item.regularPostId) existingPostIds.add(item.regularPostId)
      if (item.offerPostId) existingPostIds.add(item.offerPostId)
    })

    const newFeedEntries = []
    for (const post of allRelevantPostIds) {
      if (!existingPostIds.has(post.id)) {
        if (post.type === 'regular') {
          newFeedEntries.push({
            userId: userId,
            regularPostId: post.id,
            createdAt: post.createdAt
          })
        } else if (post.type === 'offer') {
          newFeedEntries.push({
            userId: userId,
            offerPostId: post.id,
            createdAt: post.createdAt
          })
        }
      }
    }

    if (newFeedEntries.length > 0) {
      await prisma.feed.createMany({
        data: newFeedEntries,
        skipDuplicates: true
      })
    }
  } catch (error) {
    console.error(
      `Erreur lors de la génération du fil d'actualité pour l'utilisateur ${userId}:`,
      error
    )
  }
}

/**
 * Endpoint API pour déclencher manuellement la génération du fil d'actualité.
 * Devrait être utilisé avec prudence en production.
 */
export const triggerFeedGeneration = async (req: Request, res: Response) => {
  const userId = req.params.userId
  if (!userId) {
    return res.status(400).json({ message: "L'ID utilisateur est requis." })
  }

  generateAndStoreFeed(userId)
    .then(() => {
      res.status(200).json({
        message: `Génération du fil d'actualité initiée pour l'utilisateur ${userId}.`
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Échec de la génération du fil d'actualité.",
        error: error.message
      })
    })
}

/**
 * Endpoint API pour récupérer le fil d'actualité pré-généré d'un utilisateur.
 */
export const fetchUserFeed = async (req: Request, res: Response) => {
  const userId = req.params.userId

  if (!userId) {
    return res.status(400).json({ message: "L'ID utilisateur est requis." })
  }

  // Assurer que le fil d'actualité est généré avant de le récupérer
  await prisma.feed.count({ where: { userId: userId } }).then(count => {
    if (count === 0) {
      console.log(
        `Aucun fil d'actualité trouvé pour l'utilisateur ${userId}. Génération en cours...`
      )
    }
  })
  await generateAndStoreFeed(userId) // Assertion que le fil d'actualité est généré avant de le récupérer
    .catch(error => {
      console.error(
        `Erreur lors de la génération du fil d'actualité pour l'utilisateur ${userId}:`,
        error
      )
    })

  try {
    const feedItems = await prisma.feed.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        regularPost: {
          include: { poster: true }
        },
        offerPost: {
          include: { team: true }
        }
      }
    })

    // Filtrer les éléments de fil d'actualité qui pourraient faire référence à des posts supprimés
    const validFeedItems = feedItems.filter(
      item => item.regularPostId || item.offerPostId
    ) as Array<
      (typeof feedItems)[0] & {
        regularPost?: { poster: any } | null
        offerPost?: { team: any } | null
      }
    >

    // Mapper vers une structure cohérente pour le client
    const posts = validFeedItems
      .map(item => {
        if (item.regularPostId) {
          return {
            feedItemId: item.id,
            type: 'regular',
            post: item.regularPost,
            poster: item.regularPost?.poster,
            createdAt: item.createdAt
          }
        } else if (item.offerPostId) {
          return {
            feedItemId: item.id,
            type: 'offer',
            post: item.offerPost,
            team: item.offerPost?.team,
            createdAt: item.createdAt
          }
        }
        return null
      })
      .filter(post => post !== null)
    // Trier les posts par date de création décroissante
    posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    res.json({ posts })
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du fil d'actualité de l'utilisateur:",
      error
    )
    res.status(500).json({
      message: "Échec de la récupération du fil d'actualité.",
      error:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}
