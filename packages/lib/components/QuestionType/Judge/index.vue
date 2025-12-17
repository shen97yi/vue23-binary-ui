<template>
  <Base class="true-or-false-question" :question="question" :mode="mode">
    <!-- 编辑模式 -->
    <template v-if="mode === 1">
      <div class="correct-answer">
        <span>{{ t("correctAnswer") }}：</span>
        <TinyRadioGroup v-model="correctAnswer">
          <TinyRadio label="true">
            <img src="@/assets/correct.svg" alt="">
          </TinyRadio>
          <TinyRadio label="false">
            <img src="@/assets/error.svg" alt="">
          </TinyRadio>
        </TinyRadioGroup>
      </div>
      <div class="action-buttons">
        <TinyButton type="info" @click="saveQuestion">{{ t("save") }}</TinyButton>
        <TinyButton @click="cancel">{{ t("cancel") }}</TinyButton>
      </div>
    </template>
    <!-- 预览模式 -->
    <template v-else-if="mode === 2">
      <div class="preview-mode">
        <div class="correct-answer-preview">
          <span>{{ t("answer") }}：</span>
          <TinyRadioGroup v-model="correctAnswer" disabled>
            <TinyRadio label="true">
              <img src="@/assets/correct.svg" alt="">
            </TinyRadio>
            <TinyRadio label="false">
              <img src="@/assets/error.svg" alt="">
            </TinyRadio>
          </TinyRadioGroup>
        </div>
      </div>
    </template>
    
    <!-- 答题模式 -->
    <template v-else-if="mode === 3">
      <div class="answer-mode">
        <div class="user-answer">
          <div v-if="!isSubmitted">
            <TinyRadioGroup v-model="userAnswer">
              <TinyRadio label="true">
                <img src="@/assets/correct.svg" alt="">
              </TinyRadio>
              <TinyRadio label="false">
                <img src="@/assets/error.svg" alt="">
              </TinyRadio>
            </TinyRadioGroup>
          </div>
          <div v-else class="submit-result">
            <div class="user-answer-display">
              <span>{{ t("yourAnswer") }}：</span>
              <TinyRadioGroup v-model="userAnswer" disabled>
                <TinyRadio label="true" :class="handleAnswerClass(true)">
                  <img src="@/assets/correct.svg" alt="">
                </TinyRadio>
                <TinyRadio label="false" :class="handleAnswerClass(false)">
                  <img src="@/assets/error.svg" alt="">
                </TinyRadio>
              </TinyRadioGroup>
            </div>
            <div v-if="showAnswer" class="correct-answer-hint">
              <span>{{ t("correctAnswer") }}：</span>
              <TinyRadioGroup v-model="correctAnswer" disabled>
                <TinyRadio label="true" :class="handleCorrectAnswerClass(true)">
                  <img src="@/assets/correct.svg" alt="">
                </TinyRadio>
                <TinyRadio label="false" :class="handleCorrectAnswerClass(false)">
                  <img src="@/assets/error.svg" alt="">
                </TinyRadio>
              </TinyRadioGroup>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Base>
</template>

<script>
import { useT } from "@/locale/index.js";
import { defineComponent, ref, computed, watch } from 'vue-demi';
import { TinyButton, TinyRadio, TinyRadioGroup } from '@opentiny/vue'
import Base from '../Base.vue'
import FileList from '../../FileList/index.vue';
import { getQuestion } from "../../../model/questionFactory.js"
export default defineComponent({
  name: 'JudgeQuestion',
  components: {
    Base,
    TinyRadio,
    TinyRadioGroup,
    TinyButton,
    FileList,
  },
  props: {
    mode: {
      type: Number,
      default: 1 // 1:编辑模式, 2:预览模式, 3:答题模式
    },
    oriQuestion: {
      type: Object,
      default: () => ({})
    },
    showAnswer: {
      type: Boolean,
      default: false
    },
    isSubmitted: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'cancel', 'change'],
  setup(props, { emit }) {
    const t = useT()
    const question = ref({})
    const userAnswer = ref('');

    // 正确答案
    const correctAnswer = ref('');

    // 回答是否正确
    const isCorrect = computed(() => {
      return props.isSubmitted && userAnswer.value === correctAnswer.value;
    });

    // 监听原始题目变化
    watch(() => props.oriQuestion, (newVal) => {
      question.value = getQuestion(newVal);
      if (question.value.correctAnswer && question.value.correctAnswer.length > 0) {
        correctAnswer.value = question.value.correctAnswer[0];
      }
      // 初始化用户答案
      if (props.mode === 3) {
        if (question.value.record?.answer) {
          userAnswer.value = question.value.record.answer;
        } else {
          userAnswer.value = '';
        }
      }
      console.log(question.value, '--------Judge--------');
    }, { immediate: true });

    // 监听模式变化，重置用户答案
    watch(() => props.mode, (newMode) => {
      if (newMode !== 3) {
        userAnswer.value = '';
      } else {
        if (question.value.record?.answer) {
          userAnswer.value = question.value.record.answer;
        } else {
          userAnswer.value = '';
        }
      }
    });
    
    // 监听提交状态变化，更新用户答案
    watch(() => props.isSubmitted, (newVal) => {
      if (newVal && question.value.record?.answer) {
        userAnswer.value = question.value.record.answer;
      }
    });

    // 保存题目
    const saveQuestion = () => {
      if (props.mode !== 1) return;
      
      // 基本验证
      if (!question.value.title || !question.value.title.trim()) {
        console.warn('请输入题目内容');
        return;
      }
      
      if (!correctAnswer.value) {
        console.warn('请选择正确答案');
        return;
      }
      
      // 更新正确答案
      if (!question.value.correctAnswer) {
        question.value.correctAnswer = [];
      }
      question.value.correctAnswer[0] = correctAnswer.value;
      emit('save', question.value);
    };
    
    const cancel = () => {
      emit('cancel');
    };
    // 监听用户答案变化，答题模式下选择答案后直接emit change事件
    watch(userAnswer, (newVal) => {
      if (props.mode === 3 && newVal) {
        // 更新记录
        if (!question.value.record) {
          question.value.record = {}
        }
        question.value.record.answer = newVal
        // emit change事件
        emit('change', question.value)
      }
    })
    // 用户答案的样式类
    const handleAnswerClass = (isTrue) => {
      if (!props.isSubmitted) return '';
      // 用户选择答案与当前传入选项一致
      const isUserChoice = (isTrue ? 'true' : 'false') == userAnswer.value;
      // 正确答案与当前传入选项一致
      const isCorrectChoice = (isTrue ? 'true' : 'false') == correctAnswer.value;
      // 只给用户选的项加样式
      if (isUserChoice) {
        return isCorrectChoice ? 'correct' : 'wrong';
      }
      return '';
    };
    // 正确答案样式
    const handleCorrectAnswerClass = (isTrue) => {
      if (!props.isSubmitted) return '';
      // 正确答案与当前传入选项一致
      const isCorrectChoice = (isTrue ? 'true' : 'false') == correctAnswer.value;
      if (isCorrectChoice) return 'correct';
      return '';
    };
    return {
      t,
      cancel,
      question,
      userAnswer,
      correctAnswer,
      isCorrect,
      saveQuestion,
      handleAnswerClass,
      handleCorrectAnswerClass
    };
  }
});
</script>

<style lang="scss" scoped>
.true-or-false-question {
  margin-bottom: 20px;
}

.title {
  margin-bottom: 15px;
}

.correct-answer {
  margin: 15px 0;
}

.answer-option.selected {
  font-weight: bold;
}

.option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 6px;
  border-radius: 50%;
}

.action-buttons {
  margin-top: 20px;
}

.preview-mode,
.answer-mode {
  .question-content {
    margin: 15px 0;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
}

.correct-answer-preview {
  margin: 12px 0;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
}

.user-answer {
  margin-top: 15px;
}

.submit-result {
  margin-top: 15px;
  border-radius: 4px;
}

.user-answer-display,
.correct-answer-hint {
  margin-bottom: 8px;
}

.correct {
  color: #4caf50 !important;
  :deep(.tiny-radio__inner) {
    border-color: #69d184 !important;
    &:after {
      background-color: #69d184 !important;
    }
  }
}

.wrong {
  color: #f44336 !important;
  :deep(.tiny-radio__inner) {
    border-color: #f60000 !important;
    &:after {
      background-color: #f60000 !important;
    }
  }
}
</style>
