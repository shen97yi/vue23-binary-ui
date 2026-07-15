import { createApp } from 'vue'
import App from './App.vue'
// import MyVueUi from 'ul-question-ui/vue3' // 默认 vue3 产物
import MyVueUi from 'my-vue3-ui'
import 'ul-question-ui/vue3-style'
createApp(App).use(MyVueUi).mount('#app')