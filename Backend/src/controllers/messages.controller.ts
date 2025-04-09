import { Request, Response } from 'express'
import { prisma } from '../config'

// envoyer un message
export const sendMessage = async (req: Request, res: Response) => {
  const { content, conversationId } = req.body
  const userId = req.params.userId

  if (!content || !conversationId) {
    return res
      .status(400)
      .json({ message: 'Content and conversationId are required' })
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        updatedAt: new Date(),
        lastMessage: {
          connect: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            senderId: message.senderId,
            conversationId: message.conversationId
          }
        }
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

// récupérer tous les messages d'une conversation
export const getMessagesByConvId = async (req: Request, res: Response) => {
  const convId = req.params.convId

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: convId
      },
      include: {
        sender: true
      }
    })

    res.status(200).json(messages)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// récupérer un message par son ID
export const getMessageById = async (req: Request, res: Response) => {
  const messageId = req.params.messageId

  try {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId
      },
      include: {
        sender: true
      }
    })

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    res.status(200).json(message)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// supprimer un message
export const deleteMessage = async (req: Request, res: Response) => {
  const messageId = req.params.messageId

  try {
    const message = await prisma.message.delete({
      where: {
        id: messageId
      }
    })

    res.status(200).json(message)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
