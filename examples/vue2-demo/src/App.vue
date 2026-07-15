<template>
  <div class="container">
    <h1>mode: {{ modeObj[mode] }}</h1>
    <div @click="changeMode(1)">change to edit mode</div>
    <div @click="changeMode(2)">change to preview mode</div>
    <div @click="changeMode(3)">change to answer mode</div>
    <div @click="isSubmitted = !isSubmitted">
      change isSubmitted {{ isSubmitted }}
    </div>
    <br />
    <br />
    <div>
      <div @click="question = {}">清空题目</div>
    </div>
    <div v-for="item in 4">
      <div @click="addQuestion(item)">{{ "添加" + item + "题型" }}</div>
    </div>
    <component
      :is="componentId"
      :mode="question.mode || mode"
      :oriQuestion="question"
      @save="save"
      @change="answerChange"
    ></component>
  </div>
</template>

<script>
import { Choice, Judge, Completion } from 'ul-question-ui';
// import { Choice, Judge, Completion } from "my-vue3-ui";

export default {
  name: "App",
  components: {
    Choice,
    Judge,
    Completion,
  },
  data() {
    return {
      question: {},
      mode: 1,
      modeObj: {
        1: "edit 1",
        2: "previe 2",
        3: "answer 3",
      },
      componentId: "", // 动态组件ID
      isSubmitted: false,
    };
  },
  watch: {
    // 监听question.type变化，动态更新组件
    "question.type": {
      handler(newType) {
        switch (newType) {
          case 1:
          case 2:
            this.componentId = Choice;
            break;
          case 3:
            this.componentId = Completion;
            break;
          case 4:
            this.componentId = Judge;
            break;
          default:
            this.componentId = "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    answerChange(val) {
      console.log(val, "valval");
    },
    save(val) {
      console.log(val, "valval");
    },
    say() {
      alert("Hello Vue3");
    },
    changeMode(mode) {
      this.mode = mode;
    },
    getQuestion1() {
      this.question = {
        id: 1781,
        type: 1,
        title: "<p>2999999999999993131</p>",
        score: 1,
        link: [
          {
            fileUrl:
              "https://tobs.ulearning.cn/resources/web/17731234009134877.mp4",
          },
        ],
        choices: [
          {
            choiceItemId: 4237,
            choiceId: 4237,
            questionId: 1781,
            
            title: "<p>99999993111123</p>",
          },
          {
            choiceItemId: 4238,
            choiceId: 4238,
            questionId: 1781,
            link: ["RPReplay_Final1758266860.MP4"],
            title: "<p>312333</p>",
          },
          {
            choiceItemId: 4239,
            choiceId: 4239,
            questionId: 1781,
            link: [],
            title: "<p>444</p>",
          },
          {
            choiceItemId: 4240,
            choiceId: 4240,
            questionId: 1781,
            link: [
              "https://tobs.ulearning.cn/resources/web/17731234489539564.mp4",
            ],
            title: "<p>333</p>",
          },
        ],
        item: [
          {
            choiceItemId: 4237,
            choiceId: 4237,
            questionId: 1781,
            title: "<p>3123</p>",
            link: [
              "https://tobs.ulearning.cn/resources/web/17731234080505212.mp4",
              "https://tobs.ulearning.cn/resources/web/17731234080505212.mp4",
              "https://tobs.ulearning.cn/resources/web/17731234080505212.mp4",
              "https://tobs.ulearning.cn/resources/web/17731234080505212.mp4",
            ],
          },
          {
            choiceItemId: 4238,
            choiceId: 4238,
            questionId: 1781,
            link: ["RPReplay_Final1758266860.MP4"],
            title: "<p>312333</p>",
          },
          {
            choiceItemId: 4239,
            choiceId: 4239,
            questionId: 1781,
            link: [],
            title: "<p>444</p>",
          },
          {
            choiceItemId: 4240,
            choiceId: 4240,
            questionId: 1781,
            link: [
              "https://tobs.ulearning.cn/resources/web/17731234489539564.mp4",
            ],
            title: "<p>333</p>",
          },
        ],
        correctAnswer: ["B"],
      };
    },
    getQuestion5() {
      this.question = {
        questionid: 19673995,
        oldQuestionId: null,
        title:
          "<p>大全</p>\n<ol>\n<li>四级考试计算机技术计算机三级</li>\n</ol>\n<ul>\n<li>设计师计算机视觉是是是经济上</li>\n</ul>\n<p><span style=\"font-family: 'times new roman', times; font-size: 28px;\">nxnnxxnnxxksksksks</span></p>",
        type: 1,
        iscontent: 1,
        hardlevel: 3,
        parentid: 0,
        score: 1,
        correctreply: "",
        correctAnswer: ["B"],
        lisCount: null,
        createtime: null,
        updatetime: 1765344324000,
        remark: null,
        userid: 10792509,
        orgid: null,
        aspid: null,
        desc1: "",
        desc4: null,
        isShare: 0,
        theLatest: null,
        blankOrder: 0,
        item: [
          {
            choiceItemID: 47315155,
            questionID: 19673995,
            title:
              '<p>123123<img src="https://obscloud.ulearning.cn/resources/web/17653442934763743.png" /></p>',
            link: [
              "https://obscloud.ulearning.cn/resources/web/17653443214724001.mp4",
              "https://obscloud.ulearning.cn/resources/web/17727843990321021.mp3",
              "https://obscloud.ulearning.cn/resources/web/17727843860514356.mp3",
            ],
          },
          {
            choiceItemID: 47315156,
            questionID: 19673995,
            title: "<p>123123</p>",
            link: [
              "https://obscloud.ulearning.cn/resources/web/17653443214724001.mp4",
              "https://obscloud.ulearning.cn/resources/web/17727843990321021.mp3",
              "https://obscloud.ulearning.cn/resources/web/17727843860514356.mp3",
            ],
          },
          {
            choiceItemID: 47315157,
            questionID: 19673995,
            title: "<p>122313</p>",
            link: [
              "https://obscloud.ulearning.cn/resources/web/17653443214724001.mp4",
              "https://obscloud.ulearning.cn/resources/web/17727843990321021.mp3",
              "https://obscloud.ulearning.cn/resources/web/17727843860514356.mp3",
            ],
          },
          {
            choiceItemID: 47315158,
            questionID: 19673995,
            title: "<p>12312132</p>",
            link: [
              "https://obscloud.ulearning.cn/resources/web/17653443214724001.mp4",
              "https://obscloud.ulearning.cn/resources/web/17727843990321021.mp3",
              "https://obscloud.ulearning.cn/resources/web/17727843860514356.mp3",
            ],
          },
        ],
        subQuestions: null,
        link: [
          {
            fileUrl:
              "https://obscloud.ulearning.cn/resources/web/17653341688477768.mp3",
            lisCount: null,
            fileName: "16994360136574566.mp3",
            fileSize: 0,
            srt: null,
            avatar: null,
          },
          {
            fileUrl:
              "https://obscloud.ulearning.cn/resources/web/17653341742454581.mp4",
            lisCount: null,
            fileName: "17639736759711778.mp4",
            fileSize: 0,
            srt: null,
            avatar: null,
          },
        ],
        analyLinkList: null,
        answerLinkList: null,
        demoLinkList: null,
        formulaVar: null,
        parentFolders: [],
        creater: "测试教师",
        orgName: "文华在线测试部门",
        shareArray: [],
        isUsed: null,
        autoscore: 0,
        linkOptionList: null,
        tags: null,
        tagIds: null,
        compareInfo: null,
        originalQuestionId: null,
        isShareFolder: 0,
        isShareRootDir: null,
        shareFolderUse: null,
        shareFolderAllowCopy: null,
        shareFolderRootDirId: null,
        knowledgeDTOS: null,
        source: null,
      };
      // this.question.mode = 3
      // this.question = {
      //     "id": null,
      //     "type": 1,
      //     "title": "<p>修改答案一次这是单选标题 答案A</p>",
      //     "score": 1,
      //     "correctAnswer": [
      //         "B"
      //     ],
      //     "choices": [
      //         {
      //             "choiceItemId": 217,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项A的内容"
      //         },
      //         {
      //             "choiceItemId": 218,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项B的内容"
      //         },
      //         {
      //             "choiceItemId": 219,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项C的内容"
      //         },
      //         {
      //             "choiceItemId": 220,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项D的内容"
      //         }
      //     ],
      //     "item": [
      //         {
      //             "choiceItemId": 217,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项A的内容"
      //         },
      //         {
      //             "choiceItemId": 218,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项B的内容"
      //         },
      //         {
      //             "choiceItemId": 219,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项C的内容"
      //         },
      //         {
      //             "choiceItemId": 220,
      //             "questionId": 77,
      //             "link": "",
      //             "title": "选项D的内容"
      //         }
      //     ],
      //     record: {
      //       answer: "A"
      //     },
      //     "mode": 2
      // }
      // console.log(this.question, '--------Choice--------');
    },
    getQuestion2() {
      this.question = {
        questionid: 12496524,
        oldQuestionId: null,
        title: "132312",
        // "title": `<span class="q-space" contenteditable="false">(&nbsp;)</span><p>123131有附件的多选题呵呵呵呵呵呵呵<img src=\"https://leicloud.ulearning.cn/resources/7449024/202509281042424985.jpg\" /></p>`,
        type: 2,
        iscontent: 1,
        hardlevel: 3,
        parentid: 0,
        score: 1,
        correctreply: "",
        correctAnswer: ["A", "B"],
        lisCount: null,
        createtime: null,
        updatetime: 1764209055000,
        remark: null,
        userid: 7449024,
        orgid: null,
        aspid: null,
        record: {
          answer: ["A", "D"],
        },
      };
    },
    getQuestion3() {
      this.question = {
        allowExchange: 0,
        questionid: 12497547,
        oldQuestionId: null,
        title:
          "<p>优学院是一个集(&nbsp;)、(&nbsp;)、(&nbsp;)、(&nbsp;)的平台</p>",
        type: 3,
        iscontent: 1,
        hardlevel: 3,
        parentid: 0,
        score: 1,
        correctreply: "",
        correctAnswer: ["AI//ai", "智能化", "酌情给分", "酌情给分1"],
        lisCount: null,
        createtime: null,
        updatetime: 1762758218000,
        remark: null,
        userid: 6546517,
        orgid: null,
        aspid: null,
        desc1: "",
        desc4: null,
        isShare: 0,
        theLatest: null,
        blankOrder: 0,
        item: null,
        subQuestions: null,
        link: null,
        analyLinkList: null,
        answerLinkList: null,
        demoLinkList: null,
        formulaVar: null,
        parentFolders: [],
        creater: "魏艺宁老师",
        orgName: "文华在线",
        shareArray: [],
        isUsed: null,
        autoscore: null,
        linkOptionList: null,
        tags: null,
        tagIds: null,
        compareInfo: null,
        originalQuestionId: null,
        isShareFolder: 0,
        isShareRootDir: null,
        shareFolderUse: null,
        shareFolderAllowCopy: null,
        shareFolderRootDirId: null,
        knowledgeDTOS: null,
        source: null,
        record: {
          answer: ["AI", "智能化", "酌情给分21312213", "酌情给分21312312211"],
        },
        mode: 3,
      };
    },
    getQuestion4() {
      this.question = {
        type: 4,
        questionId: 8,
        record: {
          answer: "true",
        },
      };
    },
    addQuestion(type) {
      switch (type) {
        case 1:
          this.getQuestion1();
          setTimeout(() => {
            console.log('-----------')
            this.getQuestion1();
          }, 6000);
          // this.question = {
          //   type,
          //   questionId: Math.floor(Math.random() * 1e9),
          //   record: {
          //     answer: "A"
          //   }
          // }
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
    },
  },
};
</script>
<style scoped>
.container {
  width: 100%;
}
</style>