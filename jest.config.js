/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    watchPathIgnorePatterns: ['<rootDir>/.postgres'],
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
    globalSetup: '<rootDir>/jest.global-setup.js',
}

export default config
