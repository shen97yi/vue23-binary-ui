<template>
  <div class="base-container">
    <!-- 编辑模式使用富文本编辑器，预览模式使用div显示 -->
    <template v-if="mode == 2 || mode == 3">
      <!-- 填空题特殊处理：将（ ）替换为输入框 -->
      <div v-if="question.type == 3" class="completion-preview">
        <div v-if="mode == 2" class="preview-title">
          <!-- 遍历标题部分，分别渲染文本和输入框 -->
          <template v-for="(part, index) in titleParts">
            <!-- 文本部分 -->
            <span v-if="part.type === 'text'" v-html="part.content"></span>
            <!-- 空白部分替换为输入框 -->
            <div v-else>
              <span class="blank-index">[{{ blankIndex(index) + 1 }}]</span>
              <input 
                type="text"
                class="completion-input"
                :disabled="true"
                @input="editWidth"
                v-model="userAnswers[blankIndex(index)]"
                :class="{
                  'answer-correct': mode === 3 && isSubmitted && checkAnswerCorrect(index),
                  'answer-error': mode === 3 && isSubmitted && !checkAnswerCorrect(index)
                }"
                style="margin: 0 2px;"
              />
            </div>
          </template>
        </div>
        <div v-if="mode == 3" class="preview-title">
          <template v-for="(part, index) in titleParts">
            <!-- 文本部分 -->
            <span v-if="part.type === 'text'" v-html="part.content"></span>
            <!-- 空白部分替换为输入框 -->
            <div v-else>
              <span class="blank-index">[{{ blankIndex(index) + 1 }}]</span>
              <input 
                type="text"
                class="completion-input"
                :disabled="mode == 3 && isSubmitted"
                @input="editWidth"
                v-model="userAnswers[blankIndex(index)]"
                :class="{
                  'answer-correct': mode === 3 && isSubmitted && checkAnswerCorrect(index),
                  'answer-error': mode === 3 && isSubmitted && !checkAnswerCorrect(index)
                }"
                style="margin: 0 2px;"
              />
            </div>
            
          </template>
        </div>
        <div v-if="question.allowExchange" class="can-exchange">*{{ t('answerCanChangeTip') }}</div>
      </div>
      <!-- 其他题型正常显示 -->
      <div v-else class="preview-title" v-html="question.title || ''"></div>
      <FileList mode="view" type="block" :isPreview="true" :list="question.link" @deleteFile=""></FileList>
    </template>
    <RichTextarea
      ref="richTextareaRef"
      v-else
      v-model="question.title"
      :placeholderText="t('inputQuestionTitle')"
      :list="question.link"
      :maxNum="5"
      :is-question-bank="isQuestionBank"
      :type="question.type"
      @addFile="addTitleFile"
      @deleteFile="deleteTitleFile"
    ></RichTextarea>
    <TinyButton class="insert-blank" v-if="question.type == 3 && mode == 1" @click="insert">
      {{ t("insertQue") }}
    </TinyButton>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch, nextTick } from 'vue-demi'
import { TinyButton } from '@opentiny/vue'
import RichTextarea from '../RichTextarea/index.vue'
import FileList from '../FileList/index.vue'
import { changeInputWidth, getUniqueValue } from "@/utils"
import { useT } from "../../locale/index.js"
export default defineComponent({
  name: 'Base',
  components: {
    RichTextarea,
    FileList,
    TinyButton
  },
  props: {
    question: {
      type: Object,
      required: true,
      default: () => {}
    },
    mode: {
      type: Number,
      default: 0
    },
    isQuestionBank: {
      type: Boolean,
      default: false
    },
    isSubmitted: {
      type: Boolean,
      default: false
    }
  },
  emits: ['blankAnswerChange'],
  setup(props, { emit }) {
    const t = useT()    
    const richTextareaRef = ref(null)
    const userAnswers = ref([])
    // 计算填空题中（ ）的数量
    // 将标题分割为文本部分和空白部分的数组
    const titleParts = computed(() => {
      if (props.question.type !== 3 || !props.question.title) {
        return [{ type: 'text', content: props.question.title || '' }]
      }
      // 使用正则表达式将标题分割为文本和空白占位符
      const reg = /\(&nbsp;\)/g
      const parts = []
      let lastIndex = 0
      let match
      // 不要直接修改props，创建一个副本进行操作
      let titleContent = props.question.title.replace(/^<p>|<\/p>$/g, '')
      while ((match = reg.exec(titleContent)) !== null) {
        // 添加匹配前的文本
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: titleContent.slice(lastIndex, match.index)
          })
        }
        
        // 添加空白占位符
        parts.push({
          type: 'blank',
          content: match[0]
        })
        
        lastIndex = reg.lastIndex
      }
      // 添加剩余的文本
      if (lastIndex < titleContent.length) {
        parts.push({
          type: 'text',
          content: titleContent.slice(lastIndex)
        })
      }
      return parts
    })
    
    // 计算空白数量
    const blankCount = computed(() => {
      return titleParts.value.filter(part => part.type === 'blank').length
    })
    
    // 初始化question.record
    if (!props.question.record) {
      props.question.record = {}
    }
    
    // 监听标题部分变化，初始化和更新用户答案数组
    watch(titleParts, () => {
      const newBlankCount = titleParts.value.filter(part => part.type === 'blank').length
      if (newBlankCount > userAnswers.value.length) {
        // 如果空白数量增加，添加新的空字符串
        for (let i = userAnswers.value.length; i < newBlankCount; i++) {
          userAnswers.value.push('')
        }
      } else if (newBlankCount < userAnswers.value.length) {
        // 如果空白数量减少，截断数组
        userAnswers.value = userAnswers.value.slice(0, newBlankCount)
      }
      if(props.mode == 3) {
        userAnswers.value = props.question.record.answer
      }
    }, { immediate: true, deep: true })
    watch(() => props.mode, (val) => {
      try {
        if(props.question.type == 3) {
          if(val == 3 && props.question.record?.answer.length > 0) {
            const recordAnswers = props.question.record?.answer
            // 更新userAnswers数组
            if (Array.isArray(recordAnswers)) {
              userAnswers.value = [...recordAnswers]
            }else {
              userAnswers.value = recordAnswers.split(";")
            }
          }else if(val == 2) {
            userAnswers.value = []
          }
        }
      } catch (e) {
        console.error('Failed to parse record answer:', e)
      }
    })
    const blankIndex = (index) => {
      return titleParts.value.slice(0, index).filter(p => p.type === 'blank').length
    }
    const editWidth = (e) => {
      nextTick(() => {
        changeInputWidth(e.target, e.target.value);
      })
    }
    const addTitleFile = (file) => {
      props.question.link.push(file);
    }
    const deleteTitleFile = (index) => {
      props.question.link.splice(index, 1);
    }
    
    // 实现insert方法，通过ref调用RichTextarea组件中的方法
    const insert = () => {
      if (richTextareaRef.value) {
        const contentToInsert = '(&nbsp;)'
        richTextareaRef.value.insertContent(contentToInsert)
      }
    }
    watch(userAnswers, (newVal, oldVal) => {
      emit('blankAnswerChange', newVal)
      // 更新question.record.answer的值
      if (props.question.record) {
        props.question.record.answer = newVal
      }
    }, { deep: true })
    // 检查答案是否正确
    const checkAnswerCorrect = (index) => {
      // 获取当前空白的索引
      const blankIndex = titleParts.value.slice(0, index).filter(p => p.type === 'blank').length
      // 获取用户答案
      const userAnswer = userAnswers.value[blankIndex]?.trim()
      // 如果没有用户答案，直接返回false
      if (!userAnswer) return false
      // 获取正确答案并解析
      let correctAnswers = props.question.correctAnswer || []
      // 如果不允许答案互换，检查当前空白的答案是否正确
      if (!props.question.allowExchange) {
        // 获取当前空白的正确答案
        const currentCorrectAnswer = correctAnswers[blankIndex]?.trim()
        
        // 如果正确答案包含多个选项（用//分隔），检查用户答案是否在其中
        if (currentCorrectAnswer && currentCorrectAnswer.includes('//')) {
          const correctOptions = currentCorrectAnswer.split('//').map(option => option.trim())
          return correctOptions.includes(userAnswer)
        }
        // 否则直接比较
        return currentCorrectAnswer === userAnswer
      } 
      // 如果允许答案互换
      else {
        // 解析所有空的正确答案选项，创建一个包含所有可能正确答案的集合
        const allPossibleCorrectAnswers = new Set()
        // 遍历所有正确答案，提取所有可能的正确答案选项
        correctAnswers.forEach(answer => {
          if (answer?.trim().includes('//')) {
            // 如果答案包含多个选项，分割并添加到集合中
            const options = answer.split('//').map(option => option.trim())
            options.forEach(option => allPossibleCorrectAnswers.add(option))
          } else if (answer?.trim()) {
            // 如果答案是单个选项，直接添加到集合中
            allPossibleCorrectAnswers.add(answer.trim())
          }
        })
        // 检查当前空的用户答案是否在所有可能的正确答案集合中
        return allPossibleCorrectAnswers.has(userAnswer)
      }
    }
    
    return {
      t,
      insert,
      richTextareaRef,
      // 填空题
      titleParts,
      blankCount,
      userAnswers,
      editWidth,
      checkAnswerCorrect,
      blankIndex,
      addTitleFile,
      deleteTitleFile
    }
  }
})
</script>

<style lang="scss" scoped>
.base-container {
  font-size: 16px;
}
.insert-blank {
  margin-top: 12px;
}
.preview-title {
  margin-bottom: 16px;
}
// 填空题预览和答题样式
.completion-preview {
  .preview-title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .blank-index {
      color: #529FFF;
    }
  }
  .can-exchange {
    color: #969696;
    font-size: 12px;
  }
  
  .completion-input {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 2px 6px;
    margin: 0 2px;
    font-size: inherit;
    line-height: inherit;
    width: 80px;
    vertical-align: middle;
    
    &:disabled {
      cursor: default;
    }
    
    &:focus {
      outline: none;
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
    
    &.answer-correct {
      color: #69D184;
    }
    
    &.answer-error {
      color: #F60000;
    }
  }
}
</style>