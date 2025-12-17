<template>
  <Base ref="baseComponent" class="completion-question" :question="question" :mode="mode" @blankAnswerChange="blankAnswerChange" :isSubmitted="isSubmitted">
  <!-- 编辑模式 -->
  <template v-if="mode === 1">
    <div class="edit-mode">
      <div class="title">
      </div>
      <div class="correct-answer">
        <span class="tip">{{ t('answer') }}：</span><span class="correct-answer-tip">( {{ t('inputAnswerTip2') }} )</span>
        <div v-for="(blank, index) in question.blanks" :key="blank.id || index">
          <div class="answer-item">
            <span class="answer-option">[{{ index + 1 }}]</span>
            <input class="answer-input" :placeholder="t('inputAnswer')" v-model="blank.correctAnswer" type="text"
              @change="answerChange" />
            <div class="btn-delete">
              <img src="@/assets/close.png" alt="" @click="deleteBlank(blank, index)">
            </div>
          </div>
        </div>
        <div class="can-exchange">
          <TinyCheckbox v-model="question.allowExchange" :false-label="0" :true-label="1">答案可互换顺序</TinyCheckbox>
        </div>
        <div class="btn-save">
          <TinyButton type="info" @click="saveQuestion">{{ t("save") }}</TinyButton>
          <TinyButton @click="cancel">{{ t("cancel") }}</TinyButton>
        </div>
      </div>
    </div>
  </template>
  <!-- 预览模式 -->
  <template v-else-if="(mode === 2 || mode === 3) && showAnswer">
    <div class="preview-mode">
      <FileList :list="question.link"></FileList>
      <div class="correct-answer-preview">
        <div :class="{'title': mode === 3}">{{ t('correctAnswer') }}：</div>
        <span class="answer-item" v-for="(blank, index) in question.blanks" :key="blank.id || index">
          <span class="answer-option">[{{ index + 1 }}]</span>
          <span class="answer-value">{{ `${blank.correctAnswer}${index !== question.blanks.length - 1 ? '、' : ''}` || '-' }}</span>
        </span>
      </div>
    </div>
  </template>
  </Base>
</template>

<script>
import { defineComponent, ref, watch } from 'vue-demi';
import { TinyButton, TinyCheckbox } from '@opentiny/vue'
import Base from '../Base.vue'
import FileList from '../../FileList/index.vue';
import { t } from '../../../locale/index.js';
import { getUniqueValue } from "@/utils"
import { getQuestion } from "../../../model/questionFactory.js"

export default defineComponent({
  name: 'Completion',
  components: {
    Base,
    FileList,
    TinyButton,
    TinyCheckbox
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
    isSubmitted: {
      type: Boolean,
      default: false
    },
    showAnswer: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'cancel', 'submit'],
  setup(props, { emit }) {
    const question = ref({})
    const userAnswers = ref([]);

    // 标题内容变化处理
    const handleTitleChange = (newValue) => {
      if (props.mode !== 1) return;
      // 1. 找到新标题中所有占位符的位置
      const reg = /\(&nbsp;\)/g;
      let match;
      const newIndices = [];
      // 防止newIndices不正确 <p>a阿达(&nbsp;)阿松大(&nbsp;)</p>
      let count = 0, tempStr = "<p>"
      while ((match = reg.exec(newValue)) !== null) {
        newIndices.push(match.index - 5 * count - tempStr.length  );
        count ++ 
      }
      // 2. 获取光标位置
      let insertIndex = 0;
      if (baseComponent.value?.richTextareaRef) {
        const selection = baseComponent.value.richTextareaRef.$refs.fluentEditorRef.state.quill?.getSelection?.();
        insertIndex = selection?.index ?? question.value.title?.length ?? 0;
      }
      
      // 3. 确定当前光标位置在第几个(&nbsp;)之后
      let currentBlankPosition = 0;
      for (let i = 0; i < newIndices.length; i++) {
        if (insertIndex > newIndices[i]) {
          currentBlankPosition = i;
        } else {
          break;
        }
      }
      // 4. 获取当前blanks的答案，按顺序排序
      const currentBlanks = [...question.value.blanks || []].sort((a, b) => {
        return (a.orderIndex || 0) - (b.orderIndex || 0);
      });
      const currentAnswers = currentBlanks.map(blank => blank.correctAnswer || '');
      
      // 5. 构建新的blank数组，考虑光标位置
      const newBlanks = [];
      let orderIndex = 0;
      
      // 新占位符数量
      const newCount = newIndices.length;
      // 旧占位符数量
      const oldCount = currentBlanks.length;
      
      // 处理答案映射，考虑光标位置
      const newCorrectAnswers = Array(newCount).fill('');
      
      if (oldCount > 0) {
        // 确定是否插入了新的占位符
        const hasNewBlank = newCount > oldCount;
        
        if (hasNewBlank) {
          // 新增了占位符，根据光标位置调整答案顺序
          for (let i = 0; i < newCount; i++) {
            if (hasNewBlank && i === currentBlankPosition) {
              // 新插入的占位符，答案为空
              newCorrectAnswers[i] = '';
            } else if (i < currentBlankPosition) {
              // 光标位置之前的占位符，使用原有答案
              if (i < currentAnswers.length) {
                newCorrectAnswers[i] = currentAnswers[i];
              }
            } else {
              // 光标位置之后的占位符，使用原有答案的下一个
              const oldIndex = i - 1;
              if (oldIndex < currentAnswers.length) {
                newCorrectAnswers[i] = currentAnswers[oldIndex];
              }
            }
          }
        } else {
          // 减少了占位符，只保留前newCount个答案
          for (let i = 0; i < newCount; i++) {
            newCorrectAnswers[i] = currentAnswers[i];
          }
        }
      }
      
      // 6. 创建新的blank对象
      for (let i = 0; i < newIndices.length; i++) {
        newBlanks.push({
          id: getUniqueValue(),
          blankIndex: newIndices[i],
          orderIndex: orderIndex,
          correctAnswer: newCorrectAnswers[i]
        });
        
        orderIndex++;
      }
      
      // 7. 更新blanks数组
      question.value.blanks = newBlanks;
      
      // 8. 确保userAnswers数组正确
      userAnswers.value = question.value.blanks.map(() => '');
      
      // 9. 更新correctAnswer数组
      answerChange();
    };
    // const handleTitleChange = (newValue) => {
    //   // 获取当前富文本光标位置，用于插入填空题
    //   const richTextareaRef = baseComponent.value?.richTextareaRef;
    //   if (!richTextareaRef) return;
    //   const selection = richTextareaRef.$refs.fluentEditorRef.state.quill?.getSelection?.();
    //   let insertIndex = selection?.index ?? question.value.title?.length ?? 0;
    //   if (props.mode !== 1) return;
    //   // 确保blanks数组存在
    //   if (!question.value.blanks) {
    //     question.value.blanks = [];
    //   }
    //   // 获取所有(&nbsp;)的匹配位置
    //   const reg = /\(&nbsp;\)/g;
    //   let match;
    //   let newIndices = [];
      
    //   while ((match = reg.exec(newValue)) !== null) {
    //     newIndices.push(match.index);
    //   }
    //   // 确定当前光标位置在第几个(&nbsp;)之后
    //   let currentBlankPosition = 0;
    //   for (let i = 0; i < newIndices.length; i++) {
    //     if (insertIndex > newIndices[i]) {
    //       currentBlankPosition = i + 1;
    //     } else {
    //       break;
    //     }
    //   }
    //   // 跟踪需要添加的新blank位置
    //   const blanksToAdd = [];
    //   // 使用titleListener处理空格变化
    //   titleListener(
    //     newValue,
    //     /\(&nbsp;\)/g,
    //     (i, strIndex) => {
    //       console.log(i, strIndex,'sssssssssssssssssssssssss')
    //       if (!question.value.blanks) question.value.blanks = [];
    //       const index = question.value.blanks.findIndex(
    //         (it) => it.blankIndex == strIndex
    //       );
    //       if (index === -1) {
    //         // 创建新空格
    //         const newBlank = {
    //           id: getUniqueValue(),
    //           blankIndex: strIndex,
    //           correctAnswer: ''
    //         };
    //         blanksToAdd.push({ index: i, blank: newBlank });
    //       }
    //     },
    //     (indexs) => {
    //       console.log(indexs, '?????????????????')
    //       if (!question.value.blanks) return;
    //       for (let i = question.value.blanks.length - 1; i >= 0; i--) {
    //         const index = indexs.findIndex(
    //           (it) => question.value.blanks[i].blankIndex == it
    //         );
    //         if (index === -1) {
    //           question.value.blanks.splice(i, 1);
    //           userAnswers.value.splice(i, 1);
    //         }
    //       }
    //     }
    //   );
    //   // 处理新添加的空格
    //   if (blanksToAdd.length > 0) {
    //     // 首先确保现有blanks按blankIndex排序
    //     question.value.blanks.sort((a, b) => a.blankIndex - b.blankIndex);
    //     // 按位置顺序处理新添加的空格（从后往前）
    //     blanksToAdd.sort((a, b) => b.index - a.index);
        
    //     blanksToAdd.forEach((item) => {
    //       // 插入新的空格
    //       question.value.blanks.splice(item.index, 0, item.blank);
    //       userAnswers.value.splice(item.index, 0, '');
    //     });
        
    //     // 重新获取所有(&nbsp;)的匹配位置
    //     const finalIndices = [];
    //     const finalReg = /\(&nbsp;\)/g;
    //     let finalMatch;
    //     while ((finalMatch = finalReg.exec(newValue)) !== null) {
    //       finalIndices.push(finalMatch.index);
    //     }
    //     console.log(finalIndices,'-p---------')
    //   }
    //   console.log(question.value.blanks, '当前光标在第', currentBlankPosition, '个(&nbsp;)之后');
      
    //   // 确保blanks数组始终根据blankIndex排序，保持与(&nbsp;)占位符在标题中的顺序一致
    //   if (question.value.blanks && question.value.blanks.length > 1) {
    //     question.value.blanks.sort((a, b) => {
    //       return a.blankIndex - b.blankIndex;
    //     });
    //   }
    // };
    // 监听标题变化
    watch(() => question.value.title, handleTitleChange);
    // 监听原始题目变化
    watch(() => props.oriQuestion, (newVal) => {
      question.value = getQuestion(newVal);
    }, { immediate: true });
    // 答案变化处理
    const answerChange = () => {
      if (props.mode !== 1) return;
      let correctAnswer = [];
      if (question.value.blanks) {
        for (let i = 0; i < question.value.blanks.length; i++) {
          let blank = question.value.blanks[i];
          correctAnswer.push(blank.correctAnswer || '');
        }
      }

      question.value.correctAnswer = correctAnswer;
    };

    // 保存题目
    const saveQuestion = () => {
      if (props.mode !== 1) return;
      // 执行答案变化处理确保答案同步
      answerChange();
      // 基本验证
      if (!question.value.title || !question.value.blanks || question.value.blanks.length === 0) {
        console.warn('请输入题目内容并添加空格');
        return;
      }
      // 检查是否所有空格都有答案
      let hasEmptyAnswer = false;
      for (let i = 0; i < question.value.blanks.length; i++) {
        if (!question.value.blanks[i].correctAnswer || question.value.blanks[i].correctAnswer.trim() === '') {
          hasEmptyAnswer = true;
          break;
        }
      }
      if (hasEmptyAnswer) {
        console.warn('请为所有空格填写答案');
        return;
      }
      console.log('save-completion', question.value);
      emit('save', question.value);
    };
    // 取消编辑
    const cancel = () => {
      emit('cancel');
    };
    // 答题模式的时候，答案改变的时候改变question.record.answer 并且emit('change')
    const blankAnswerChange = (stuAnswer) => {
      if (props.mode !== 3) return;
      question.value.record.answer = stuAnswer;
      emit('change', question.value);
    }

    const baseComponent = ref(null)
    // 删除空格
    const deleteBlank = (blank, index) => {
      if (props.mode !== 1) return;
      
      // 找到要删除的blank在blanks数组中的位置
      const blankIndex = question.value.blanks.findIndex(b => b.id === blank.id);
      if (blankIndex === -1) return;
      
      // 从blanks数组中移除
      question.value.blanks.splice(blankIndex, 1);
      
      // 更新富文本内容，重新生成正确的HTML
      // 首先获取当前标题内容
      let title = question.value.title;
      
      // 查找所有(&nbsp;)的位置
      const reg = /\(&nbsp;\)/g;
      let match;
      let indices = [];
      while ((match = reg.exec(title)) !== null) {
        indices.push(match.index);
      }
      
      // 如果索引有效，删除对应的占位符
      if (index >= 0 && index < indices.length) {
        const idx = indices[index];
        title = title.substring(0, idx) + title.substring(idx + 8);
        
        // 更新标题内容
        question.value.title = title;
        
        // 手动更新富文本内容
        if (baseComponent.value?.richTextareaRef) {
          baseComponent.value.richTextareaRef.content = title;
        }
        
        // 更新所有剩余blank的blankIndex
        const newReg = /\(&nbsp;\)/g;
        let newMatch;
        let newIndices = [];
        while ((newMatch = newReg.exec(title)) !== null) {
          newIndices.push(newMatch.index);
        }
        
        // 更新blanks数组中每个blank的blankIndex
        question.value.blanks.forEach((b, idx) => {
          if (newIndices[idx] !== undefined) {
            b.blankIndex = newIndices[idx];
          }
        });
      }
      
      // 更新userAnswers数组
      userAnswers.value = question.value.blanks.map(() => '');
      
      // 更新correctAnswer数组
      answerChange();
    };
    
    return {
      t,
      question,
      userAnswers,
      saveQuestion,
      cancel,
      answerChange,
      blankAnswerChange,
      deleteBlank,
      baseComponent
    };
  }
});
</script>

<style lang="scss" scoped>
$height: 44px;
.completion-question {
  .edit-mode {
    .correct-answer {
      margin-top: 12px;
    }
  }
  .preview-mode {
    .correct-answer-preview {
      margin-top: 12px;
      >div {
        font-weight: 600;
      }
    }
    .title {
      color: #17B26A;
    }
    .answer-item {
      display: unset;
      line-height: 1;
    }
  }
}
.title-tip {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 1.2;
  font-weight: normal;
}

.correct-answer-tip {
  margin-left: 6px;
  font-size: 16px;
  line-height: 20px;
}

.answer-item {
  margin-top: 12px;
  line-height: $height;
  font-size: 16px;
  display: flex;
}

.answer-option {
  margin-right: 4px;
}

.answer-input {
  flex: 1;
  height: $height;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  outline: none;
  font-size: 16px;
}

.btn-delete {
  img {
    width: 12px;
    height: 12px;
  }

  line-height: 44px;
  margin-left: 10px;
  cursor: pointer;
}

.can-exchange {
  margin: 12px 0;
  font-size: 16px;
  display: block;
}
</style>
