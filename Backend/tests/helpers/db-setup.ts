import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

/**
 * Sets up the test database by resetting it to a clean state and applying migrations
 */
export const setupTestDatabase = async (): Promise<void> => {
  try {
    // Reset database to a clean state
    execSync(
      'npx prisma migrate reset --force --skip-seed --schema=./prisma/schema.prisma'
    );

    // Apply migrations
    execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma');

    console.log('Test database has been set up');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

/**
 * Disconnects from the test database
 */
export const teardownTestDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

/**
 * Clears a specific table in the database
 * @param tableName - The name of the table to clear
 */
export const clearTable = async (tableName: string): Promise<void> => {
  // Dynamic query execution to clear a table
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`);
};

/**
 * Seeds test data into a specific model
 * @param model - The name of the model
 * @param data - The data to seed
 * @returns The result of the createMany operation
 */
export const seedTestData = async <T>(
  model: string,
  data: T[]
): Promise<any> => {
  return await (prisma as any)[model].createMany({
    data,
    skipDuplicates: true,
  });
};
