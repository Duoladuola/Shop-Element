import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { mixin } from 'common/utils.js'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
// 将树组件注册为全局子组件
Vue.component('tree-table', TreeTable)
// 安装文本编辑框插件
Vue.use(VueQuillEditor)

new Vue({
  mixins: [mixin],
  router,
  store,
  render: h => h(App)
}).$mount('#app')
