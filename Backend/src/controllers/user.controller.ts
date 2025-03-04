import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// se log avec l'uuid stocké dans le local storage
export const uuidLogin = async (req: Request, res: Response) => {
  const id = req.params.id;
  
  console.log('Received UUID:', id); // Ajoute ce log pour vérifier l'UUID

  if (!id) {
    return res.status(400).json({ message: 'UUID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.json({ user, token });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
};


// login classique avec username et mot de passe
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    res.json({ user, token });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
};

// Enregistrer un utilisateur
export const registerUser = async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, email } = req.body;

  // Vérification de la présence des champs requis
  if (!username || !password || !firstName || !lastName || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword, // Stocke le mot de passe haché
        firstName,
        lastName,
        email
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
};
