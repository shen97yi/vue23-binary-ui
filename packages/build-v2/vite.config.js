import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '../lib'), // 确保指向正确的源码目录
    }
  },
  plugins: [vue2()],
  build: {
    outDir: '../../dist/vue2',
    lib: {
      formats: ['es', 'cjs'],
      entry: resolve(__dirname, '../../packages/lib/index.js'),
      name: 'MyVueUi',
      fileName: fmt => `ul-question-test-ui.${fmt}.js`
    },
    rollupOptions: {
      external: [
        'vue', 
        '@vue/composition-api',
        /^@opentiny\/vue/,   // 整个 @opentiny/vue 家族全部 external
        // /^@opentiny\/vue/,
        // /^@opentiny\/vue-icon/
      ],
      output: { globals: { 
        vue: 'Vue', 
        '@opentiny/vue': 'Tiny' 
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