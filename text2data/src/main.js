import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes.js';
import { store } from './store/Store.js';
import { socketIO } from 'socket.io';


Vue.config.devtools = true;
Vue.use(VueRouter);
Object.definePrototype(Vue.prototype, '$socketIO', { value: socketIO });

const router = new VueRouter({ routes: routes });


new Vue({
  router: router,
  store: store,
  el: '#app',
  render: h => h(App)
});
