import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Liste des routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/api/auth/register', '/api/auth/login', '/auth/fast-login'];

  // Si la route est publique, on passe directement à la suite
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Recherche du token dans l'en-tête Authorization
  const token = req.headers['authorization']?.split(' ')[1];
  
  // Si le token n'est pas présent, on renvoie une erreur 401 (Non autorisé)
  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  // Vérification du token
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      // Si une erreur survient (par exemple, token expiré ou invalid), on renvoie une erreur 403
      return res.status(403).json({ message: 'Token is not valid or expired' });
    }

    // Ajout de l'utilisateur au request pour que les routes suivantes puissent l'utiliser
    req.user = user;

    // Passer à la prochaine fonction de middleware ou route
    next();
  });
};

export default authenticateToken;
