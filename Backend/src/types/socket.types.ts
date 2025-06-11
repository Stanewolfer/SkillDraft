
export interface SocketUser {
  id: string
  username: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

export interface MessageData {
  id: string
  content: string
  conversationId: string
  senderId: string
  sender: SocketUser
  createdAt: Date
  updatedAt: Date
}

export interface ConversationData {
  id: string
  user1Id: string
  user2Id: string
  teamId?: string
  lastMessageId?: string
  createdAt: Date
  updatedAt: Date
}

export interface TypingData {
  userId: string
  isTyping: boolean
}

export interface MessageNotificationData {
  conversationId: string
  message: MessageData
  sender: SocketUser
}

export interface ServerToClientEvents {
  'new-message': (message: MessageData) => void
  'message-deleted': (data: {
    messageId: string
    conversationId: string
  }) => void
  'message-notification': (data: MessageNotificationData) => void
  'messages-read': (data: { userId: string; messageIds: string[] }) => void
  'user-typing': (data: TypingData) => void
  'conversation-created': (conversation: ConversationData) => void
  error: (error: { message: string }) => void
}

export interface ClientToServerEvents {
  'join-conversations': () => void
  'join-conversation': (conversationId: string) => void
  'leave-conversation': (conversationId: string) => void
  'send-message': (data: { conversationId: string; content: string }) => void
  'mark-messages-read': (data: {
    conversationId: string
    messageIds: string[]
  }) => void
  'typing-start': (conversationId: string) => void
  'typing-stop': (conversationId: string) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId: string
  userType: string
}
