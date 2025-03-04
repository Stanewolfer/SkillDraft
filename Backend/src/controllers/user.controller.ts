import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client' // Importation de Prisma pour l'accès à la BDD
import bcrypt from 'bcryptjs'
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient()

// se log avec l'uuid stocké dans le local storage
export const uuidLogin = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// login classique avec username et mot de passe
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Enregistrer un utilisateur
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword, // Stocke le mot de passe haché
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      }
    })

    res.status(201).json(newUser)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
