import Vue from 'vue'
// import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
// 指向 vue2 产物
import MyVueUi from 'ul-question-test-ui'

// Vue.use(VueCompositionAPI)
Vue.use(MyVueUi)

new Vue({ render: h => h(App) }).$mount('#app')