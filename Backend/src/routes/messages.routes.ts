import express from 'express'
import {
    getAllMessages,
  getMessagesBetweenUsers,
  getMessagesForOffer,
  sendMessage
} from '../controllers/messages.controller'

const messagesRouter = express.Router()

messagesRouter.post('/send', sendMessage)
messagesRouter.get('/all-messages', getAllMessages)
messagesRouter.get('/offer-messages/offer/:offerPostId', getMessagesForOffer)
messagesRouter.get('/regular-messages/:user1Id/:user2Id', getMessagesBetweenUsers)

export default messagesRouter
