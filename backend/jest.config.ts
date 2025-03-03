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
    forceExit: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
  };
  

export default config;