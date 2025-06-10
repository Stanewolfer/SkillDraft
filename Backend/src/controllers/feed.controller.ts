import { Request, Response } from 'express'
import { prisma } from '../config'

// fonction pour générer un feed
export const generateFeed = async (req: Request, res: Response) => {
  const userId = req.params.userId
  const cursor = req.query.cursor as string | undefined
  const limit = parseInt(req.query.limit as string) || 10

  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followed: true }
  })

  const followedIds = followings.map(follow => follow.followed.id)
  followedIds.push(userId)

  // On récupère les regular posts
  const regularPosts = await prisma.regularPost.findMany({
    where: {
      posterId: {
        in: followedIds
      }
    },
    include: { poster: true },
    orderBy: { createdAt: 'desc' }
  })

  // Et les offer posts
  const offerPosts = await prisma.offerPost.findMany({
    where: { teamId: { in: followedIds } },
    include: { team: true },
    orderBy: { createdAt: 'desc' }
  })

  // On combine et trie tous les posts selon leur date de création
  const allPosts = [
    ...regularPosts.map(p => ({ ...p, type: 'regular' })),
    ...offerPosts.map(p => ({ ...p, type: 'offer' }))
  ]

  allPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const startIndex = cursor
    ? allPosts.findIndex(post => post.id === cursor) + 1
    : 0
  const paginatedPosts = allPosts.slice(startIndex, startIndex + limit)
  const nextCursor =
    paginatedPosts.length + startIndex < allPosts.length
      ? paginatedPosts[paginatedPosts.length - 1].id
      : null

  res.json({
    posts: paginatedPosts,
    nextCursor,
    hasMore: nextCursor !== null
  })
}
