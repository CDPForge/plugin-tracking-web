module.exports =
{
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "globals": {
        "ts-jest": {
            "useBabelrc": true
        }
    },
    "setupFilesAfterEnv": [
        "<rootDir>/jest.setup.ts"
    ]
};