import router from './routes'
import path from 'path'
import { Request, Response } from 'express'
import { loggerMiddleware } from './middleware/logger.middleware'
import { initializeSocket } from './config/socket'
import { createServer } from 'http'
import { generateAndStoreFeed } from './controllers/feed.controller'
import { prisma } from './config' // Added prisma import for direct use

const express = require('express')
const cors = require('cors')

const app = express()

const server = createServer(app)

const io = initializeSocket(server)

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(loggerMiddleware)

app.use(express.json())

app.set('io', io)

app.use('/api', router)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

server.listen(5000, () => {
  console.log('Serveur HTTP sur http://localhost:5000')
  console.log('Serveur WebSocket ouvert')
  initiateFeedGeneration()
})

setInterval(async () => {
  await initiateFeedGeneration()
}, 60000)

async function initiateFeedGeneration() {
  console.log("Génération du fil d'actualité initiée.")
  try {
    const users = await prisma.user.findMany({
      select: { id: true }
    })

    console.log(
      `Déclenchement de la génération du fil d'actualité pour ${users.length} utilisateurs...`
    )
    for (const user of users) {
      await generateAndStoreFeed(user.id)
    }
    console.log(
      "Génération du fil d'actualité terminée pour tous les utilisateurs."
    )
  } catch (error) {
    console.error(
      "Erreur lors du déclenchement de la génération du fil d'actualité pour tous les utilisateurs:",
      error
    )
  }
}

export { io }
