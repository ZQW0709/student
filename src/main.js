import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

// import {  Select } from 'element-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 MintUI 组件库
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import './assets/iconfont/iconfont.css'

import './styles/index.scss' // 其中包含了iconfont

Vue.config.productionTip = false
fastclick.attach(document.body) // 解决移动端点击延迟的问题

// 全局变量 user 信息
const store = {
  user: undefined,
  loading: false,
  setUser(user) {
    // console.log('[store] username = ' + user.username)
    this.user = user
  },
  setLoading(loading) {
    // console.log('[store] loading = ' + loading)
    this.loading = loading
  }
}

Vue.use(MintUI)
Vue.use(ElementUI)
// Vue.use(Button)
// Vue.use(Select)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: store,
  router,
  render: h => h(App)
})
