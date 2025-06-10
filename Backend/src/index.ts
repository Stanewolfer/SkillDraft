import router from './routes'
import path from 'path'
import { loggerMiddleware } from './middleware/logger.middleware'
import { initializeSocket } from './config/socket'
import { createServer } from 'http'

const express = require('express')
const cors = require('cors')

const app = express()

// Créer un serveur HTTP
const server = createServer(app)

// Initialiser Socket.io
const io = initializeSocket(server)

// Active CORS pour toutes les origines
app.use(cors())

// Journalisation des requêtes HTTP
app.use(loggerMiddleware)

app.use(express.json())

// Rendre l'instance Socket.io accessible dans les routes
app.set('io', io)

app.use('/api', router)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Utiliser le serveur HTTP au lieu d'express directement
server.listen(5000, () => {
    console.log('Serveur HTTP sur http://localhost:5000');
    console.log('Serveur WebSocket ouvert');
});

export { io }
