
<template>
  <div>
   <div>
     <u2>Work desk for user {{uid}}</u2>
     <hrer>logout</hrer>
   </div>
   <div>
    <div>
       <span>Projects</span>
     <ul>
        <li v-for="pr in projectList" :key="pr.id">
          <router-link :to="'/user/' + uid + '/project/' + pr.id"> {{pr.label}}</router-link>
        </li>
     </ul>
    <div>
      <input type="text" v-model="newProject">
      <button @click="addNewProject">Add new project</button>
     </div>
    </div>
     <router-view></router-view>
   </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default{
    props: ['uid'],
    data: function() {
        return {newProject:""};
    },
    computed:{
        ...mapGetters([
            'userID',
            'projectList'
            ])
        },
    methods:{
        ...mapActions([
            'fetchProjectList',
            'addProject']),
        addNewProject:function(label){
            this.addProject(this.newProject);
            this.newProject="";
        }    
    },    
    mounted: function(){
        this.fetchProjectList();
    }    
    
};
</script>

<style>
</style>
