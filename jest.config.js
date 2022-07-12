module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '@routes/(.*)$': '<rootDir>/src/routers/$1',
    '@services/(.*)$': '<rootDir>/src/services/$1',
    '@models/(.*)$': '<rootDir>/src/models/$1',
  },
};
