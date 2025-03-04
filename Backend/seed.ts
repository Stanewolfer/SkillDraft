import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('testpassword', 10);

    const user = await prisma.user.create({
        data: {
            username: 'testuser',
            email: 'test@example.com',
            password: hashedPassword, // Mot de passe hashé
            firstName: 'Test',
            lastName: 'User',
        },
    });

    console.log('Utilisateur créé :', user);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
