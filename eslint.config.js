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
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // This project uses the automatic JSX runtime (@vitejs/plugin-react),
      // so `React` is imported for explicit API use (StrictMode, etc.) and
      // should not be reported as unused. Also ignore intentional _-prefixed args.
      'no-unused-vars': ['error', { varsIgnorePattern: '^(React|_)', argsIgnorePattern: '^_' }],
      // Context providers intentionally co-export their hook; harmless for HMR.
      'react-refresh/only-export-components': 'off',
    },
  },
])
