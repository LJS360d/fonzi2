import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: "test",
    fileParallelism: true,
    watch: false,
    testTimeout: 0,
  },
})