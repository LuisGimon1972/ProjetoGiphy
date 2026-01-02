import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// ✅ IMPORTS CORRETOS DO TYPESCRIPT
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    // ignores: []
  },

  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // ✅ SUPORTE A TYPESCRIPT EM .VUE
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: pluginVue.parser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        ga: 'readonly',
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
        browser: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  {
    rules: {
      'prefer-promise-reject-errors': 'off',
      'no-debugger': import.meta.env.PROD ? 'error' : 'off',
    },
  },

  {
    files: ['src-pwa/custom-service-worker.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  {
    files: ['src/router/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },

  prettierSkipFormatting,
]
