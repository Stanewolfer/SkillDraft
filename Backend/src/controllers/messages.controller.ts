import { Request, Response } from 'express'
import { prisma } from '../config'

// route pour envoyer des messages
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { senderId, receiverId, content, offerPostId } = req.body

  if (!senderId || !receiverId || !content) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        offerPostId: offerPostId || null, // Si non fourni, reste null
        content
      }
    })

    res.status(201).json(message)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// route pour récupérer tous les messages
export const getAllMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const messages = await prisma.message.findMany()

    res.json(messages)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// route pour récupérer un message d'une offre
export const getMessagesForOffer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const offerPostId = req.params.offerPostId

  try {
    const messages = await prisma.message.findMany({
      where: { offerPostId },
      include: { sender: true, receiver: true }
    })

    res.json(messages)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// route pour récupérer un message entre deux users
export const getMessagesBetweenUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user1Id, user2Id } = req.params

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      },
      orderBy: { createdAt: 'asc' } // Trie les messages du plus ancien au plus récent
    })

    res.json(messages)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
