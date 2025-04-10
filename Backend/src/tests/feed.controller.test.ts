import { generateFeed } from '../controllers/feed.controller'
import { Request, Response } from 'express'
import prisma from '../config/database'

// Mock manual de prisma
jest.mock('../src/config', () => ({
  prisma: {
    follow: {
      findMany: jest.fn()
    },
    regularPost: {
      findMany: jest.fn()
    },
    offerPost: {
      findMany: jest.fn()
    }
  }
}))

describe('generateFeed', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock = jest.fn();

  beforeEach(() => {
    req = {
      params: { userId: 'user123' },
      query: { limit: '2' }
    }
    res = {
      json: jsonMock
    }
    jest.clearAllMocks()
  })

  it('should return combined and sorted posts from followed users', async () => {
    // Simuler les follow
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValue([
      { followed: { id: 'userA' } }
    ])

    // Simuler des regular posts
    ;(prisma.regularPost.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'post1',
        posterId: 'userA',
        createdAt: new Date('2024-01-01'),
        poster: { username: 'userA' }
      }
    ])

    // Simuler des offer posts
    ;(prisma.offerPost.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'offer1',
        teamId: 'user123',
        createdAt: new Date('2024-01-02'),
        team: { teamname: 'TeamX' }
      }
    ])

    await generateFeed(req as Request, res as Response)

    expect(jsonMock).toHaveBeenCalledWith({
      posts: [
        {
          id: 'offer1',
          teamId: 'user123',
          createdAt: new Date('2024-01-02'),
          team: { teamname: 'TeamX' },
          type: 'offer'
        },
        {
          id: 'post1',
          posterId: 'userA',
          createdAt: new Date('2024-01-01'),
          poster: { username: 'userA' },
          type: 'regular'
        }
      ],
      nextCursor: null,
      hasMore: false
    })
  })
})
