import { defineConfig } from 'vite'
import vue3 from '@vitejs/plugin-vue'
import { resolve } from 'path'
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '../lib'), // 确保指向正确的源码目录
    }
  },
  plugins: [
    vue3()
  ],
  build: {
    outDir: '../../dist/vue3',
    lib: {
      entry: resolve(__dirname, '../../packages/lib/index.js'),
      name: 'MyVueUi',
      fileName: fmt => `ul-question-test-ui.${fmt}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        // '@opentiny/vue',
        // /^@opentiny\/vue/,   // 整个 @opentiny/vue 家族全部 external
        // /^@opentiny\/vue-icon/
      ],
      output: { 
        globals: { 
          vue: 'Vue', 
          '@opentiny/vue': 'Tiny', 
        }
      }
    }
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       // 全局注入 SCSS 变量/混入（分号分隔多个文件）
  //       additionalData: `
  //         @use "@/styles/variables.scss" as *;
  //         @use "@/styles/mixin.scss" as *;
  //       `,
  //     },
  //   },
  // },
})