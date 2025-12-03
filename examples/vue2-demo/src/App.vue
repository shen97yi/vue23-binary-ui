<template>
  <div>
    <h1>mode: {{ modeObj[mode] }}</h1>
    <MyTinyButton @handleClick1="changeMode(1)">change to edit mode</MyTinyButton>
    <MyTinyButton @handleClick1="changeMode(2)">change to preview mode</MyTinyButton>
    <MyTinyButton @handleClick1="changeMode(3)">change to answer mode</MyTinyButton>
    <!-- <h1>Vue3 沙盒</h1> -->
    <!-- <MyButton @click="say">点我</MyButton> -->
    <!-- <MyTinyButton type="primary" @handleClick1="say">点我</MyTinyButton> -->
    <br>
    <br>
    <!-- <div>
      <MyTinyButton type="primary" @handleClick1="getQuestion1">编辑单选题</MyTinyButton>
     </div>
    <div>
      <MyTinyButton type="primary" @handleClick1="getQuestion2">编辑多选</MyTinyButton>
     </div>
    <div>
      <MyTinyButton type="primary" @handleClick1="getQuestion3">编辑判断</MyTinyButton>
     </div>
    <div>
      <MyTinyButton type="primary" @handleClick1="getQuestion4">编辑填空</MyTinyButton>
     </div> -->
    <div>
      <MyTinyButton type="primary" @handleClick1="question = {}">清空题目</MyTinyButton>
     </div>
     <div v-for="item in 4">
      <div @click="addQuestion(item)">{{ '添加' + item + '题型'}}</div>
     </div>
    <!-- <Choice :mode="mode" :oriQuestion="question"/> -->
    <component :is="componentId" :mode="mode" :oriQuestion="question"></component>
  </div>
</template>

<script>
// import { Choice, Judge, Completion } from 'ul-question-test-ui';
import { Choice, Judge, Completion } from 'my-vue3-ui';

export default {
  name: 'App',
  components: {
    Choice,
    Judge,
    Completion
  },
  data() {
    return {
      question: {},
      mode: 1,
      modeObj: {
        1: 'edit 1',
        2: 'previe 2',
        3: 'answer 3'
      },
      components: [Choice, Completion, Judge],
      componentId: '' // 动态组件ID
    }
  },
  watch: {
    // 监听question.type变化，动态更新组件
    'question.type': {
      handler(newType) {
        switch(newType) {
          case 1:
          case 2:
            this.componentId = Choice;
            break;
          case 3:
            this.componentId = Judge;
            break;
          case 4:
            this.componentId = Completion;
            break;
          default:
            this.componentId = '';
        }
      },
      immediate: true
    }
  },
  methods: {
    say() {
      alert('Hello Vue3')
    },
    changeMode(mode) {
      this.mode = mode
    },
    getQuestion1() {
      this.question = {
        "questionid": 12496523,
        "oldQuestionId": null,
        "title": "<p>123131有附件的单选题呵呵呵呵呵呵呵<img src=\"https://leicloud.ulearning.cn/resources/7449024/202509281042424985.jpg\" /></p>",
        "type": 1,
        "iscontent": 1,
        "hardlevel": 3,
        "parentid": 0,
        "score": 1,
        "correctreply": "",
        "correctAnswer": [
            "B"
        ],
        "lisCount": null,
        "createtime": null,
        "updatetime": 1764209055000,
        "remark": null,
        "userid": 7449024,
        "orgid": null,
        "aspid": null,
        "desc1": "",
        "desc4": null,
        "isShare": 0,
        "theLatest": null,
        "blankOrder": 0,
        "item": [
            {
                "choiceItemID": 457368601,
                "questionID": 12496523,
                "title": "<p>123</p>",
                "link": "https://tobs.ulearning.cn/resources/web/16601871016762958.mp3"
            },
            {
                "choiceItemID": 457368602,
                "questionID": 12496523,
                "title": "<p><img src=\"https://tobs.ulearning.cn/resources/web/16601866903825796.png\" width=\"515\" height=\"213\" /><img src=\"https://tobs.ulearning.cn/resources/web/166018692562230.png\" /></p>",
                "link": ""
            },
            {
                "choiceItemID": 457368603,
                "questionID": 12496523,
                "title": "<p>123</p>",
                "link": ""
            },
            {
                "choiceItemID": 457368604,
                "questionID": 12496523,
                "title": "<p>123</p>",
                "link": ""
            }
        ],
        "subQuestions": null,
        "link": [
            {
                "fileUrl": "https://leicloud.ulearning.cn/resources/7449024/202509281042488834.mp3",
                "lisCount": null,
                "fileName": "16994360136574566.mp3",
                "fileSize": 0,
                "srt": null,
                "avatar": null
            },
            {
                "fileUrl": "https://leicloud.ulearning.cn/resources/7449024/202509281042534031.mp4",
                "lisCount": null,
                "fileName": "62c74441fde0d91b474d9a85bd68fd7c.mp4",
                "fileSize": 0,
                "srt": null,
                "avatar": null
            }
        ],
        "analyLinkList": null,
        "answerLinkList": null,
        "demoLinkList": null,
        "formulaVar": null,
        "parentFolders": [],
        "creater": "csbm_testtea001@!:+./！",
        "orgName": "测试部门-测试机构",
        "shareArray": [],
        "isUsed": null,
        "autoscore": 0,
        "linkOptionList": null,
        "tags": null,
        "tagIds": null,
        "compareInfo": null,
        "originalQuestionId": null,
        "isShareFolder": 0,
        "isShareRootDir": null,
        "shareFolderUse": null,
        "shareFolderAllowCopy": null,
        "shareFolderRootDirId": null,
        "knowledgeDTOS": null,
        "source": null
      }
      // console.log(this.question, '--------Choice--------');
    },
    getQuestion2() {
      this.question = {
        "questionid": 12496524,
        "oldQuestionId": null,
        "title": "<p>123131有附件的多选题呵呵呵呵呵呵呵<img src=\"https://leicloud.ulearning.cn/resources/7449024/202509281042424985.jpg\" /></p>",
        "type": 2,
        "iscontent": 1,
        "hardlevel": 3,
        "parentid": 0,
        "score": 1,
        "correctreply": "",
        "correctAnswer": [
            "A",
            "B"
        ],
        "lisCount": null,
        "createtime": null,
        "updatetime": 1764209055000,
        "remark": null,
        "userid": 7449024,
        "orgid": null,
        "aspid": null,
    
  
      }
    },
    getQuestion3() {
      this.question = {
        "questionid": 12496525,
        "oldQuestionId": null,
        "title": "<p>123131有附件的判断题呵呵呵呵呵呵呵<img src=\"https://leicloud.ulearning.cn/resources/7449024/202509281042424985.jpg\" /></p>",
        "type": 3,
        "iscontent": 1,
        "hardlevel": 3,
        "parentid": 0,
        "score": 1,
        "correctreply": "",
        "correctAnswer": [
            "A"
        ],
        "lisCount": null,
        "createtime": null,
        "updatetime": 1764209055000,
        "remark": null,
        "userid": 7449024,
        "orgid": null,
        "aspid": null,
    

      }
    },
    getQuestion4() {
      this.question = {
        "questionid": 12496526,
        "oldQuestionId": null,
        "title": "<p>123131有附件的单选题呵呵呵呵呵呵呵<img src=\"https://leicloud.ulearning.cn/resources/7449024/202509281042424985.jpg\" /></p>",
        "type": 1,
        "iscontent": 1,
        "hardlevel": 3,
        "parentid": 0,
        "score": 1,
        "correctreply": "",
        "correctAnswer": [
            "B"
        ],
        "lisCount": null,
        "createtime": null,
        "updatetime": 1764209055000,
        "remark": null,
        "userid": 7449024,
        "orgid": null,
        "aspid": null,
      }
    },
    addQuestion(type) {
      switch(type) {
        case 1:
          // this.getQuestion1();
          this.question = {
            type,
            questionId: Math.floor(Math.random() * 1e9),
          }
          break;
        case 2:
          this.getQuestion2();
          break;
        case 3:
          this.getQuestion3();
          break;
        case 4:
          this.getQuestion4();
          break;
        default:
          this.question = {};
      }
    }
  }
}
</script>
<style>
</style>