import landingPage from './components/landingPage.vue'
import home from './components/home.vue'
import user from './components/user.vue'
import project from './components/projects.vue'
import inputs from './components/inputs.vue'
import jobs from './components/jobs.vue'
import settings from './components/settings.vue'
import outputs from './components/outputs.vue'
import admin from './components/admin.vue'


export const routes = [
  { path: '/', component: landingPage },
  {
    path: '/user',
    component: user,
    children: [
      { path: '/admin', component: admin },
      {
        path: '/',
        component: home,
        children: [{
          path: 'project/:pid',
          component: project,
          props: true,
          children: [
            { path: '', component: settings },
            { path: 'inputs', component: inputs },
            { path: 'jobs', component: jobs },
            { path: 'outputs', component: outputs }
          ]
        }]
      }
    ]
  },
  { path: '*', redirect: "/" }
];
