<template>
 <div>    
    <div class="columns">
    <div class="column box">    
     <div class="level">
       <div class="level-left">
         <div class="level-item"><i class="fa fa-bars" aria-hidden="true"></i></div>
           <div class="level-item is-link"><router-link to="/user">Home</router-link></div>
       </div>
       <div class="level-right">
           <div v-show="isAdmin" class="level-item is-link"><router-link to="/admin">Admin</router-link></div>
           <div class="level-item is-link"><router-link to="/">Logout</router-link></div>
       </div>
      </div>
      </div>
   </div>
    
   <div class="section">
         <router-view></router-view>
   </div>
 
</div> 
</template>

<script>
 import { mapGetters } from 'vuex';

 export default {
  computed: {
   ...mapGetters([
    'isAdmin'
   ])
  }
 };
</script>


<style>
</style>
