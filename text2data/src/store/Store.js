import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource';

Vue.use(Vuex);
Vue.use(VueResource);

Vue.http.options.root="https://text2data-kunya.c9users.io";

export const store=new Vuex.Store({
  state:{
    user:{
      login:"",
      password:"",
      id:0,
    },
    projects:[
      { 
        id:1, 
        label: "RTK HUGE",
        inputs: ["wave1","wave2"],
        outputs: ["wave1 ready","wave2 ready"],
        models: ["wave1 precoded"]
      },
      {
        id:2, 
        label: "Megafon",
        inputs: ["wave1","wave2","wave3"],
        outputs: ["wave1 ready","wave2 ready"],
        models: ["wave1 precoded"]
      }
      ]
  },
  getters:{
    userID:function(state) {return state.user.id;},
    projectList:function(state) {return state.projects;},
    inputs:function(state) {if (state.activeProject) return state.activeProject.inputs;}
  },
  actions:{
    test:function(context){
      setTimeout(function(){context.commit("changeProject");},10000); 
    },
    addProject:function(context,project){
      context.commit("addProject", project);
    },
    fetchProjectList:function(context){
     Vue.http.get("/api/projectList")
        .then((response) => {
             context.commit("setProjectList", response.body);
        })
        .catch((error => {
            console.log(error.statusText);
        }));
    }

  },
  mutations:{
    changeProject:function(state){ state.projects[1].label="NEW PROJECT LABEL";},
    addProject:function(state,label){ state.projects.push({label: label, id:state.projects.length + 1  }); },
    setProjectList:function(state,list){ state.projects = list; }

  }
});

