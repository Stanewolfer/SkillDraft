// Backend/src/controllers/messages.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../config'

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
  }
}

// envoyer un message (version HTTP, peut être utilisée comme fallback)
export const sendMessage = async (req: Request, res: Response) => {
  const { content, conversationId } = req.body
  const userId = req.params.userId

  if (!content || !conversationId) {
    return res
      .status(400)
      .json({ message: 'Content and conversationId are required' })
  }

  try {
    // Vérifier que l'utilisateur fait partie de cette conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user1Id: userId }, { user2Id: userId }]
      }
    })

    if (!conversation) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to send message to this conversation' })
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
      }
    })

    // Mettre à jour la conversation avec le dernier message
    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        updatedAt: new Date(),
        lastMessageid: message.id
      }
    })

    // Émettre le message via Socket.io si disponible
    const io = req.app.get('io')
    if (io) {
      io.to(`conversation-${conversationId}`).emit('new-message', message)

      // Notifier l'autre utilisateur
      const otherUserId =
        conversation.user1Id === userId
          ? conversation.user2Id
          : conversation.user1Id

      if (otherUserId) {
        io.to(`user-${otherUserId}`).emit('message-notification', {
          conversationId,
          message,
          sender: message.sender
        })
      }
    }

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
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 50
  const offset = (page - 1) * limit

  try {
    // Vérifier que l'utilisateur fait partie de cette conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: convId }
    })

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: convId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // Compter le nombre total de messages
    const totalMessages = await prisma.message.count({
      where: { conversationId: convId }
    })

    res.status(200).json({
      messages: messages.reverse(), // Inverser pour avoir l'ordre chronologique
      pagination: {
        page,
        limit,
        total: totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        hasNext: offset + limit < totalMessages,
        hasPrev: page > 1
      }
    })
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
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
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
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { Conversation: true }
    })

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    await prisma.message.delete({
      where: {
        id: messageId
      }
    })

    // Émettre l'événement de suppression via Socket.io
    const io = req.app.get('io')
    if (io) {
      io.to(`conversation-${message.conversationId}`).emit('message-deleted', {
        messageId,
        conversationId: message.conversationId
      })
    }

    res.status(200).json({ message: 'Message deleted successfully' })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}

// Marquer les messages comme lus
export const markMessagesAsRead = async (req: Request, res: Response) => {
  const { conversationId } = req.params
  const { messageIds } = req.body
  const userId = (req as AuthenticatedRequest).user?.id

  try {
    // Vérifier que l'utilisateur fait partie de cette conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user1Id: userId }, { user2Id: userId }]
      }
    })

    if (!conversation) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Ici vous pourriez implémenter la logique de marquage comme lu
    // Par exemple, créer une table MessageRead ou ajouter un champ readBy

    // Émettre l'événement via Socket.io
    const io = req.app.get('io')
    if (io) {
      io.to(`conversation-${conversationId}`).emit('messages-read', {
        userId,
        messageIds
      })
    }

    res.status(200).json({ message: 'Messages marked as read' })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage })
  }
}
