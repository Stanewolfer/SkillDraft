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
  const { username, password } = req.body
  const entityType = req.header('type')

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    let entity = null

    if (entityType === 'team') {
      entity = await prisma.team.findUnique({ where: { teamname: username } })
    } else {
      entity = await prisma.user.findUnique({ where: { username } })
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
  const { username, password, ...rest } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)
    let newEntity = null

    if (entityType === 'team') {
      newEntity = await prisma.team.create({
        data: {
          teamname: username,
          password: hashedPassword,
          ...rest
        }
      })
    } else {
      newEntity = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
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
