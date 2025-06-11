import { Request, Response } from 'express'
import { prisma } from '../../../src/config'
import {
  uuidLogin,
  login,
  registerEntity
} from '../../../src/controllers/auth.controller'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock('../../../src/config', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn()
    },
    team: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn()
    }
  }
}))

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks() // Clear any previous mocks before each test
  })

  // Registration Tests
  describe('registerEntity', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'user1',
        email: 'user@example.com',
        password: 'hashed-password',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }

      // Mocking the Prisma call
      ;(prisma.user.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      )
      ;(prisma.user.create as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(mockUser)
      )

      // Mocking bcrypt hash
      ;(bcrypt.hash as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve('hashed-password')
      )

      const req = {
        body: {
          username: 'user1',
          password: 'password',
          email: 'user@example.com'
        },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await registerEntity(req, res)

      expect(prisma.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [{ username: 'user1' }, { email: 'user@example.com' }]
          }
        })
      )
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10)
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            username: 'user1',
            password: 'hashed-password',
            email: 'user@example.com',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }
        })
      )
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    it('should register a new team', async () => {
      const mockTeam = {
        id: 'team-id',
        teamname: 'team1',
        email: 'team@example.com',
        password: 'hashed-password',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }

      // Mocking the Prisma call
      ;(prisma.team.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      )
      ;(prisma.team.create as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(mockTeam)
      )

      // Mocking bcrypt hash
      ;(bcrypt.hash as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve('hashed-password')
      )

      const req = {
        body: {
          username: 'team1',
          password: 'password',
          email: 'team@example.com'
        },
        header: jest.fn().mockReturnValue('team')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await registerEntity(req, res)

      expect(prisma.team.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [{ teamname: 'team1' }, { email: 'team@example.com' }]
          }
        })
      )
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10)
      expect(prisma.team.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            teamname: 'team1',
            password: 'hashed-password',
            email: 'team@example.com',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }
        })
      )
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockTeam)
    })

    it('should return 400 if username or password is missing', async () => {
      const req = {
        body: { username: 'user1' }, // Missing password
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await registerEntity(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username and password are required'
      })
    })

    it('should return 400 if user already exists', async () => {
      const existingUser = {
        id: 'user-id',
        username: 'existing',
        email: 'existing@example.com',
        password: 'hashed-password'
      }

      // Mocking the Prisma call
      ;(prisma.user.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(existingUser)
      )

      const req = {
        body: {
          username: 'existing',
          password: 'password',
          email: 'existing@example.com'
        },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await registerEntity(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'user already exists with this username or email'
      })
    })

    it('should handle errors during registration', async () => {
      // Mocking the Prisma call
      ;(prisma.user.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      )
      ;(bcrypt.hash as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('Hashing error'))
      )

      const req = {
        body: {
          username: 'user1',
          password: 'password',
          email: 'user@example.com'
        },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await registerEntity(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: 'Hashing error'
      })
    })
  })

  // Standard Login Tests
  describe('login', () => {
    it('should log in a user with valid credentials', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'user1',
        password: 'hashed-password'
      }

      // Mocking the Prisma call
      ;(prisma.user.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(mockUser)
      )

      // Mocking bcrypt comparison
      ;(bcrypt.compare as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(true)
      )

      // Mocking jwt.sign
      ;(jwt.sign as jest.Mock).mockImplementationOnce(() => 'mockedToken')

      const req = {
        body: { login: 'user1', password: 'password' },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(prisma.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { OR: [{ username: 'user1' }, { email: 'user1' }] }
        })
      )
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password)
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )
      expect(res.json).toHaveBeenCalledWith({
        entity: mockUser,
        token: 'mockedToken'
      })
    })

    it('should log in a team with valid credentials', async () => {
      const mockTeam = {
        id: 'team-id',
        teamname: 'team1',
        email: 'team@example.com',
        password: 'hashed-password'
      }

      // Mocking the Prisma call
      ;(prisma.team.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(mockTeam)
      )

      // Mocking bcrypt comparison
      ;(bcrypt.compare as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(true)
      )

      // Mocking jwt.sign
      ;(jwt.sign as jest.Mock).mockImplementationOnce(() => 'mockedToken')

      const req = {
        body: {
          login: 'team1',
          password: 'password',
          email: 'team@example.com'
        },
        header: jest.fn().mockReturnValue('team')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(prisma.team.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { teamname: 'team1', email: 'team@example.com' }
        })
      )
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockTeam.password)
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockTeam.id, type: 'team' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )
      expect(res.json).toHaveBeenCalledWith({
        entity: mockTeam,
        token: 'mockedToken'
      })
    })

    it('should return 400 if user credentials are missing', async () => {
      const req = {
        body: { login: 'user1' }, // Missing password
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username or email and password are required'
      })
    })

    it('should return 400 if team credentials are missing', async () => {
      const req = {
        body: { login: 'team1', password: 'password' }, // Missing email
        header: jest.fn().mockReturnValue('team')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username, email and password are required'
      })
    })

    it('should return 400 if entity type is invalid', async () => {
      const req = {
        body: { login: 'entity1', password: 'password' },
        header: jest.fn().mockReturnValue('invalid-type')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid entity type'
      })
    })

    it('should return 401 if user password is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'user1',
        password: 'hashed-password'
      }

      // Mocking the Prisma call
      ;(prisma.user.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(mockUser)
      )

      // Mocking bcrypt comparison
      ;(bcrypt.compare as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(false)
      )

      const req = {
        body: { login: 'user1', password: 'wrong-password' },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' })
    })

    it('should return 404 if user is not found', async () => {
      // Mocking the Prisma call
      ;(prisma.user.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      )

      const req = {
        body: { login: 'non-existent', password: 'password' },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'user not found' })
    })

    it('should handle errors during login', async () => {
      // Mocking the Prisma call to throw an error
      ;(prisma.user.findFirst as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('Database error'))
      )

      const req = {
        body: { login: 'user1', password: 'password' },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: 'Database error'
      })
    })
  })
  
  // UUID Login Tests
  describe('uuidLogin', () => {
    it('should login a user with valid uuid', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'user1',
        password: 'hashed-password'
      }

      // Mocking the Prisma call
      ;(prisma.user.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(mockUser)
      )

      // Mocking jwt.sign
      ;(jwt.sign as jest.Mock).mockImplementationOnce(() => 'mockedToken')

      const req = {
        params: { id: 'user-id' },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await uuidLogin(req, res)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id' }
      })
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user-id', type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )
      expect(res.json).toHaveBeenCalledWith({
        entity: mockUser,
        token: 'mockedToken'
      })
    })

    it('should login a team with valid uuid', async () => {
      const mockTeam = {
        id: 'team-id',
        teamname: 'team1',
        password: 'hashed-password'
      }

      // Mocking the Prisma call
      ;(prisma.team.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(mockTeam)
      )

      // Mocking jwt.sign
      ;(jwt.sign as jest.Mock).mockImplementationOnce(() => 'mockedToken')

      const req = {
        params: { id: 'team-id' },
        header: jest.fn().mockReturnValue('team')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await uuidLogin(req, res)

      expect(prisma.team.findUnique).toHaveBeenCalledWith({
        where: { id: 'team-id' }
      })
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'team-id', type: 'team' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )
      expect(res.json).toHaveBeenCalledWith({
        entity: mockTeam,
        token: 'mockedToken'
      })
    })

    it('should return 400 if no uuid is provided', async () => {
      const req = {
        params: {},
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await uuidLogin(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'UUID is required' })
    })

    it('should return 404 if entity is not found', async () => {
      // Mocking the Prisma call
      ;(prisma.user.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      )

      const req = {
        params: { id: 'non-existent-id' },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await uuidLogin(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'user not found' })
    })

    it('should handle errors during uuid login', async () => {
      // Mocking the Prisma call to throw an error
      ;(prisma.user.findUnique as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('Database error'))
      )

      const req = {
        params: { id: 'user-id' },
        header: jest.fn().mockReturnValue('user')
      } as unknown as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response

      await uuidLogin(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: 'Database error'
      })
    })
  })
})
