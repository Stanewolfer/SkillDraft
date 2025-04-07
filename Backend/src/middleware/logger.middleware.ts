import morgan from 'morgan'
import { Request } from 'express'

// Crée un token pour la date/heure
morgan.token('timestamp', () => {
  return new Date().toISOString()
})
// Crée un token pour afficher le corps de la requête si POST ou PUT
morgan.token('body', (req: Request) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body)
  }
  return ''
})

// Format ultra lisible avec couleurs (via chalk)
const morganFormat = (tokens: any, req: any, res: any): string => {
  const status = res.statusCode
  const color =
    status >= 500
      ? '\x1b[31m' // Red for server errors
      : status >= 400
      ? '\x1b[33m' // Yellow for client errors
      : '\x1b[32m' // Green for success

  // Créer un buffer pour stocker la réponse
  const oldWrite = res.write
  const oldEnd = res.end
  const chunks: Buffer[] = []

  res.write = function (chunk: Buffer) {
    chunks.push(Buffer.from(chunk))
    return oldWrite.apply(res, arguments as any)
  }

  res.end = function (chunk: Buffer) {
    if (chunk) {
      chunks.push(Buffer.from(chunk))
    }
    const responseBody = Buffer.concat(chunks).toString('utf8')
    res.content = responseBody

    return oldEnd.apply(res, arguments as any)
  }

return [
    `-------------------------------\n`,
    `| Timestamp : \x1b[1m${new Date(tokens['timestamp'](req, res)).toLocaleString(
        'fr-FR',
        { timeZone: 'Europe/Paris' }
    )}\x1b[0m \n`,
    `| Method : ${color}${tokens.method(req, res)}\x1b[0m \n`,
    `| URL : \x1b[96m${tokens.url(req, res)}\x1b[0m \n`,
    `| Status : ${color}${status}\x1b[0m \n`,
    `| Response Length : \x1b[33m${tokens.res(req, res, 'content-length')}\x1b[0m \n`,
    `| Response Time : \x1b[35m${tokens['response-time'](req, res)}\x1b[0m ms \n`,
    `| Body Provided : \x1b[1m${tokens.body(req, res)}\x1b[0m \n`,
    `-------------------------------\n`
]
    .filter(Boolean)
    .join('')
}

export const loggerMiddleware = morgan(morganFormat)