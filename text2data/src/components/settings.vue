
<template>
 <div class="section">
     <form>
      <div class="field">
      <label class="label has-text-left">Project Label</label>
      <div class="control">
       <input class="input" type="text" v-model="activeProject.label">
      </div>
     </div>
  
    <div class="field">
      <label class="label has-text-left">Project Client</label>
      <div class="control">
       <input class="input" type="text" v-model="activeProject.client">
      </div>
     </div>
  
    <div class="field">
      <label class="label has-text-left">Project Domain</label>
      <div class="control">
       <input class="input" type="text" v-model="activeProject.domain">
      </div>
     </div>
  
  
     <div class="field">
      <div class="control">
       <button type="button" class="button is-primary" v-on:click="updateProject(project)">Update</button>
       <p class="help is-danger" v-show="err">Sorry, something went wrong</p>
       <p class="help is-primary" v-show="success">Project was updated</p>
      </div>
     </div>
 
 </form>
   
 </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default{
    props:['pid'],
    data: function() {return {err: false, success: false}},
    computed:{
        ...mapGetters([
            'activeProject'
            ])
     
    },
    methods:{
        ...mapActions(['updateProjectAPI']),
        updateProject(){
           this.err=false;
           this.success=false;
          
           this.updateProjectAPI(this.activeProject).then((response) => {
             this.success=true;
            }).catch((error => {
             if (error) this.err=true;
             }));
        }
    }
};
</script>


<style>
</style>