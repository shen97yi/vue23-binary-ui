import vue2 from '@vitejs/plugin-vue2'
import { resolve } from 'path'
export default {
  plugins: [vue2()],
  resolve: {
    alias: {
      'my-vue3-ui': resolve(__dirname, '../../packages/lib/index.js'),
      '@': resolve(__dirname, '../../packages/lib') // 确保指向正确的源码目录
    }
  }
}