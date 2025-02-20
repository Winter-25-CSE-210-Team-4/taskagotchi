import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    testMatch: ['**/src/**/*.test.ts'],
    verbose: true,
    moduleFileExtensions: ['ts', 'js'],
    rootDir: '.',
    testTimeout: 30000,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    detectOpenHandles: true,
    forceExit: true
  };
  

export default config;