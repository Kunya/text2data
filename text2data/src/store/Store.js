import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

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
      setTimeout(function(){context.commit("changeProject");},10000) 
    }
  },
  mutations:{
    changeProject:function(state){ state.projects[1].label="NEW PROJECT LABEL";
}
  }
});

