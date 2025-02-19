import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testMatch: ['**/*.test.ts'],
  verbose: true,
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.'
};

export default config;