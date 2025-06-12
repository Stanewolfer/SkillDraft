import { Request, Response } from 'express'
import { prisma } from '../config'

// créer une conversation
export const createConv = async (req: Request, res: Response) => {
  const { user1Id, user2Id } = req.body

  const existingConv = await prisma.conversation.findFirst({
    where: {
      OR: [
        { user1Id: user1Id, user2Id: user2Id },
        { user1Id: user2Id, user2Id: user1Id }
      ]
    }
  })

  if (existingConv) {
    return res.status(400).json({ message: 'Conversation already exists' })
  }

  const entity = await prisma.conversation.create({
    data: {
      user1Id,
      user2Id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  res.status(201).json(entity)
}

// récupérer toutes les conversations d'un utilisateur
export const getConvsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }]
    },
    include: {
      lastMessage: true,
    }
  })

  res.status(200).json(conversations)
}

// récupérer une conversation par son ID
export const getConvById = async (req: Request, res: Response) => {
  const convId = req.params.convId

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: convId
    },
    include: {
      lastMessage: true
    }
  })

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' })
  }

  res.status(200).json(conversation)
}

// récupérer toutes les conversations d'une équipe
export const getConvsByTeamId = async (req: Request, res: Response) => {
  const teamId = req.params.teamId

  const conversations = await prisma.conversation.findMany({
    where: {
      teamId: teamId
    }
  })

  res.status(200).json(conversations)
}

// mettre à jour une conversation
export const updateConv = async (req: Request, res: Response) => {
  const convId = req.params.convId
  const { user1Id, user2Id } = req.body

  const conversation = await prisma.conversation.update({
    where: { id: convId },
    data: {
      user1Id,
      user2Id,
      updatedAt: new Date()
    }
  })


  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' })
  }

  res.status(200).json(conversation)
}

// supprimer une conversation
export const deleteConv = async (req: Request, res: Response) => {
  const convId = req.params.convId

  const conversation = await prisma.conversation.delete({
    where: {
      id: convId
    }
  })

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' })
  }

  res.status(200).json({ message: 'Conversation deleted successfully' })
}

export const startOrGetConv = async (req: Request, res: Response) => {
  const { user1Id, user2Id } = req.body;

  if (!user1Id || !user2Id) {
    return res.status(400).json({ message: 'Les deux IDs utilisateurs sont requis.' });
  }

  try {
    // Cherche une conversation existante entre ces deux utilisateurs (dans les deux sens)
    const existingConv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      }
    });

    if (existingConv) {
      return res.status(200).json(existingConv);
    }

    // Si elle n'existe pas, on la crée
    const newConv = await prisma.conversation.create({
      data: {
        user1Id,
        user2Id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return res.status(201).json(newConv);
  } catch (error) {
    console.error('Erreur dans startOrGetConv:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};


