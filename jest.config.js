module.exports = {
  "testMatch": [
      "**/.tests./**/*.+(ts|tsx)",
      "**/?(*.)+(spec|test).+(ts|tsx)"
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
};
