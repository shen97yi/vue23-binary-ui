import Vue from 'vue'
// import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
// import MyVueUi from 'ul-question-test-ui' //本地打包之后引入测试
// import 'ul-question-test-ui/vue2-style'
// import '../../../dist/vue2/build-v2.css'

import MyVueUi from 'my-vue3-ui' // 本地编译时引入测试
// Vue.use(VueCompositionAPI)
Vue.use(MyVueUi)

new Vue({ render: h => h(App) }).$mount('#app')