import { createApp } from 'vue'
import App from './App.vue'
// import MyVueUi from 'ul-question-test-ui/vue3' // 默认 vue3 产物
import MyVueUi from 'my-vue3-ui'
console.log(MyVueUi,'MyVueUi', )
createApp(App).use(MyVueUi).mount('#app')