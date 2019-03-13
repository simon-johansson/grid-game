module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "testPathIgnorePatterns": ["/node_modules/", "testUtils.ts", "/dist/", "/.tmp/"],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "moduleNameMapper": {
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@application/(.*)': '<rootDir>/src/application/$1',
  },
  "collectCoverage": false,
  "coverageDirectory": "coverage/",
  "collectCoverageFrom": [
    "<rootDir>/src/**/*.{ts}",
  ]
}
