import Vue from 'vue'
import App from './App.vue'
import axios from "axios";
import {JsonTest} from "./json_test"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.prototype.JsonTest = JsonTest;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

Vue.prototype.$axios=axios
axios.defaults.withCredentials = false;