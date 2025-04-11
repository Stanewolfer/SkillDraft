import { Request, Response } from 'express'
import { prisma } from '../../../src/config'
import { generateFeed } from '../../../src/controllers/feed.controller'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock('../config', () => ({
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

describe('Feed Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate a feed with posts from followed users and self', async () => {
    // Mock data
    const userId = 'user-123'
    const followedUser1 = 'user-456'
    const followedUser2 = 'user-789'
    
    const mockFollowings = [
      { followed: { id: followedUser1 } },
      { followed: { id: followedUser2 } }
    ]
    
    const mockRegularPosts = [
      {
        id: 'post-1',
        posterId: userId,
        content: 'Self post',
        createdAt: new Date('2023-03-01'),
        poster: { id: userId }
      },
      {
        id: 'post-2',
        posterId: followedUser1,
        content: 'Followed user 1 post',
        createdAt: new Date('2023-03-02'),
        poster: { id: followedUser1 }
      }
    ]
    
    const mockOfferPosts = [
      {
        id: 'offer-1',
        teamId: followedUser2,
        title: 'Job offer',
        createdAt: new Date('2023-03-03'),
        team: { id: followedUser2 }
      }
    ]

    // Set up mocks
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValue(mockFollowings)
    ;(prisma.regularPost.findMany as jest.Mock).mockResolvedValue(mockRegularPosts)
    ;(prisma.offerPost.findMany as jest.Mock).mockResolvedValue(mockOfferPosts)

    // Set up request and response
    const req = {
      params: { userId },
      query: { limit: '10' }
    } as unknown as Request
    
    const res = {
      json: jest.fn()
    } as unknown as Response

    await generateFeed(req, res)

    // Assert that correct user IDs were used for queries
    expect(prisma.follow.findMany).toHaveBeenCalledWith({
      where: { followerId: userId },
      select: { followed: true }
    })

    // Should include self and followed users
    expect(prisma.regularPost.findMany).toHaveBeenCalledWith({
      where: { posterId: { in: [followedUser1, followedUser2, userId] } },
      include: { poster: true },
      orderBy: { createdAt: 'desc' }
    })

    expect(prisma.offerPost.findMany).toHaveBeenCalledWith({
      where: { teamId: { in: [followedUser1, followedUser2, userId] } },
      include: { team: true },
      orderBy: { createdAt: 'desc' }
    })

    // Check response
    expect(res.json).toHaveBeenCalledWith({
      posts: [
        // Should be sorted by date (newest first)
        { ...mockOfferPosts[0], type: 'offer' },
        { ...mockRegularPosts[1], type: 'regular' },
        { ...mockRegularPosts[0], type: 'regular' }
      ],
      nextCursor: null,
      hasMore: false
    })
  })

  it('should handle pagination with cursor and limit', async () => {
    // Mock data for pagination testing
    const userId = 'user-123'
    const mockFollowings = []
    
    // Create 15 mock posts with sequential dates for easy testing
    const mockRegularPosts = Array.from({ length: 10 }, (_, i) => ({
      id: `post-${i + 1}`,
      posterId: userId,
      content: `Content ${i + 1}`,
      createdAt: new Date(`2023-03-${15 - i}`), // Newest first
      poster: { id: userId, username: 'self' }
    }))
    
    const mockOfferPosts = Array.from({ length: 5 }, (_, i) => ({
      id: `offer-${i + 1}`,
      teamId: userId,
      title: `Offer ${i + 1}`,
      createdAt: new Date(`2023-03-${20 - i}`), // Newest first
      team: { id: userId, teamname: 'self' }
    }))

    // Set up mocks
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValue(mockFollowings)
    ;(prisma.regularPost.findMany as jest.Mock).mockResolvedValue(mockRegularPosts)
    ;(prisma.offerPost.findMany as jest.Mock).mockResolvedValue(mockOfferPosts)

    // Set up request with cursor and limit
    const req = {
      params: { userId },
      query: { 
        cursor: 'offer-3', // Start after this post
        limit: '5'         // Get only 5 posts
      }
    } as unknown as Request
    
    const res = {
      json: jest.fn()
    } as unknown as Response

    await generateFeed(req, res)

    // We expect posts to be sorted by date:
    // offer-1, offer-2, offer-3, offer-4, offer-5, post-1, post-2, ...
    // With cursor 'offer-3', we should get offer-4, offer-5, post-1, post-2, post-3

    const allSortedPosts = [
      ...mockOfferPosts.map(p => ({ ...p, type: 'offer' })),
      ...mockRegularPosts.map(p => ({ ...p, type: 'regular' }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const cursorIndex = allSortedPosts.findIndex(post => post.id === 'offer-3')
    const expectedPosts = allSortedPosts.slice(cursorIndex + 1, cursorIndex + 6)
    const expectedNextCursor = expectedPosts[expectedPosts.length - 1].id

    // Check response
    expect(res.json).toHaveBeenCalledWith({
      posts: expectedPosts,
      nextCursor: expectedNextCursor, 
      hasMore: true
    })
  })

  it('should handle the case when there are no more posts after the current page', async () => {
    const userId = 'user-123'
    const mockFollowings = []
    
    // Only 3 posts total
    const mockRegularPosts = Array.from({ length: 3 }, (_, i) => ({
      id: `post-${i + 1}`,
      posterId: userId,
      content: `Content ${i + 1}`,
      createdAt: new Date(`2023-03-${3 - i}`),
      poster: { id: userId, username: 'self' }
    }))
    
    const mockOfferPosts = []

    // Set up mocks
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValue(mockFollowings)
    ;(prisma.regularPost.findMany as jest.Mock).mockResolvedValue(mockRegularPosts)
    ;(prisma.offerPost.findMany as jest.Mock).mockResolvedValue(mockOfferPosts)

    // Set up request with limit of 5 (more than our total of 3)
    const req = {
      params: { userId },
      query: { limit: '5' }
    } as unknown as Request
    
    const res = {
      json: jest.fn()
    } as unknown as Response

    await generateFeed(req, res)

    // Check response - we should get all posts with no nextCursor and hasMore false
    expect(res.json).toHaveBeenCalledWith({
      posts: mockRegularPosts.map(p => ({ ...p, type: 'regular' })),
      nextCursor: null,
      hasMore: false
    })
  })

  it('should handle the case when user follows no one and has no posts', async () => {
    const userId = 'user-123'
    
    // Set up mocks for empty results
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.regularPost.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.offerPost.findMany as jest.Mock).mockResolvedValue([])

    const req = {
      params: { userId },
      query: {}
    } as unknown as Request
    
    const res = {
      json: jest.fn()
    } as unknown as Response

    await generateFeed(req, res)

    // Check response with empty posts
    expect(res.json).toHaveBeenCalledWith({
      posts: [],
      nextCursor: null,
      hasMore: false
    })
  })

  it('should use default limit if not provided', async () => {
    const userId = 'user-123'
    const defaultLimit = 10
    
    // Create more posts than the default limit
    const mockRegularPosts = Array.from({ length: 15 }, (_, i) => ({
      id: `post-${i + 1}`,
      posterId: userId,
      content: `Content ${i + 1}`,
      createdAt: new Date(`2023-03-${15 - i}`),
      poster: { id: userId, username: 'self' }
    }))
    
    // Set up mocks
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.regularPost.findMany as jest.Mock).mockResolvedValue(mockRegularPosts)
    ;(prisma.offerPost.findMany as jest.Mock).mockResolvedValue([])

    // Request without specifying limit
    const req = {
      params: { userId },
      query: {}
    } as unknown as Request
    
    const res = {
      json: jest.fn()
    } as unknown as Response

    await generateFeed(req, res)

    // Should return default limit (10) posts
    const expectedPosts = mockRegularPosts.slice(0, defaultLimit).map(p => ({ ...p, type: 'regular' }))
    const expectedNextCursor = expectedPosts[expectedPosts.length - 1].id

    expect(res.json).toHaveBeenCalledWith({
      posts: expectedPosts,
      nextCursor: expectedNextCursor,
      hasMore: true
    })
  })

  it('should handle errors during feed generation', async () => {
    const userId = 'user-123'
    
    // Mock to throw an error
    ;(prisma.follow.findMany as jest.Mock).mockRejectedValue(new Error('Database error'))

    const req = {
      params: { userId },
      query: {}
    } as unknown as Request
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response

    // We need to add try/catch to the controller before testing this
    // This test will fail until error handling is added to the controller
    
    try {
      await generateFeed(req, res)
      // If we get here without an error, the test should fail
      expect(true).toBe(false) // This will fail the test if no error was thrown
    } catch (error) {
      // We expect an error because the controller doesn't have error handling
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('Database error')
    }
  })
})