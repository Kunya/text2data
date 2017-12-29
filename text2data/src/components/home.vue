
<template>

    <div class="columns is-fullheight">
      <div class="column is-one-quarter is-side-bar">     
         <span class="subtitle">Select project</span>
         <hr>
         <div class="content has-text-left">
            <div v-for="pr in projectList" :key="pr._id">
              <router-link :to="'/user/project/' + pr._id"> {{pr.label}}</router-link>
            </div>
         </div>
        <hr>
        <form>
        <div class="field">
         <div class="control">
          <input type="text" v-model="newProject.label">
         </div>
        </div>
        <div class="field">
         <div class="control">
          <button class="button is-primary" @click="addNewProject">Add new project</button>
         </div>
        </div>
        </form>

            
      </div>
       
       <div class="column is-main-content">
         <router-view></router-view>
       </div>
    </div> 
 
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import { mapMutations } from 'vuex';

export default{
    data: function() {
        return {
            newProject:{label:"", domain:"MyDomain", client:"MyClient", type:""}
        };
    },
    computed:{
        ...mapGetters([
            'projectList'
            ])
        },
    methods:{
        ...mapMutations(['setActiveProjectById']),
        ...mapActions([
            'fetchProjectList',
            'addProjectAPI']),
            
        addNewProject:function() {
            if (this.newProject.label) {
             this.addProjectAPI(this.newProject).then((response) => {
             this.newProject.label="";
             //this.$router.push("/user/project/" + response._id);
            }).catch((error => {
                console.log(error);
               }));
            }
        }     
    },    
    mounted: function(){
       this.fetchProjectList();
    },
    beforeRouteUpdate: function (to, from, next) {
     console.log("Params: "+ to.params.pid);
     
     this.setActiveProjectById(to.params.pid);
     //console.log("Set to: "+ this.activeProject);
     next();
   }
    
};
</script>


<style>
</style>