import { Request, Response, NextFunction } from 'express';
import upload from '../middleware/uploads';

// Route de téléchargement de fichiers
export const uploadFile = (req: Request, res: Response, next: NextFunction): void => {
  const { type, id } = req.body;
  const file = req.file;

  // Si un fichier est téléchargé
  if (file) {
    console.log('Fichier téléchargé:', file);
    console.log('Type:', type);
    console.log('ID:', id);

    // Envoie une réponse de succès
    res.status(200).json({
      message: 'Fichier téléchargé avec succès',
      file: file,
    });
  } else {
    // Si aucun fichier n'est trouvé
    res.status(400).json({ message: 'Aucun fichier trouvé' });
  }
};

// Utilisation du middleware multer dans la route
export const uploadRoute = [
  upload.single('file'),  // Middleware multer pour le téléchargement de fichier
  uploadFile,             // Logique de la route pour traiter le fichier téléchargé
];
