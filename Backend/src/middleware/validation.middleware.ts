import { Request, Response, NextFunction } from 'express';

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  // Exemple de validation de corps de requête
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }
  next();
};

export { validateUser };
