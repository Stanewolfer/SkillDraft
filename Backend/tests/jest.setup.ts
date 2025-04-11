// This file runs before each test file
process.env.NODE_ENV = 'test';

// Set up test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.PORT = '3001';
process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/test_db?schema=public';

// Global setup
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: jest.fn(),
  // info: jest.fn(),
  // error: jest.fn(),
};

// Add global teardown
afterAll(async () => {
  // Cleanup any open handles or connections
  await new Promise((resolve) => setTimeout(resolve, 500));
});
