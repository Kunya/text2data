import landingPage from './components/landingPage.vue'
import home from './components/home.vue'
import project from './components/projects.vue'
import inputs from './components/inputs.vue'
import settings from './components/settings.vue'
import outputs from './components/outputs.vue'



export const routes = [
  { path: '/', component: landingPage },
  { path: '/user/:uid', component: home, props:true, children: [
     {path: 'project/:pid/', component: project, props:true, children: [  
       { path: '', component: settings},
       { path: 'inputs', component: inputs},
       { path: 'outputs', component: outputs}
      ]}
    ]},
  { path: '*', redirect: "/" }
];
