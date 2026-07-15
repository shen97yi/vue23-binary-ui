# ul-question-ui

一个同时支持 Vue 2 和 Vue 3 的二元UI组件库，专注于提供高质量的问题测试相关组件。

## ✨ 功能特性

- 🌐 同时支持 Vue 2 和 Vue 3
- 📦 基于 `@opentiny/vue` 构建，提供一致的UI体验
- 🎯 专注于问题测试场景的组件开发
- 📝 支持富文本编辑
- 📎 支持文件上传和管理
- 🎨 现代化的设计风格

## 📦 安装

### Vue 3 环境

```bash
npm install ul-question-ui
npm install @opentiny/vue@3
```

### Vue 2 环境

```bash
npm install ul-question-ui
npm install @opentiny/vue@2
# Vue 2 版本低于 2.7 时，需要额外安装
npm install @vue/composition-api
```

## 🚀 快速开始

### Vue 3 示例

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import MyVueUi from 'ul-question-ui/vue3'
import 'ul-question-ui/vue3-style'

const app = createApp(App)
app.use(MyVueUi)
app.mount('#app')
```

### Vue 2 示例

```javascript
import Vue from 'vue'
import App from './App.vue'
import MyVueUi from 'ul-question-ui/vue2' // 或 'ul-question-ui'
import 'ul-question-ui/vue2-style'

Vue.use(MyVueUi)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

## 📋 组件列表

### QuestionType 组件

#### Choice (单选/多选题组件)

**属性**

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| oriQuestion | Object | - | 原始问题数据 |
| mode | Number | 1 | 模式：1-编辑，2-预览，3-学生答题 |
| showAnswer | Boolean | false | 是否显示答案 |
| needRichText | Boolean | true | 是否需要富文本编辑 |

**事件**

| 事件名 | 说明 | 参数 |
|--------|------|------|
| save | 保存问题数据 | questionData |
| cancel | 取消编辑 | - |
| submit | 提交答案 | questionData |

**示例**

```vue
<template>
  <Choice
    :oriQuestion="questionData"
    :mode="mode"
    :showAnswer="showAnswer"
    @save="handleSave"
    @submit="handleSubmit"
  />
</template>

<script>
export default {
  data() {
    return {
      mode: 1, // 1-编辑，2-预览，3-学生答题
      showAnswer: false,
      questionData: {
        type: 1, // 1-单选，2-多选
        title: '问题标题',
        choices: [
          { id: 1, text: '选项A', attachments: [] },
          { id: 2, text: '选项B', attachments: [] }
        ],
        correctAnswer: 'A',
        record: { answer: null }
      }
    }
  },
  methods: {
    handleSave(question) {
      console.log('保存问题:', question)
    },
    handleSubmit(question) {
      console.log('提交答案:', question)
    }
  }
}
</script>
```

## 🔧 开发指南

### 项目结构

```
├── examples/           # 示例项目
│   ├── vue2-demo/     # Vue 2 示例
│   └── vue3-demo/     # Vue 3 示例
├── packages/          # 核心包
│   ├── lib/           # 组件库源码
│   ├── build-v2/      # Vue 2 构建配置
│   └── build-v3/      # Vue 3 构建配置
├── package.json       # 项目配置
└── pnpm-workspace.yaml # Workspace 配置
```

### 开发环境

```bash
# 安装依赖
pnpm install

# 运行 Vue 3 示例
cd examples/vue3-demo
pnpm dev

# 运行 Vue 2 示例
cd examples/vue2-demo
pnpm dev
```

## 🏗️ 构建说明

### 构建组件库

```bash
# 构建 Vue 3 版本
pnpm run build:v3

# 构建 Vue 2 版本
pnpm run build:v2

# 同时构建两个版本
pnpm run build
```

### 构建注意事项

- 构建时需要排除相关（Vue 2、Vue 3）的 package.json
- 删除 pnpm-lock 防止 Vue 2、3 依赖相互影响打包产物

## 📦 包信息

### 主要依赖

- `vue-demi`: ^0.14.10
- `@opentiny/vue`: >=2.25.0 || >=3.25.0
- `js-cookie`: ^3.0.5
- `mediaelement`: ^4.2.16
- `ulearning-obs`: 0.0.54
- `sass`: ^1.94.0

### 导出配置

```javascript
{
  ".": {
    "import": "./dist/vue2/ul-question-ui.es.js",
    "require": "./dist/vue2/ul-question-ui.cjs.js"
  },
  "./vue2": {
    "import": "./dist/vue2/ul-question-ui.es.js",
    "require": "./dist/vue2/ul-question-ui.cjs.js"
  },
  "./vue3": {
    "import": "./dist/vue3/ul-question-ui.es.js",
    "require": "./dist/vue3/ul-question-ui.umd.js"
  },
  "./vue2-style": "./dist/vue2/build-v2.css",
  "./vue3-style": "./dist/vue3/build-v3.css"
}
```

### 使用组件库注意事项

- 确保在 Vue 2 项目中安装了 `@vue/composition-api` 插件（Vue 2 版本低于 2.7 时）
- 在 Vue 3 项目中直接使用 `import { Choice } from 'ul-question-ui/vue3'` 即可
- 目前只试验了vue2版本作用于内部课堂项目（使用webpack4，需要在配置中添加
- transpileDependencies: [
    'quill',
    /@opentiny[\\/]/
  ],）防止编译污染
## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request
