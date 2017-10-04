<template>
  <div>
     <div>
         <h2>Project ID {{ pid }}</h2>
     <router-link :to="'/user/' + userID + '/project/' + pid + '/inputs'">Inputs</router-link>
     <router-link :to="'/user/' + userID + '/project/' + pid + '/outputs'">Outputs</router-link>
     <router-link :to="'/user/' + userID + '/project/' + pid + '/'">Settings</router-link>
     <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default{
    props: ['pid'],
    beforeRouteEnter(to,from,next){
     next();    
    }
};
</script>

<style>
</style>
