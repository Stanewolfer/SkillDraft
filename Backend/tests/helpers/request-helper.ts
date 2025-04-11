import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

type Role = 'user' | 'admin' | 'company' | 'school';
type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface RequestOptions {
  headers?: Record<string, string>;
}

/**
 * Creates an authenticated request object with the specified role
 * @param role - The role to use for authentication
 * @returns An object with methods for making authenticated requests
 */
export const authenticatedRequest = (role: Role = 'user') => {
  // Create a mock user with the specified role
  const user = {
    id: '12345',
    email: 'test@example.com',
    role,
  };

  // Create a JWT token
  const token = jwt.sign(user, process.env.JWT_SECRET || 'test-jwt-secret', {
    expiresIn: '1h',
  });

  // Return a configured supertest instance with auth header
  return {
    get: (url: string, options?: RequestOptions) =>
      request(app)
        .get(url)
        .set('Authorization', `Bearer ${token}`)
        .set(options?.headers || {}),
    post: (url: string, body?: any, options?: RequestOptions) =>
      request(app)
        .post(url)
        .set('Authorization', `Bearer ${token}`)
        .set(options?.headers || {})
        .send(body),
    put: (url: string, body?: any, options?: RequestOptions) =>
      request(app)
        .put(url)
        .set('Authorization', `Bearer ${token}`)
        .set(options?.headers || {})
        .send(body),
    delete: (url: string, options?: RequestOptions) =>
      request(app)
        .delete(url)
        .set('Authorization', `Bearer ${token}`)
        .set(options?.headers || {}),
  };
};

/**
 * Object with methods for making anonymous requests
 */
export const anonymousRequest = {
  get: (url: string, options?: RequestOptions) =>
    request(app)
      .get(url)
      .set(options?.headers || {}),
  post: (url: string, body?: any, options?: RequestOptions) =>
    request(app)
      .post(url)
      .set(options?.headers || {})
      .send(body),
  put: (url: string, body?: any, options?: RequestOptions) =>
    request(app)
      .put(url)
      .set(options?.headers || {})
      .send(body),
  delete: (url: string, options?: RequestOptions) =>
    request(app)
      .delete(url)
      .set(options?.headers || {}),
};

/**
 * Creates test data in the database
 * @param model - The name of the model
 * @param data - The data to create
 * @returns The created data
 */
export const createTestData = async <T>(
  model: string,
  data: T
): Promise<any> => {
  return await (prisma as any)[model].create({
    data,
  });
};

/**
 * Cleans up test data from the database
 * @param model - The name of the model
 * @param where - The filter to apply when deleting
 * @returns The result of the delete operation
 */
export const cleanupTestData = async <T>(
  model: string,
  where: T
): Promise<any> => {
  return await (prisma as any)[model].deleteMany({
    where,
  });
};
