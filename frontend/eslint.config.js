import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // This config has no eslint-plugin-react, so identifiers used only
      // inside JSX look unused. Capitalised names (components, icons) are
      // ignored for that reason; `motion` is the same case in lower case.
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]|^motion$',
          argsIgnorePattern: '^[A-Z_]|^_',
        },
      ],
    },
  },
])
