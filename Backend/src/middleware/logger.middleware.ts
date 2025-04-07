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

return [
    `-------------------------------\n`,
    `| Timestamp : ${tokens['timestamp'](req, res)} \n`,
    `| Method : ${color}${tokens.method(req, res)}\x1b[0m \n`,
    `| URL : \x1b[36m${tokens.url(req, res)}\x1b[0m \n`,
    `| Status : ${color}${status}\x1b[0m \n`,
    `| Response Length : ${tokens.res(req, res, 'content-length')} \n`,
    `| Response Content : ${res.responseContent || '-'} \n`,
    `| Response Time : ${tokens['response-time'](req, res)} ms \n`,
    `| Body Provided : ${tokens.body(req, res)} \n`,
    `-------------------------------\n`
]
    .filter(Boolean)
    .join('')
}

export const loggerMiddleware = morgan(morganFormat)
