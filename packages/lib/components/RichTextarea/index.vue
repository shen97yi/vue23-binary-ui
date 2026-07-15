<template>
  <div class="ritchtextarea-container" :id="containerId">
    <TinyFluentEditor :class="{ 'mobile': isMobile }" ref="fluentEditorRef" v-model="content" :data-type="false" :data-upgrade="false" :options="options" :before-editor-init="beforeEditorInit" />
    <div v-if="isMobile && isBase" class="mobile-upload-btn">
      <img src="@/assets/mobile/upload-img.svg" alt="" @click="uploadImg"/>
      <img src="@/assets/mobile/upload-file.svg" alt="" @click="uploadFile"/>
      <img src="@/assets/mobile/upload-audio.svg" alt="" @click="drawerVisible = true"/>
      <TinyButton class="insert-blank" v-if="isMobile && isBase && type === 3" @click="insertContent('(&nbsp;)')">
        {{ t("insertQue") }}
      </TinyButton>
    </div>
    <FileList ref="fileList" mode="edit" type="block" :isPreview="true" :list="list"
      :isShowLimitTimes="isShowLimitTimes" :is-question-bank="isQuestionBank" @deleteFile="deleteFile">
    </FileList>
    <button :id="`upload-${containerId}`" style="display: none"></button>
    <TinyDialogBox dialog-class="math-dialog" v-model:visible="boxVisibility" :title="t('informationTitle')" width="60%" 	
    :append-to-body="true" destroy-on-close>
      <iframe :src="iframeUrl" frameborder="0"></iframe>
      <template #footer>
        <TinyButton @click="boxVisibility = false">{{ t('cancel') }}</TinyButton>
        <TinyButton type="primary" @click="mathConfirm">{{ t('confirm') }}</TinyButton>
      </template>
    </TinyDialogBox>
    <TinyDrawer
      v-if="drawerVisible"
      title=""
      placement="bottom"
      show-close
      v-model:visible="drawerVisible"
      height="600px"
    >
      <AudioRecorder
        :obs="obs"
        :actionIndex="actionIndex"
        :insertContent="insertContent"
        :emitAddFile="(file, index) => $emit('addFile', file, index)"
        :onClose="() => drawerVisible = false"
      />
    </TinyDrawer>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onUnmounted, computed, version, reactive } from 'vue-demi'
import { TinyFluentEditor, TinyDialogBox, TinyButton, TinyInput, TinyDrawer } from '@opentiny/vue'
import FileList from "../FileList/index.vue";
import { handlerErrCode, formatTypeLimit } from "../../utils/file.js";
import Obs from "@/plugins/ulearning-obs.js";
import { uploadOptions } from "@/plugins/upload.js";
import Attach from "@/model/attach";
import { getUniqueValue, handleNum, getPlatform } from "@/utils"
import { formatFileType } from '@/utils/file.js'
import { useT } from "../../locale/index.js"
import AudioRecorder from '../AudioRecorder/index.vue'
import Cookies from 'js-cookie'
export default defineComponent({
  name: 'RichTextarea',
  components: {
    TinyFluentEditor,
    FileList,
    TinyDialogBox,
    TinyButton,
    TinyInput,
    TinyDrawer,
    AudioRecorder
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
    modelValue: String,
    list: {
      type: Array,
      default() {
        return []
      }
    },
    maxNum: {
      type: Number,
      default: 1
    },
    isShowLimitTimes: {
      type: Boolean,
      default: true
    },
    actionIndex: {
      type: Number,
      default: 0
    },
    placeholderText: {
      type: String,
      default: "",
    },
    isQuestionBank: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 0,
    },
    isBase: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['change', 'addFile', 'deleteFile', 'update:modelValue'],
  setup(props, { emit }) {
    const drawerVisible = ref(false)
    const isMobile = getPlatform().isMobile

    const handleHtmlInput = (e) => {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(e.target)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      const caretOffset = preCaretRange.toString().length
      content.value = e.target.innerHTML
      setTimeout(() => {
        const newRange = document.createRange()
        const newSelection = window.getSelection()
        let charCount = 0
        let found = false
        function traverseNodes(node) {
          if (found) return
          if (node.nodeType === Node.TEXT_NODE) {
            const nextCount = charCount + node.length
            if (caretOffset <= nextCount) {
              newRange.setStart(node, caretOffset - charCount)
              newRange.setEnd(node, caretOffset - charCount)
              found = true
            } else {
              charCount = nextCount
            }
          } else {
            for (let i = 0; i < node.childNodes.length; i++) {
              traverseNodes(node.childNodes[i])
              if (found) return
            }
          }
        }
        traverseNodes(e.target)
        if (!found) {
          newRange.selectNodeContents(e.target)
          newRange.collapse(false)
        }
        newSelection.removeAllRanges()
        newSelection.addRange(newRange)
      }, 0)
    }
    const t = useT()
    const obs = ref(null)
    const content = ref(props.modelValue || props.value || '')
    const fluentEditorRef = ref(null)
    const containerId = ref(getUniqueValue())
    const boxVisibility = ref(false)
    const iframeUrl = computed(() => {
      return "formula/index.html"
    })
    const uploadBtn = ref(null)
    const uploadImg = () => {
      // 重置上传处理
      obs.value.onBeforeUpload = defaultBeforeUpload
      obs.value.$el.accept = formatTypeLimit(["image"]);
      uploadBtn.value.click();
    }
    const uploadFile = () => {
      // 重置上传处理
      obs.value.onBeforeUpload = defaultBeforeUpload
      obs.value.$el.accept = formatTypeLimit(["file"]);
      uploadBtn.value.click();
    }
    const uploadVideo = () => {
      // 重置上传处理
      obs.value.onBeforeUpload = defaultBeforeUpload
      obs.value.$el.accept = formatTypeLimit(["video"]);
      uploadBtn.value.click();
    }
    const uploadAudio = () => {
      obs.value.$el.accept = formatTypeLimit(["audio"]);
      uploadBtn.value.click();
    }

    // 默认上传处理
    const defaultBeforeUpload = (file) => {
      // if (checkAddFile && !checkAddFile(file)) {
      //   return 
      // }
      let myFile = reactive(new Attach({
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.name,
        status: 1,
        lisCount: -1
      }))
      let fileType = formatFileType(myFile.fileUrl);
      
        console.log('fileType', fileType)
      file.onProgress = (progress) => {
        myFile.progress = handleNum(progress, 2, "floor")
      }
      file.onSuccess = () => {
        myFile.fileUrl = file.obsHost + '/' + file.key
        myFile.status = 2
        console.log('onSuccess----fileType', fileType)
        if (fileType == 'image') {
          insertContent(`<img src="${myFile.fileUrl}" devui-editorx-image="true"data-image-id=${myFile.key} />`)
        }
      }
      file.onError = (err) => {
        myFile.errMessage = handlerErrCode(err.code)
        myFile.status = 3
      }
      myFile.cancel = () => {
        obs.value.cancelUpload(file)
      }
      // 避免上传相同文件时key值重复
      myFile.key = getUniqueValue();
      if (fileType != 'image') {
        emit('addFile', myFile, props.actionIndex)
      }
    }

    onMounted(async () => {
      // 创建隐藏的上传按钮
      obs.value = new Obs({ ...uploadOptions });
      uploadBtn.value = document.getElementById(`upload-${containerId.value}`);
      obs.value.initUpBtn(uploadBtn);
      obs.value.onBeforeUpload = defaultBeforeUpload
      if(isMobile) return 
      // 初始化编辑器内容
      const fluentEditor = fluentEditorRef.value?.state.quill
      if (!fluentEditor) return
      setTimeout(() => {
        const toolbar = fluentEditor.getModule('toolbar')
        const sizeSelect = toolbar?.container?.querySelector?.('select.ql-size')

        if (sizeSelect && sizeSelect.value !== '16px') {
          sizeSelect.value = '16px'
          sizeSelect.dispatchEvent(new Event('change'))
          fluentEditor.root?.blur?.()
          return
        }

        const selection = fluentEditor.getSelection()
        const index = selection?.index ?? 0
        const format = fluentEditor.getFormat(index, 0)
        if (!format?.size) {
          fluentEditor.setSelection(index, 0, 'api')
          fluentEditor.format('size', '16px', 'api')
          fluentEditor.root?.blur?.()
        }
      }, 0)
      const toolbar = fluentEditor.getModule('toolbar')
      // 每次最多上传个文件检测
      // const checkAddFile = (file) => {
      //   if (props.attachments.length >= maxNum.value) {
      //     Message({
      //       message: t('codeUploadTip2', { num: maxNum.value }),
      //       type: "warning"
      //     })
      //     return false
      //   }
      //   return true
      // }
      
      toolbar.addHandler('image1',  (value) => {
        uploadImg()
      });
      toolbar.addHandler('video1',  (value) => {
        uploadVideo()
      })
      toolbar.addHandler('audio',  (value) => {
        uploadAudio()
        // let jsx = `<img src="https://tobs.ulearning.cn/resources/web/17548922973825322.png" devui-editorx-image="true" data-image-id=${getUniqueValue()} />`
        // jsx = `&nbsp;<span class="q-space" contenteditable="false" data-index="${getUniqueValue()}">(&nbsp;)</span>&nbsp;`
        // console.log(fluentEditor,'fluentEditoraudio')
        // insertContent(jsx)
      })
      toolbar.addHandler('math', function (value) {
        boxVisibility.value = true
      })
    })
    onUnmounted(() => {
      if (obs.value?.$el && obs.value.$el.parentNode) {
        obs.value.$el.parentNode.removeChild(obs.value.$el)
      }
    })
    const mathConfirm = () => {
      const iframe = document.querySelector('.math-dialog iframe')
      const mathContent = iframe.contentWindow.document.getElementById('formulaTextarea')?.value || ''
      const wrappedMath = `\\(${mathContent}\\)`
      insertContent(wrappedMath)
      boxVisibility.value = false
    }
    // 插入内容到编辑器
    const insertContent = (newContent) => {
      if (!fluentEditorRef.value) return
      
      const quill = fluentEditorRef.value.state.quill
      // 获取当前光标位置
      const range = quill.getSelection()
      const index = range ? range.index : 0
      // 插入内容
      quill.clipboard.dangerouslyPasteHTML(index, newContent)
      // 设置光标位置到插入内容之后
      const contentLength = new DOMParser().parseFromString(newContent, 'text/html').body.textContent.length
      quill.setSelection(index + contentLength)
    }
    watch(content, (val, oldVal) => {
      if (props.type == 3) {
        // 填空题需要已经经过渲染的空格转为(&nbsp;)
        const reg = /\s*\(\s*\)\s*/g
        // const reg = /（\s*）|\(\s*\)/g
        val = val.replace(reg, '(&nbsp;)')
      }
      if(version.startsWith('3')){
        emit('update:modelValue', val)
      }else {
        emit('change', val)
      }
    })
    const allFonts = [
      "yahei",
      "songti",
      "kaiti",
      "heiti",
      "lishu",
      "mono",
      "arial",
      "arialblack",
      "comic",
      "impact",
      "times"
    ]
    const chineseFonts = ["yahei", "songti", "kaiti", "heiti", "lishu"]
    const lang = Cookies.get('lang').toLowerCase()
    const fontList = ['zh', 'zh-cn', 'zh-tw'].includes(lang)
      ? allFonts
      : allFonts.filter((font) => !chineseFonts.includes(font))
    const sizeList = [
      "12px",
      "13px",
      "14px",
      "15px",
      "16px",
      "17px",
      "18px",
      "19px",
      "20px",
      "22px",
      "24px",
      "26px",
      "29px",
      "32px",
      "36px",
      "40px",
      "48px",
      "72px"
    ]
    const options = ref({
      placeholder: props.placeholderText,
      modules: {
        // 工具栏
        toolbar: [
          [
            {
              "font": fontList
            },
            {
              "size": sizeList
            },
            {
              "lineheight": [
                "1",
                "1.2",
                "1.5",
                "2",
                "2.5",
                "3",
                "4",
                "5"
              ]
            },
            // {
            //   "header": [
            //     1,
            //     2,
            //     3,
            //     4,
            //     5,
            //     6,
            //     false
            //   ]
            // }
          ],
          ['bold', 'italic', 'underline', 'strike', {
            "color": []
          },
            {
              "background": []
            },
            {
              "list": "ordered"
            },
            {
              "list": "bullet"
            },
            {
              "align": []
            },
            {
              "script": "sub"
            },
            {
              "script": "super"
            },
            "image1",
            'audio', 'video1',
            "math",
            "better-table"
          ]
        ]
      }
    })
    // 简化的字幕上传初始化函数，移除了对Obs的依赖
    const initSrtUploder = (id, myFile) => {
      const element = document.getElementById(id);
      if (element) {
        console.log("字幕上传按钮已找到", element);
        // 这里可以添加简单的点击事件处理
        element.onclick = () => {
          console.warn("字幕上传功能暂时不可用");
        };
      }
    }
    const deleteFile = (item, index) => {
      emit("deleteFile", index, props.actionIndex)
    }
    const beforeEditorInit = (FluentEditor) => {
      const imageIcon = `<svg t="1734490908682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5918" width="200" height="200"><path d="M1084.416 32c52.288 0 95.296 40.064 99.84 91.136l0.448 9.152v764.288c0 52.288-40.064 95.232-91.136 99.84l-9.152 0.448H132.288a100.288 100.288 0 0 1-99.84-91.2L32 896.64V132.288c0-52.288 40.064-95.296 91.136-99.84L132.288 32h952.128z m-221.568 474.24l-223.808 167.872 87.936 62.336a41.216 41.216 0 0 1 12.992 51.584l-3.392 5.76a41.216 41.216 0 0 1-51.584 12.928l-5.76-3.392-275.2-196.096-290.112 201.856v87.488c0 8.768 5.952 16 14.08 17.92l4.288 0.448h952.128c8.832 0 16-5.952 17.92-14.08l0.448-4.288 3.136-176.448-2.688-1.472a35.2 35.2 0 0 1-4.672-2.944L862.848 506.24z m221.568-392.32H132.288a18.176 18.176 0 0 0-17.92 14.08l-0.448 4.288v579.712l266.368-188.608a40.32 40.32 0 0 1 41.792-3.392l5.376 3.392 141.888 100.928 271.104-203.392a41.28 41.28 0 0 1 46.784-1.792l4.992 3.84 210.56 187.008V132.288a18.176 18.176 0 0 0-14.08-17.92l-4.288-0.448z m-703.296 51.2a144 144 0 1 1-0.128 288.128 144 144 0 0 1 0.128-288.128z m0 69.12c-41.472 0-74.88 33.408-74.88 74.88 0 41.472 33.408 74.88 74.88 74.88 41.472 0 74.88-33.408 74.88-74.88 0-41.472-33.408-74.88-74.88-74.88z" fill-rule="nonzero"></path></svg>`
      const audioIcon = `<svg t="1734490908682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5918" width="200" height="200"><path d="M992 705.6c-4.992 26.88-14.528 50.88-28.8 72.064-12.032 18.368-30.08 35.008-54.272 49.856-24.128 14.784-56.768 22.208-97.92 22.208-27.008 0-52.48-1.728-76.672-5.248a233.728 233.728 0 0 1-63.872-18.048 128.96 128.96 0 0 1-45.248-33.408 90.688 90.688 0 0 1-20.8-50.304 137.6 137.6 0 0 1 8.512-62.08c7.808-21.504 19.52-41.152 35.2-58.816a188.8 188.8 0 0 1 56.96-43.456 159.36 159.36 0 0 1 72.96-16.96c44.672 0 83.712 7.808 117.12 23.36V141.696L411.648 211.648l4.288 590.4v26.496c0 21.184-4.288 41.856-12.8 62.016a170.56 170.56 0 0 1-35.648 53.504 169.088 169.088 0 0 1-55.36 37.12 182.144 182.144 0 0 1-71.872 13.76c-28.416 0-54.656-2.624-78.784-7.936a234.688 234.688 0 0 1-63.872-23.296 139.072 139.072 0 0 1-44.8-38.144 104.64 104.64 0 0 1-20.16-52.48c-2.176-19.84 0.64-39.04 8.512-57.792 7.808-18.752 19.712-35.52 35.648-50.368 16-14.848 35.2-27.392 57.472-37.632 22.4-10.24 46.72-16.768 72.96-19.584a216.96 216.96 0 0 1 58.56-0.512c19.2 2.432 37.248 6.528 54.272 12.16V127.872L992 31.424v674.176z"></path></svg>`
      const videoIcon = `<svg t="1734491308472" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3380" width="200" height="200"><path d="M752.384 479.168a40.96 40.96 0 0 1 0 70.464l-205.696 122.88a41.28 41.28 0 0 1-62.08-35.2v-245.76a41.28 41.28 0 0 1 62.08-35.2l205.696 122.88z m-185.536-15.104v100.736l84.736-50.368-84.736-50.368z m534.848 450.88V113.92H114.304v801.024h987.392z m0 81.92H114.304c-45.44 0-82.304-36.672-82.304-81.92V113.92C32 68.672 68.864 32 114.304 32h987.392c45.44 0 82.304 36.672 82.304 81.92v801.024c0 45.248-36.864 81.92-82.304 81.92zM196.544 72.96c0-22.592 18.432-40.96 41.152-40.96 22.72 0 41.152 18.368 41.152 40.96v841.984c0 22.592-18.432 40.96-41.152 40.96a41.024 41.024 0 0 1-41.152-40.96V72.96z m41.152 277.632c22.72 0 41.152 18.304 41.152 40.96 0 22.592-18.432 40.96-41.152 40.96H73.152a41.024 41.024 0 0 1-41.152-40.96c0-22.656 18.432-40.96 41.152-40.96h164.544z m0 245.76c22.72 0 41.152 18.304 41.152 40.96 0 22.592-18.432 40.96-41.152 40.96H73.152a41.024 41.024 0 0 1-41.152-40.96c0-22.656 18.432-40.96 41.152-40.96h164.544zM937.152 72.96c0-22.592 18.432-40.96 41.152-40.96 22.72 0 41.152 18.368 41.152 40.96v841.984c0 22.592-18.432 40.96-41.152 40.96a41.024 41.024 0 0 1-41.152-40.96V72.96z m41.152 359.552a41.024 41.024 0 0 1-41.152-40.96c0-22.656 18.432-40.96 41.152-40.96h164.544c22.72 0 41.152 18.304 41.152 40.96 0 22.592-18.432 40.96-41.152 40.96h-164.544z m0 245.76a41.024 41.024 0 0 1-41.152-40.96c0-22.656 18.432-40.96 41.152-40.96h164.544c22.72 0 41.152 18.304 41.152 40.96 0 22.592-18.432 40.96-41.152 40.96h-164.544z"></path></svg>`
      const mathIcon = `<svg viewBox="0 0 1280 1024" width="24" height="24"><path d="M1106.944 340.416h-448V414.72l242.688 222.976-242.688 223.04v74.304h448v-111.488h-261.312l186.624-185.856-186.624-185.792h261.312z"></path><path d="M546.88 127.68L546.752 128 1330.944 128v76.48H529.728L359.04 972.48H267.648c-23.232-61.376-47.168-120.96-71.808-178.688A6116.032 6116.032 0 0 0 119.68 622.72l-96.832 30.272L0 581.504l176.256-56.32 36.992 79.616a2801.92 2801.92 0 0 1 99.008 241.024l145.408-718.08h89.216z"></path></svg>`
      const icons = FluentEditor.import('ui/icons')
      icons.image1 = imageIcon
      icons.audio = audioIcon
      icons.video1 = videoIcon
      icons.math = mathIcon
      const Parchment = FluentEditor.import('parchment')
      const ImageStyle = new Parchment.StyleAttributor('image1', 'color', {
        scope: Parchment.Scope.INLINE
      })
      const VideoStyle = new Parchment.StyleAttributor('video1', 'color', {
        scope: Parchment.Scope.INLINE
      })

      const AudioStyle = new Parchment.StyleAttributor('audio', 'color', {
        scope: Parchment.Scope.INLINE
      })
      const MathStyle = new Parchment.StyleAttributor('math', 'color', {
        scope: Parchment.Scope.INLINE
      })
      const LineHeightStyle = new Parchment.StyleAttributor('lineheight', 'line-height', {
        scope: Parchment.Scope.BLOCK
      })
      const FontFamilyStyle = new Parchment.StyleAttributor('font-family', 'font-family', {
        scope: Parchment.Scope.INLINE
      })
      const SizeStyle = FluentEditor.import('attributors/style/size')
      SizeStyle.whitelist = sizeList
      FluentEditor.register(SizeStyle, true)
      FluentEditor.register('formats/font-family', FontFamilyStyle)
      FluentEditor.register('formats/image1', ImageStyle)
      FluentEditor.register('formats/video1', VideoStyle)
      FluentEditor.register('formats/audio', AudioStyle)
      FluentEditor.register('formats/math', MathStyle)
      FluentEditor.register('formats/lineheight', LineHeightStyle)
    }
    return {
      t,
      content,
      initSrtUploder,
      deleteFile,
      options,
      fluentEditorRef,
      insertContent,
      beforeEditorInit,
      containerId,
      boxVisibility,
      mathConfirm,
      iframeUrl,
      isMobile,
      handleHtmlInput,
      uploadImg,
      uploadVideo,
      uploadAudio,
      uploadFile,
      drawerVisible,
      obs
    }
  }
});
</script>
<style lang="scss">
@import "@/styles/variables.scss";
.ql-image1 {
  margin-right: 0 !important;

  svg {
    width: calc(32 * var(--question-font-size)) !important;
    scale: 0.65;
  }
}
.math-dialog {
  .tiny-dialog-box {
    .tiny-dialog-box__header, .tiny-dialog-box__footer {
      padding: calc(12 * var(--question-font-size)) calc(16 * var(--question-font-size));
    }
    .tiny-dialog-box__body {
      padding: 0;
      max-height: unset;
      iframe {
        width: 100%;
        height: 600px;
      }
    }
  }
}
.ritchtextarea-container {
  .mobile {
    border: none;
    .ql-toolbar, .ql-mention-list-container {
      display: none;
    }
    .ql-editor {
      margin: 0 !important;
      border-top: unset !important;
      &::before {
        left: 0 !important;
        font-style: unset;
      }
    }
  }
  .mobile-upload-btn {
    display: flex;
    align-items: center;
    gap: calc(16 * var(--question-font-size));
    margin-bottom: calc(16 * var(--question-font-size));
    img {
      width: calc(16 * var(--question-font-size));
      height: calc(16 * var(--question-font-size));
    }
    .insert-blank {
      min-width: calc(84 * var(--question-font-size));
      height: calc(28 * var(--question-font-size));
      margin-left: auto;
      font-size: calc(12 * var(--question-font-size));
      color: var(--tiny-primary-color);
      border-radius: calc(4 * var(--question-font-size));
      border: calc(1 * var(--question-font-size)) solid var(--tiny-primary-color);
      padding: calc(2 * var(--question-font-size)) calc(8 * var(--question-font-size));
    }
  }
}

</style>
