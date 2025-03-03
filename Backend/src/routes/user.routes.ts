// src/routes/user.routes.ts

import express from 'express';
import { getUser, registerUser } from '../controllers/user.controller'; // Importation des contrôleurs
import { validateUser } from '../middleware/validation.middleware';
import authenticateToken from '../middleware/auth.middleware';

const router = express.Router();

// Route pour récupérer un utilisateur avec authentification
router.get('/:id', (req, res, next) => {
	getUser(req, res).catch(next);
});

// Route pour enregistrer un utilisateur avec validation des données
router.post('/register', (req, res, next) => {
	registerUser(req, res).catch(next);
});

export default router;
