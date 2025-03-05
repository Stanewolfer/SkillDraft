import express from 'express'
import {
  getMessagesBetweenUsers,
  getMessagesForOffer,
  sendMessage
} from '../controllers/messages.controller'

const messagesRouter = express.Router()

messagesRouter.post('/messages', sendMessage)
messagesRouter.get('/messages/offer/:offerPostId', getMessagesForOffer)
messagesRouter.get('/messages/:user1Id/:user2Id', getMessagesBetweenUsers)

export default messagesRouter
