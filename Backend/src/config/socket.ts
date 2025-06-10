import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import jwt from 'jsonwebtoken'
import { prisma } from './index'

interface AuthenticatedSocket extends Socket {
  userId?: string
  userType?: string
}

import { Socket } from 'socket.io'

export const initializeSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // À adapter selon vos besoins de sécurité
      methods: ["GET", "POST"]
    }
  })

  // Middleware d'authentification pour Socket.io
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
      socket.userId = decoded.id
      socket.userType = decoded.type
      next()
    } catch (err) {
      next(new Error('Authentication error: Invalid token'))
    }
  })

  // Gestion des connexions
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected with socket ${socket.id}`)

    // Rejoindre les salles de conversation de l'utilisateur
    socket.on('join-conversations', async () => {
      try {
        if (!socket.userId) return

        // Récupérer toutes les conversations de l'utilisateur
        const conversations = await prisma.conversation.findMany({
          where: {
            OR: [
              { user1Id: socket.userId },
              { user2Id: socket.userId }
            ]
          }
        })

        // Rejoindre chaque conversation
        conversations.forEach(conv => {
          socket.join(`conversation-${conv.id}`)
        })

        // Rejoindre une salle personnelle pour les notifications
        socket.join(`user-${socket.userId}`)

        console.log(`User ${socket.userId} joined ${conversations.length} conversations`)
      } catch (error) {
        console.error('Error joining conversations:', error)
        socket.emit('error', { message: 'Failed to join conversations' })
      }
    })

    // Rejoindre une conversation spécifique
    socket.on('join-conversation', async (conversationId: string) => {
      try {
        if (!socket.userId) return

        // Vérifier que l'utilisateur fait partie de cette conversation
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            OR: [
              { user1Id: socket.userId },
              { user2Id: socket.userId }
            ]
          }
        })

        if (conversation) {
          socket.join(`conversation-${conversationId}`)
          console.log(`User ${socket.userId} joined conversation ${conversationId}`)
        } else {
          socket.emit('error', { message: 'Unauthorized to join this conversation' })
        }
      } catch (error) {
        console.error('Error joining conversation:', error)
        socket.emit('error', { message: 'Failed to join conversation' })
      }
    })

    // Quitter une conversation
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation-${conversationId}`)
      console.log(`User ${socket.userId} left conversation ${conversationId}`)
    })

    // Envoyer un message
    socket.on('send-message', async (data: {
      conversationId: string
      content: string
    }) => {
      try {
        if (!socket.userId) return

        const { conversationId, content } = data

        // Vérifier que l'utilisateur fait partie de cette conversation
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            OR: [
              { user1Id: socket.userId },
              { user2Id: socket.userId }
            ]
          }
        })

        if (!conversation) {
          socket.emit('error', { message: 'Unauthorized to send message to this conversation' })
          return
        }

        // Créer le message en base de données
        const message = await prisma.message.create({
          data: {
            content,
            conversationId,
            senderId: socket.userId,
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
          where: { id: conversationId },
          data: {
            updatedAt: new Date(),
            lastMessageid: message.id
          }
        })

        // Envoyer le message à tous les participants de la conversation
        io.to(`conversation-${conversationId}`).emit('new-message', message)

        // Envoyer une notification aux utilisateurs hors ligne
        const otherUserId = conversation.user1Id === socket.userId 
          ? conversation.user2Id 
          : conversation.user1Id

        if (otherUserId) {
          io.to(`user-${otherUserId}`).emit('message-notification', {
            conversationId,
            message,
            sender: message.sender
          })
        }

        console.log(`Message sent in conversation ${conversationId} by user ${socket.userId}`)
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Marquer les messages comme lus
    socket.on('mark-messages-read', async (data: {
      conversationId: string
      messageIds: string[]
    }) => {
      try {
        if (!socket.userId) return

        const { conversationId, messageIds } = data

        // Ici vous pourriez ajouter une logique pour marquer les messages comme lus
        // Par exemple, créer une table MessageRead ou ajouter un champ readBy

        // Notifier les autres participants que les messages ont été lus
        socket.to(`conversation-${conversationId}`).emit('messages-read', {
          userId: socket.userId,
          messageIds
        })

        console.log(`Messages marked as read by user ${socket.userId} in conversation ${conversationId}`)
      } catch (error) {
        console.error('Error marking messages as read:', error)
        socket.emit('error', { message: 'Failed to mark messages as read' })
      }
    })

    // Indicateur de frappe
    socket.on('typing-start', (conversationId: string) => {
      if (!socket.userId) return
      
      socket.to(`conversation-${conversationId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: true
      })
    })

    socket.on('typing-stop', (conversationId: string) => {
      if (!socket.userId) return
      
      socket.to(`conversation-${conversationId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: false
      })
    })

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`)
    })
  })

  return io
}