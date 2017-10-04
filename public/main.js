

const Home2 = { template: '<div> \
<form>\
 <input type="text" v-model="user.login" placeholder="login"/>\
 <br/>\
 <input type="password" v-model="user.password" placeholder="password" name=""/>\
 <br/>\
 </form>\
 <button @click="singIn">submit</button>\
 </div>'
};

const Home = { template: '<div>{{test}}</div>' };
const User = { template: '<div>logged</div>' };
const UserSettings = { template: '<div>Settings</div>' };
const UserInputs = { template: '<div>Inputs</div>' };
const UserOutputs = { template: '<div>Outputs</div>' };


const routes = [
  { path: '', component: Home },
  { path: '/user/:id', component: User, 
     children: [
        {
          path: 'settings',
          component: UserSettings
        },
        {
          // при совпадении с шаблоном /user/:id/posts
          // в <router-view> компонента User будет отображён UserPosts
          path: 'Inputs',
          component: UserInputs
        },
        {
          // при совпадении с шаблоном /user/:id/posts
          // в <router-view> компонента User будет отображён UserPosts
          path: 'Outputs',
          component: UserOutputs
        }
        
      ]}
];


const router = new VueRouter({
  routes: routes
})

Vue.component('Home', Home);
Vue.component('User', User);
Vue.component('UserSettings', UserSettings);
Vue.component('UserInputs', UserInputs);
Vue.component('UserOutputs', UserOutputs);


const app = new Vue({
  router,
  el: '#app',
  data: {
   test:"Wow",
   user:{
      login:"email",
      password:"password",
      id:-1,
      isLogged: false
    },
    dataFiles:[],
    modelFiles:[],
    outputFiles:[]
  },
  
  methods:{
    getProjectList:function(){},
    getModelList:function(){},
    getDataList:function(){},
    getOutputList:function(){},
    singIn: function(){
      var tmp=this;
      setTimeout(function() {
        tmp.user.isLogged=true;
        tmp.user.password="";
        tmp.user.id=1032;
        tmp.$router.push("User",{id:tmp.user.id});
      }, 1000);
  
      //this.password="";
    }
  }
}).$mount('#app')

