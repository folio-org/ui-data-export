const path = require('path');

const esModules = ['@folio', 'ky', 'usehooks-ts'].join('|');

module.exports = {
  collectCoverageFrom: ['**/(lib|src)/**/*.{js,jsx}', '!**/node_modules/**', '!**/test/**'],
  coverageDirectory: './artifacts/coverage-jest/',
  coverageReporters: ['lcov'],
  reporters: ['jest-junit', 'default'],
  transform: { '^.+\\.(js|jsx)$': path.join(__dirname, './test/jest/jest-transformer.js') },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: { '^.+\\.(css)$': 'identity-obj-proxy',
    '^.+\\.(svg)$': 'identity-obj-proxy',
    '^.+\\.(css|svg|png)$': 'identity-obj-proxy',
    '@module-federation/error-codes/browser': '@module-federation/error-codes/dist/browser.cjs',
    '@module-federation/error-codes/node': '@module-federation/error-codes/dist/node.cjs' },
  testMatch: ['**/(lib|src)/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [path.join(__dirname, './test/jest/jest.setup.js')],
};
