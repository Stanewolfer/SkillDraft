import { Request, Response } from 'express'
import { prisma } from '../config'

// fonction pour générer un feed
export const generateFeed = async (req: Request, res: Response) => {
  const userId = req.params.userId
  const page = parseInt(req.query.page as string) || 0
  const limit = parseInt(req.query.limit as string) || 10
  const offset = page * limit

  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followed: true }
  })

  const followedIds = followings.map(follow => follow.followed.id)

  followedIds.push(userId) // Include the user's own posts

  const regularPosts = await prisma.regularPost.findMany({
    where: { posterId: { in: followedIds } },
    include: {
      poster: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit
  })

  const offerPosts = await prisma.offerPost.findMany({
    where: { teamId: { in: followedIds } },
    include: {
      team: true
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalPosts = await prisma.regularPost.count({
    where: { posterId: { in: followedIds } }
  })

  const totalPages = Math.ceil(totalPosts / limit)

  const hasNextPage = page < totalPages - 1

  const hasPreviousPage = page > 0

  const nextPage = hasNextPage ? page + 1 : null

  const previousPage = hasPreviousPage ? page - 1 : null

  const feed = {
    regularPosts: regularPosts.map(post => ({
      ...post,
      likeCount: post.likes,
      commentCount: Array.isArray(post.comments) ? post.comments.length : 0,
    })),

    offerPosts: offerPosts.map(post => ({
      ...post,
    })),

    pagination: {
      totalPosts,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage
    }
  }

  res.json(feed)
}
