import { Request } from 'express'

export const uploadFile = (req: Request) => {
  if (!req.file) {
    throw new Error('Aucun fichier fourni')
  }

  // Exemple : retourne juste l'URL de l'image
  const fileUrl = `${req.protocol}://10.57.29.243:5000/uploads/${req.file.filename}`

  return {
    filename: req.file.filename,
    url: fileUrl,
    mimetype: req.file.mimetype,
    size: req.file.size
  }
}
