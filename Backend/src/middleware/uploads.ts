import multer from 'multer'
import path from 'path'
import { Request } from 'express'

// Configuration de Multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const { type } = req.body // Récupère le type (avatar, banner, etc.)

    let uploadPath = 'uploads/' // Dossier de base


    // Définir le chemin en fonction du type
    switch (type) {
      case 'avatar-user':
        uploadPath += 'avatars/user/'
        break
      case 'banner-user':
        uploadPath += 'banners/user/'
        break
      case 'postMedia':
        uploadPath += 'postMedia/'
        break
      default:
        break
    }

    cb(null, uploadPath) // Spécifie le chemin du dossier de destination
  },

  filename: (req: Request, file, cb) => {
    // Utilise l'ID dans req.body pour nommer le fichier
    const { id } = req.body
    const fileExt = path.extname(file.originalname)
    cb(null, `${id}${fileExt}`) // Nom du fichier basé sur l'ID
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5MB
})

export default upload
