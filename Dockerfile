# Utilise l'image officielle Node.js
FROM node:18-alpine

# Installe les dépendances système nécessaires (openssl pour Prisma)
RUN apk add --no-cache openssl

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json du dossier Backend
COPY Backend/package*.json ./Backend/

# Installe les dépendances dans Backend
RUN npm ci --prefix ./Backend --only=development=false

# Copie le dossier prisma en premier pour la génération du client Prisma
COPY Backend/prisma ./Backend/prisma

# Migre la base de données
RUN npx prisma migrate deploy --schema=./Backend/prisma/schema.prisma

# Génère le client Prisma
RUN npx prisma generate --schema=./Backend/prisma/schema.prisma

# Copie le reste du code source
COPY Backend ./Backend

# Expose le port de l'application
EXPOSE 3000

# Commande pour démarrer l'application dans Backend
CMD ["npm", "run", "dev", "--prefix", "./Backend"]
