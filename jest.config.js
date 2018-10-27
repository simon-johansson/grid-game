module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "testPathIgnorePatterns": ["/node_modules/", "testUtils.ts"],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "collectCoverage": false,
  "coverageDirectory": "coverage/",
  "collectCoverageFrom": [
    "<rootDir>/src/Logic/**/*.{ts}",
    "!<rootDir>/src/Logic/boundaries/**/*.{ts}",
  ]
}
