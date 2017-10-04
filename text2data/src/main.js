import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes.js';
import { store } from './store/Store.js';

Vue.use(VueRouter);

const router=new VueRouter({routes:routes});

new Vue({
  router:router,
  store:store,
  el: '#app',
  render: h => h(App)
})
