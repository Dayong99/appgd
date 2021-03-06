import Vue from 'vue'
import App from './App'

// 挂载全局状态管理
import store from './store'
Vue.prototype.$store = store

// iconfont 官方自定义收藏图标库组件
import IIcon from '@/components/i-icon/i-icon'
Vue.component('i-icon', IIcon)
// 用户头像组件
import UserAvatar from '@/components/user-avatar/user-avatar'
Vue.component('user-avatar', UserAvatar)
// 下拉刷新组件
import MescrollUni from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue";
Vue.component('mescroll-uni', MescrollUni)

//时间刻度表
// import CsRuler from 'cs-ruler'
// Vue.use(CsRuler)

import { DatePicker } from 'ant-design-vue';
// Vue.component('a-date-picker',DatePicker);
// import {Icon} from 'ant-design-vue';
Vue.use(DatePicker);
import 'ant-design-vue/dist/antd.css';
// Vue.use(Icon);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
