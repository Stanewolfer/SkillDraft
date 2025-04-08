import { RequestHandler, Router } from 'express'
import { deleteMessage, getMessageById, getMessagesByConvId, sendMessage } from '../controllers/messages.controller'


const messagesRouter = Router()

messagesRouter.post('/send/:userId', sendMessage as RequestHandler)
messagesRouter.get('/get-messages/:convId', getMessagesByConvId as RequestHandler)
messagesRouter.get('/get-message/:messageId', getMessageById as RequestHandler)
messagesRouter.delete('/delete-message/:messageId', deleteMessage as RequestHandler)

export default messagesRouter