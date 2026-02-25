import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'src/api/generated/**']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/api/generated/**'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // ─── Строгая типизация ────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      // Явные return-типы не требуются — полагаемся на вывод TypeScript
      '@typescript-eslint/explicit-function-return-type': 'off',

      // ─── XSS-защита ──────────────────────────────────────
      'no-restricted-properties': [
        'error',
        {
          object: 'document',
          property: 'innerHTML',
          message:
            'innerHTML запрещён — используй React-компоненты для рендеринга.',
        },
        {
          property: 'innerHTML',
          message:
            'innerHTML запрещён — используй React-компоненты для рендеринга.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
          message: 'dangerouslySetInnerHTML запрещён — риск XSS.',
        },
        {
          selector:
            'JSXAttribute[name.name="href"][value.value=/^javascript:/]',
          message: 'javascript: в href запрещён — риск XSS.',
        },
        {
          selector: 'JSXAttribute[name.name="href"][value.value=/^data:/]',
          message: 'data: в href запрещён — риск XSS.',
        },
        {
          selector: 'JSXAttribute[name.name="src"][value.value=/^javascript:/]',
          message: 'javascript: в src запрещён — риск XSS.',
        },
        {
          selector: 'JSXAttribute[name.name="src"][value.value=/^data:/]',
          message: 'data: в src запрещён — риск XSS.',
        },
      ],
    },
  },
])
