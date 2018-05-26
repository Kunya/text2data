import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes.js';
import { store } from './store/Store.js';
//import socketio from 'socket.io-client';
//import VueSocketIO from 'vue-socket.io';

//export const SocketInstance = socketio();
//Vue.use(SocketInstance, SocketInstance);

Vue.config.devtools = true;
Vue.use(VueRouter);

const router = new VueRouter({ routes: routes });


new Vue({
  router: router,
  store: store,
  el: '#app',
  render: h => h(App)
});
