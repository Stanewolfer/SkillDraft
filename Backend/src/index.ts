import router from './routes'
import path from 'path'
import morgan from 'morgan'

const express = require('express')
const cors = require('cors')

const app = express()

// Active CORS pour toutes les origines
app.use(cors())

// Journalisation des requêtes HTTP
app.use(morgan('dev'))

app.use(express.json())

app.use('/api', router)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.listen(5000, () => console.log('Serveur sur http://localhost:5000'))
app.use(
  (
    req: { method: any; originalUrl: any; params: any; query: any; body: any },
    res: any,
    next: () => void
  ) => {
    console.log('--- Nouvelle Requête ---')
    console.log('Méthode:', req.method)
    console.log('URL:', req.originalUrl)
    console.log('Params:', req.params)
    console.log('Query:', req.query)
    console.log('Body:', req.body)
    console.log('------------------------')
    next()
  }
)
