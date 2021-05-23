// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './assets/css/color-dark.css';
import axios from 'axios';
import './assets/css/main.css';
import Vuex from 'vuex'
import store from './store/store'
import {parseTime} from "@/utils/handleTime";
import './assets/icons' // icon

Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.parseTime = parseTime;

Vue.use(ElementUI, {
  size: 'small'
});

Vue.use(Vuex)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');


/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
