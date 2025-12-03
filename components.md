# 组件使用指南

本文档详细介绍了 `ul-question-test-ui` 组件库中各个组件的使用方法、属性、事件和示例。

## 📋 组件列表

- [QuestionType 组件](#questiontype-组件)
  - [Choice (单选/多选题组件)](#choice-单选多选题组件)
  - [Base (基础问题组件)](#base-基础问题组件)

## QuestionType 组件

### Choice (单选/多选题组件)

用于创建和展示单选题或多选题，支持编辑、预览和学生答题三种模式。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| oriQuestion | Object | - | 原始问题数据 |
| mode | Number | 1 | 模式：1-编辑，2-预览，3-学生答题 |
| showAnswer | Boolean | false | 是否显示答案 |
| needRichText | Boolean | true | 是否需要富文本编辑 |

#### oriQuestion 数据结构

```javascript
{
  type: 1, // 1-单选，2-多选
  title: '问题标题', // 问题标题
  content: '问题内容', // 问题内容
  choices: [ // 选项列表
    {
      id: 1, // 选项ID
      text: '选项A', // 选项文本
      attachments: [] // 选项附件
    },
    {
      id: 2,
      text: '选项B',
      attachments: []
    }
  ],
  correctAnswer: 'A', // 正确答案（单选：字符串，多选：数组或逗号分隔字符串）
  record: { // 答题记录
    answer: null // 用户答案
  }
}
```

#### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| save | 保存问题数据 | questionData |
| cancel | 取消编辑 | - |
| submit | 提交答案 | questionData |

#### 使用示例

##### 编辑模式

```vue
<template>
  <Choice
    :oriQuestion="questionData"
    :mode="1"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script>
export default {
  data() {
    return {
      questionData: {
        type: 1,
        title: '这是一道单选题',
        choices: [
          { id: 1, text: '选项A', attachments: [] },
          { id: 2, text: '选项B', attachments: [] },
          { id: 3, text: '选项C', attachments: [] },
          { id: 4, text: '选项D', attachments: [] }
        ],
        correctAnswer: 'A'
      }
    }
  },
  methods: {
    handleSave(question) {
      console.log('保存的问题数据:', question)
    },
    handleCancel() {
      console.log('取消编辑')
    }
  }
}
</script>
```

##### 预览模式

```vue
<template>
  <Choice
    :oriQuestion="questionData"
    :mode="2"
    :showAnswer="true"
  />
</template>

<script>
export default {
  data() {
    return {
      questionData: {
        type: 2,
        title: '这是一道多选题',
        choices: [
          { id: 1, text: '选项A', attachments: [] },
          { id: 2, text: '选项B', attachments: [] },
          { id: 3, text: '选项C', attachments: [] }
        ],
        correctAnswer: ['A', 'C']
      }
    }
  }
}
</script>
```

##### 答题模式

```vue
<template>
  <div>
    <Choice
      :oriQuestion="questionData"
      :mode="3"
      :showAnswer="isSubmitted"
      @submit="handleSubmit"
    />
    <div v-if="isSubmitted">
      <h3>答题结果</h3>
      <p>你的答案：{{ formatAnswer(questionData.record.answer) }}</p>
      <p>正确答案：{{ formatAnswer(questionData.correctAnswer) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSubmitted: false,
      questionData: {
        type: 1,
        title: '这是一道测试题',
        choices: [
          { id: 1, text: '正确选项', attachments: [] },
          { id: 2, text: '错误选项1', attachments: [] },
          { id: 3, text: '错误选项2', attachments: [] }
        ],
        correctAnswer: 'A',
        record: { answer: null }
      }
    }
  },
  methods: {
    handleSubmit(question) {
      this.isSubmitted = true
      this.questionData = question
      console.log('提交的答案:', question.record.answer)
    },
    formatAnswer(answer) {
      if (!answer) return '-' 
      return Array.isArray(answer) ? answer.join(',') : answer
    }
  }
}
</script>
```

### Base (基础问题组件)

所有问题类型的基础组件，提供标题编辑、文件上传等基础功能。

#### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| question | Object | - | 问题数据 |
| mode | Number | 1 | 模式：1-编辑，2-预览，3-学生答题 |
| showAnswer | Boolean | false | 是否显示答案 |
| isQuestionBank | Boolean | false | 是否是题库模式 |

#### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| addTitleFile | 添加标题文件 | file |
| deleteTitleFile | 删除标题文件 | index |
| formatAnswer | 格式化答案 | answer |

#### 使用示例

```vue
<template>
  <Base
    :question="questionData"
    :mode="mode"
    @addTitleFile="handleAddTitleFile"
    @deleteTitleFile="handleDeleteTitleFile"
  />
</template>

<script>
export default {
  data() {
    return {
      mode: 1,
      questionData: {
        title: '问题标题',
        content: '问题内容',
        files: []
      }
    }
  },
  methods: {
    handleAddTitleFile(file) {
      console.log('添加标题文件:', file)
      this.questionData.files.push(file)
    },
    handleDeleteTitleFile(index) {
      console.log('删除标题文件，索引:', index)
      this.questionData.files.splice(index, 1)
    }
  }
}
</script>
```

## 🎨 样式定制

组件库提供了默认样式，你可以通过覆盖 CSS 类来自定义样式。

### 主要 CSS 类

- `.choice-container`: 选择题容器
- `.edit-mode`: 编辑模式样式
- `.preview-mode`: 预览模式样式
- `.answer-mode`: 答题模式样式
- `.choice-item`: 选项项
- `.correct`: 正确答案样式
- `.wrong`: 错误答案样式
- `.missed`: 未选正确答案样式

### 定制示例

```css
/* 自定义选择题容器 */
.choice-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 自定义选项样式 */
.choice-item {
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.choice-item:hover {
  background-color: #f5f5f5;
}

/* 自定义正确答案样式 */
.choice-item.correct {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

/* 自定义错误答案样式 */
.choice-item.wrong {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}
```

## 🔧 常见问题

### 1. 如何切换单选/多选题？

修改 `oriQuestion.type` 的值，1 为单选题，2 为多选题。

```javascript
// 切换为单选题
questionData.type = 1

// 切换为多选题  
questionData.type = 2
```

### 2. 如何设置正确答案？

- 单选题：设置 `correctAnswer` 为单个选项字母（如 'A'、'B'）
- 多选题：设置 `correctAnswer` 为选项字母数组（如 ['A', 'C']）或逗号分隔字符串（如 'A,C'）

```javascript
// 单选题正确答案
questionData.correctAnswer = 'A'

// 多选题正确答案
questionData.correctAnswer = ['A', 'C']
// 或
questionData.correctAnswer = 'A,C'
```

### 3. 如何获取学生的答题结果？

在答题模式下，监听 `submit` 事件，获取提交的问题数据，其中包含学生的答案。

```javascript
methods: {
  handleSubmit(question) {
    console.log('学生答案:', question.record.answer)
    console.log('正确答案:', question.correctAnswer)
  }
}
```

### 4. 如何自定义富文本编辑器？

组件使用了 `RichTextarea` 组件作为富文本编辑器，你可以通过传递属性来自定义它的行为。

### 5. 如何添加附件？

在编辑模式下，点击富文本编辑器中的附件图标，选择文件即可添加附件。

## 📝 更新日志

### v1.0.0
- 初始版本
- 支持 Choice 组件（单选/多选题）
- 支持 Base 组件（基础问题组件）

### v1.0.6
- 优化预览模式下的标题显示
- 修复答题模式下答案绑定问题
- 清理未使用的代码和样式
