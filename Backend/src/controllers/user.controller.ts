import { Request, Response } from 'express'
import { prisma } from '../config'
import bcrypt from 'bcryptjs'

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

//supprimer un user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
};

