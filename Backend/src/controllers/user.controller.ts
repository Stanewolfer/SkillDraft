// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // Importation de Prisma pour l'accès à la BDD

const prisma = new PrismaClient();

// Récupérer un utilisateur
export const getUser = async (req: Request, res: Response) => {
    try {
        // Verify JWT token from header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Enregistrer un utilisateur
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Ici, tu pourrais ajouter des validations de données avant de créer l'utilisateur

    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password, // Assure-toi de hacher le mot de passe avant de le sauvegarder
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
