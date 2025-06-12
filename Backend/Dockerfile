# Utilise l'image officielle Node.js
FROM node:18-alpine

# Installe les dépendances système nécessaires
RUN apk add --no-cache openssl

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installe les dépendances
RUN npm ci --only=production=false

# Copie le schéma Prisma en premier
COPY prisma/ ./prisma/

# Génère le client Prisma
RUN npx prisma generate

# Copie le reste du code source (sans node_modules grâce à .dockerignore)
COPY . .

# Expose le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["npm", "run", "dev"]