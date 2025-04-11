import { randomUUID } from 'crypto';

type MockFunction = jest.Mock<any, any>;
type MockMethods<T> = {
  [K in keyof T]?: jest.Mock<any, any>;
};

/**
 * Mocks specific methods on a dependency and returns a restore function
 * @param dependency - The dependency to mock
 * @param methods - Object mapping method names to mock implementations
 * @returns A function to restore the original methods
 */
export const mockDependency = <T extends object>(
  dependency: T,
  methods: MockMethods<T>
): (() => void) => {
  const original: Partial<T> = {};

  Object.entries(methods).forEach(([method, mockImplementation]) => {
    original[method as keyof T] = dependency[method as keyof T];
    dependency[method as keyof T] = mockImplementation as any;
  });

  return () => {
    Object.entries(original).forEach(([method, implementation]) => {
      dependency[method as keyof T] = implementation as any;
    });
  };
};

/**
 * Utilities for generating random test data
 */
export const generateTestData = {
  uuid: (): string => randomUUID(),
  email: (): string =>
    `test-${Math.random().toString(36).substring(2, 7)}@example.com`,
  string: (length = 10): string =>
    Math.random()
      .toString(36)
      .substring(2, length + 2),
  number: (min = 1, max = 100): number =>
    Math.floor(Math.random() * (max - min + 1)) + min,
  boolean: (): boolean => Math.random() > 0.5,
  date: (daysAgo = 0): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  },
  array: <T>(generator: () => T, length = 5): T[] => {
    return Array.from({ length }, generator);
  },
};

interface WaitForOptions {
  timeout?: number;
  interval?: number;
}

/**
 * Waits for a condition to be true
 * @param condition - The condition to wait for
 * @param options - Options for the wait operation
 * @returns A promise that resolves when the condition is true
 * @throws Error if the timeout is reached
 */
export const waitFor = async (
  condition: () => boolean | Promise<boolean>,
  options: WaitForOptions = {}
): Promise<void> => {
  const { timeout = 5000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Timeout waiting for condition (${timeout}ms)`);
};
