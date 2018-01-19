<template>
  <div>
     <div class="tabs">
      <ul>
      <li>
       <router-link :to="'/user/project/' + pid + '/inputs'">Inputs</router-link>
      </li>
      <li>
       <router-link :to="'/user/project/' + pid + '/outputs'">Outputs</router-link>
      </li>
      <li>
       <router-link :to="'/user/project/' + pid + '/'">Settings</router-link>
      </li>
      </ul>
    </div>
     
     <div>
      <router-view></router-view>
     </div>
  </div>
</template>

<script>
export default{
    props: ['pid','uid'],
    beforeRouteEnter(to,from,next){
     next();    
    }
};
</script>

<style>
</style>
