/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.svg$': '<rootDir>/fileTransformer.cjs',
    '^.+\\.scss': '<rootDir>/fileTransformer.cjs',
  },
};
