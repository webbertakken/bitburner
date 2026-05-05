import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

// Tests run as plain node TS \u2014 the bitburner runtime (`ns`, `NS`) is not
// available outside the game, so we exclude any module that imports `@ns`
// from the test set and only test the pure helpers.
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/core/**/*.ts', 'src/contracts/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
})
