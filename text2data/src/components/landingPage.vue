<template>
  <div class="section"> 
   <div class="container has-text-centered">
     <h1 class="title">Turn text into data</h1>
     <h2 class="subtitle">10x times faster and 10x cheaper vs. traditional process</h2>
   </div>
  <div class="level"></div>
  <div class="section columns">
   <div class="column is-half is-offset-one-quarter">
    <form>
     <div class="field">
      <label class="label has-text-left">Email</label>
      <div class="control">
       <input class="input" type="text" placeholder="login" v-model="login">
      </div>
     </div>

     <div class="field">
      <label class="label has-text-left">Password</label>
      <div class="control">
       <input class="input" type="password" placeholder="password" v-model="password">
      </div>
      <p class="help is-danger" v-show="err">Sorry, email or password is incorrect</p>
     </div>

     <div class="field">
      <div class="control">
       <button type="button" class="button is-primary" v-on:click="loginUser()">submit</button>
      </div>
     </div>
    </form> 
   </div>
  </div>
  
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

export default{
   data: function() {
        return {login:"", password: "", err:false};
    },
    computed:{
        ...mapGetters([
         'isLogged'])
    },
    methods:{
        ...mapActions([
            'authUser']),
            
    loginUser:function(){
     this.err=false;
     this.authUser({email:this.login, password:this.password}).then((response) => {
          console.log(response);
          this.$router.push("/user");
        }).catch((error => {
           if (error) this.err=true;
        }));
    }
   }
};
</script>

<style>
</style>
