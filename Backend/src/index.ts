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

