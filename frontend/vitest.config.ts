import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // 测试环境配置
        environment: 'jsdom', // 或 'happy-dom' 用于DOM测试
        globals: true, // 启用全局API
        coverage: {
            provider: 'istanbul' // 或 'c8'
        }
    }
})