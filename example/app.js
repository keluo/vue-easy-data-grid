import Vue from 'vue'
import App from './App.vue'
import VueDataGrid from '../src'
Vue.use(VueDataGrid)
new Vue({
  render: h => h(App)
}).$mount('#app')