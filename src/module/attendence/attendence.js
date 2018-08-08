// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, {
  locale
});
Vue.config.productionTip = false
import '@/css/animation.scss';
import '@/css/glob.scss'

/* eslint-disable no-new */
new Vue({
  // store,
  render: h => h(App)
}).$mount('#attendence')
