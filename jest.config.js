const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFiles: ['whatwg-fetch'],
  testMatch: [
    "**/?(*.)+(test).js?(x)"
  ],

}

module.exports = createJestConfig(config)