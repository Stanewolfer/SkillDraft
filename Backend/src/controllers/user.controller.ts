import { Request, Response } from 'express'
import { prisma } from '../config'
import bcrypt from 'bcryptjs'
const jwt = require('jsonwebtoken')

// se log avec l'uuid stocké dans le local storage
export const uuidLogin = async (req: Request, res: Response) => {
  const id = req.params.id

  console.log('Received UUID:', id)

  if (!id) {
    return res.status(400).json({ message: 'UUID is required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    })
    res.json({ user, token })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// login classique avec username et mot de passe
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    })
    res.json({ user, token })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Enregistrer un utilisateur
export const registerUser = async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, email } = req.body

  // Vérification de la présence des champs requis
  if (!username || !password || !firstName || !lastName || !email) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword, // Stocke le mot de passe haché
        firstName,
        lastName,
        email
      }
    })

    res.status(201).json(newUser)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// récupération de tous les utilisateurs en bdd
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// récupération d'un user précis via son id
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    res.json(user)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// modification des infos d'un user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id
  const updateData = req.body

  try {
    // Préparer l'objet de mise à jour en ne gardant que les champs définis
    const dataToUpdate: { [key: string]: any } = {}

    if (updateData.username !== undefined)
      dataToUpdate.username = updateData.username
    if (updateData.firstName !== undefined)
      dataToUpdate.firstName = updateData.firstName
    if (updateData.lastName !== undefined)
      dataToUpdate.lastName = updateData.lastName
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email
    if (updateData.description !== undefined)
      dataToUpdate.description = updateData.description
    if (updateData.teamId !== undefined)
      dataToUpdate.teamId = updateData.teamId ?? null

    // Hash du mot de passe s'il est fourni
    if (updateData.password) {
      dataToUpdate.password = await bcrypt.hash(updateData.password, 10)
    }

    // Vérifier s'il y a des champs à mettre à jour
    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ message: 'No valid fields provided for update' })
      return
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    })

    res.json(updatedUser)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
