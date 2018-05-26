import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';


Vue.use(Vuex);
Vue.use(VueResource);

export const store = new Vuex.Store({
  state: {
    user: {
      email: "",
      token: "",
      isAdmin: true
    },
    metadata: {
      fileTags: ["testData", "trainData", "codeFrame"],
      jobTypes: [{
          type: "lemmer",
          label: "Lemmatize Text",
          inputs: [{ property: "inputFile" }]
        },
        {
          type: "textClustering",
          label: "Text Clustering",
          inputs: [{ property: "inputFile" }]
        },
        {
          type: "textCoding",
          label: "Text Supervised Coding",
          inputs: [{ property: "trainData" }, { property: "testData" }, { property: "codeFrame" }]
        }
      ]
    },
    users: [],
    projects: [],
    jobs: [{ label: "Fake Job" }],
    activeProjectObj: {}
  },
  getters: {

    metaData: function(state) { return state.metadata; },
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
          //return "Login succeeded";
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
    deleteInputFileAPI: function(context, item) { //UploadAPIis in inputs.vue no idea why?
      return Vue.http.delete("/api/project/inputs", item)
        .then((response) => {
          context.commit("deleteInputFile", item);
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
    fetchActiveProject: function(context) {
      return Vue.http.get("/api/project/get/" + context.state.activeProjectObj._id)
        .then((response) => {
          context.commit("updateActiveProject", response.body);
        })
        .catch((error => {
          console.log(error.statusText);
        }));
    },
    fetchJobList: function(context) {
      return Vue.http.get("/api/job/list", { params: { projectId: context.getters.activeProject._id } })
        .then((response) => {
          context.commit("setJobList", response.body);
        })
        .catch((error => {
          console.log(error.statusText);
        }));
    },

    fetchUserList: function(context) {
      return Vue.http.get("/api/user/list")
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
          //item.jobId = response.body.jobId;
          context.commit("addJob", response.body);
          return response.body;
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
    deleteInputFile: function(state, index) { state.activeProjectObj.inputs.splice(index, 1); },
    updateActiveProject: function(state, project) { state.activeProjectObj = project; },
    updateSelectedUser: function(state, item) { state.activeUser = item; },
    setProjectList: function(state, list) { state.projects = list; },
    setJobList: function(state, list) { state.jobs = list; },
    addJob: function(state, item) { state.jobs.unshift(item); },
    setJobStatus: function(state, data) {
      for (var i in state.jobs) {
        if (state.jobs[i]._id == data.job) {
          state.jobs[i].status = data.status;
        }
      }

    },
    setUserList: function(state, list) { state.users = list; },
    setUserData: function(state, user) {
      state.user.email = user.email;
      //state.user.token = user.token;
      if (navigator.cookieEnabled) { Vue.http.headers.common['x-access-token'] = user.token; }
      else { state.user.token = user.token; }
    }

  }
});
