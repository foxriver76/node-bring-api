module.exports = {
    root: true, // Don't look outside this project for inherited configs
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        project: './tsconfig.json'
    },
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended'
    ],
    plugins: [],
    rules: {
        indent: 'off',
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true
            }
        ],
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-use-before-define': [
            'error',
            {
                functions: false,
                typedefs: false,
                classes: false
            }
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                ignoreRestSiblings: true,
                argsIgnorePattern: '^_'
            }
        ],
        '@typescript-eslint/explicit-function-return-type': [
            'warn',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true
            }
        ],
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off', // This is necessary for Map.has()/get()!
        'no-var': 'error',
        'prefer-const': 'error',
        'no-trailing-spaces': 'error',
        curly: 'error',
        'brace-style': 'error',
        'arrow-parens': ['error', 'as-needed'],
        'no-console': 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'all' }],
        'no-useless-escape': 'warn',
        'no-constant-condition': 'off',
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
        'no-throw-literal': 'error',
        'prefer-promise-reject-errors': 'error',
        //"require-await": "error",
        'no-return-await': 'error',
        eqeqeq: ['error', 'always'],
        semi: ['error', 'always'],
        'comma-dangle': [
            'error',
            {
                arrays: 'never',
                objects: 'never',
                imports: 'never',
                exports: 'never',
                functions: 'ignore'
            }
        ]
    },
    overrides: [
        {
            files: ['*.test.ts'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off'
            }
        },
        {
            files: ['**/*.js'],
            parser: 'espree'
        }
    ]
};
