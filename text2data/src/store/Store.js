import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource';
import { router } from "../main.js"

Vue.use(Vuex);
Vue.use(VueResource);

Vue.http.options.root = "https://text2data-kunya.c9users.io";

export const store = new Vuex.Store({
  state: {
    user: {
      email: "",
      token: "",
      isAdmin: true
    },
    users: [],
    projects: [],
    jobs: [{ label: "Fake Job" }],
    activeProjectObj: {}
  },
  getters: {

    jobList: function(state) { return state.jobs; },
    isAdmin: function(state) { return state.user.isAdmin; },
    activeProject: function(state) { return state.activeProjectObj; },
    activeProjectInputs: function(state) { return state.activeProjectObj.inputs; },
    isLogged: function(state) { return state.user.email !== ""; },
    projectList: function(state) { return state.projects; },
    userList: function(state) { return state.users; },
    inputs: function(state) { if (state.activeProjectObj) return state.activeProjectObj.inputs; }
  },
  actions: {
    authUser: function({ commit }, payload) {

      return Vue.http.post("/api/user/login", { email: payload.email, password: payload.password })
        .then((response) => {
          commit("setUserData", response.body);
          if (!navigator.cookieEnabled) {
            Vue.http.headers.common['Authorization'] = "Bearer " + this.user.token;
          }

        });
    },
    addProjectAPI: function(context, item) {
      return Vue.http.post("/api/project/create", item)
        .then((response) => {
          item._id = response.body._id;
          context.commit("addProject", item);
        })
        .catch((error => {
          console.log(error.statusText);
        }));

    },
    updateProjectAPI: function(context, item) {
      return Vue.http.put("/api/project/update/" + item._id, item)
        .then((response) => {
          context.commit("updateActiveProject", item);
        })
        .catch((error => {
          console.log(error.statusText);
        }));

    },
    fetchProjectList: function(context) {
      Vue.http.get("/api/project/list")
        .then((response) => {
          context.commit("setProjectList", response.body);
        })
        .catch((error => {
          console.log(error.statusText);
        }));
    },
    fetchJobList: function(context) {
      Vue.http.get("/api/job/list", { params: { projectId: context.getters.activeProject._id } })
        .then((response) => {
          context.commit("setJobList", response.body);
        })
        .catch((error => {
          console.log(error.statusText);
        }));
    },

    fetchUserList: function(context) {
      Vue.http.get("/api/user/list")
        .then((response) => {
          context.commit("setUserList", response.body);
        })
        .catch((error => {
          console.log(error.statusText);
        }));
    },
    addUserAPI: function(context, item) {
      return Vue.http.post("/api/user/create", item)
        .then((response) => {
          item._id = response.body._id;
          context.commit("addUser", item);
        })
        .catch((error => {
          console.log(error.statusText);
        }));

    },
    addNewJobAPI: function(context, item) {
      return Vue.http.post("/api/job/create", item)
        .then((response) => {
          item._id = response.body._id;
          //context.commit("addJob", item);
        })
        .catch((error => {
          console.log(error.statusText);
        }));

    },

    updateUserAPI: function(context, item) {
      return Vue.http.put("/api/user/update/" + item._id, item)
        .then((response) => {
          context.commit("updateSelectedUser", item);
        })
        .catch((error => {
          console.log(error.statusText);
        }));

    }

  },
  mutations: {
    setActiveProjectById: function(state, id) {
      let obj = state.projects.find(o => {
        if (o._id === id) {
          state.activeProjectObj = o;
          return true;
        }
      });
    },
    addProject: function(state, project) {
      state.projects.push(project);
      state.activeProject = project;
    },
    addUser: function(state, item) {
      state.projects.push(item);
      state.activeUser = item;
    },
    addInputFile: function(state, item) { state.activeProjectObj.inputs.push(item); },
    updateActiveProject: function(state, project) { state.activeProjectObj = project; },
    updateSelectedUser: function(state, item) { state.activeUser = item; },
    setProjectList: function(state, list) { state.projects = list; },
    setJobList: function(state, list) { state.jobs = list; },
    setUserList: function(state, list) { state.users = list; },
    setUserData: function(state, user) {
      state.user.email = user.email;
      if (navigator.cookieEnabled) { /*enabled*/ }
      else { state.user.token = user.token; }
    }

  }
});
