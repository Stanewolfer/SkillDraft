import { Request, Response } from 'express'
import { prisma } from '../config'
import bcrypt from 'bcryptjs'
const jwt = require('jsonwebtoken')

// 🔹 Connexion via UUID
export const uuidLogin = async (req: Request, res: Response) => {
  const id = req.params.id
  const entityType = req.header('type')

  if (!id) {
    return res.status(400).json({ message: 'UUID is required' })
  }

  try {
    let entity = null

    if (entityType === 'team') {
      entity = await prisma.team.findUnique({ where: { id } })
    } else {
      entity = await prisma.user.findUnique({ where: { id } })
    }

    if (!entity) {
      return res
        .status(404)
        .json({ message: `${entityType || 'user'} not found` })
    }

    const token = jwt.sign(
      { id: entity.id, type: entityType || 'user' },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    )

    res.json({ entity, token })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// 🔹 Connexion classique
export const login = async (req: Request, res: Response) => {
  const { login, password, email } = req.body
  const entityType = req.header('type')

  if (entityType === 'team') {
    if (!login || !password || !email) {
      return res
        .status(400)
        .json({ message: 'Username, email and password are required' })
    }
  } else if (entityType === 'user') {
    if (!login || !password) {
      return res
        .status(400)
        .json({ message: 'Username or email and password are required' })
    }
  } else {
    return res.status(400).json({ message: 'Invalid entity type' })
  }

  try {
    let entity = null

    if (entityType === 'team') {
      entity = await prisma.team.findUnique({
        where: { teamname: login, email: email }
      })
    } else {
      entity = await prisma.user.findFirst({
        where: {
          OR: [{ username: login }, { email: login }]
        }
      })
    }

    if (!entity) {
      return res
        .status(404)
        .json({ message: `${entityType || 'user'} not found` })
    }

    const validPassword = await bcrypt.compare(password, entity.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      { id: entity.id, type: entityType || 'user' },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    )

    res.json({ entity, token })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// 🔹 Inscription (user ou team)
export const registerEntity = async (req: Request, res: Response) => {
  const entityType = req.header('type')
  const { username, password, email, teamId, ...rest } = req.body
  const avatarUrl = req.file?.path || 'http://127.0.0.1:4040/uploads/empty_profile.png'
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    let existingEntity = null
    if (entityType === 'team') {
      existingEntity = await prisma.team.findFirst({
        where: {
          OR: [{ teamname: username }, { email: email }]
        }
      })
    } else {
      existingEntity = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }]
        }
      })
    }

    if (existingEntity) {
      return res.status(400).json({
        message: `${
          entityType || 'user'
        } already exists with this username or email`
      })
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)
    let newEntity = null

    if (entityType === 'team') {
      newEntity = await prisma.team.create({
        data: {
          teamname: username,
          password: hashedPassword,
          email,
          logoUrl: avatarUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          teamId: teamId || undefined,
          ...rest
        }
      })
    } else {
      newEntity = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
          avatarUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          teamId: teamId || null,
          ...rest
        }
      })
    }

    res.status(201).json(newEntity)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
