<template>
  <h1>Vue3 沙盒</h1>
  <MyButton @click="say">点我</MyButton>
  <MyTinyButton type="primary" @click="say">点我</MyTinyButton>
  {{ question }}
  <MyTinyButton type="primary" @click="getQuestion">单选</MyTinyButton>
  <Choice :oriQuestion="question"/>
</template>

<script setup>
import { ref } from "vue"
const say = () => alert('Hello Vue3')
let question = ref({})
const getQuestion = () => {
  question.value = {
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
            "link": ""
        },
        {
            "choiceItemID": 457368602,
            "questionID": 12496523,
            "title": "<p>213</p>",
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
  
}
</script>
<style>
</style>