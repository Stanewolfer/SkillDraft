import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import path from 'path'

import router from './routes'
import { loggerMiddleware } from './middleware/logger.middleware'

const app = express()
const server = http.createServer(app)

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Middlewares
app.use(cors())
app.use(loggerMiddleware)
app.use(express.json())

// Rend `io` disponible sur l'objet `req`
declare global {
  namespace Express {
    interface Request {
      io: SocketIOServer
    }
  }
}
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes API
app.use('/api', router)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Gestion des connexions WebSocket
io.on('connection', socket => {
  console.log(`⚡️ User connected: ${socket.id}`)

  // Permet à un client de rejoindre une conversation spécifique
  socket.on('join_conversation', (convId: string) => {
    socket.join(convId)
    console.log(`${socket.id} joined conversation room: ${convId}`)
  })

  // Permet à un client de quitter une conversation
  socket.on('leave_conversation', (convId: string) => {
    socket.leave(convId)
    console.log(`${socket.id} left conversation room: ${convId}`)
  })

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`)
  })
})

// Démarrage du serveur
server.listen(5000, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:5000`)
  console.log(`WebSocket server is on`)
})
