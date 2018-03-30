<template>
 <div>
  
  <div class="box">
    
    <div class="select">
     <select v-model="jobType">
      <option value="-1" selected disabled hidden>Please select job type</option>
      <option v-for="(job,index) in metaData.jobTypes" :value="index">{{job.label}}</option>
      </select>
    </div>
    
    <div v-if="jobType>=0">
      <br/>        
      <div class="tabs">
       <ul>
         <li v-for="(input,index) in metaData.jobTypes[jobType].inputs">
             {{input.property}}
         </li>
        </ul>
      </div>
      <ul>
        <li v-for="(item,index) in activeProject.inputs">
          <a class="is-link" v-bind:class="">{{item.label}}</a>
        </li>
      </ul>
     <hr/>
     <a @click='addNewJob' class="button is-primary">Launch Job</a>
     </div>

  </div>
  
  <div class="box">
   <a @click='fetchJobList' class="button is-info">
    Update Job List
   </a>    
  <div>
      <table class="table">
        <thead>
         <tr>
         <th>Registered</th>
         <th>Job Type</th>
         <th>Input files</th>
         <th>Current status</th>
         </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in jobList" v-bind:class="isSelected(index)">
              <td><a class="is-link" @click="selectJob(index)">
                  {{item.registered}}
                  </a>
              </td>
              <td>{{item.jobType}}</td>
              <td>{{item.details}}</td>
              <td>{{item.status}}</td>
          </tr>
         </tbody> 
      </table>
      <p class="help is-danger" v-show="!jobList">No jobs started yet. Please go to Inputs to start one.</p>
     </div>
   </div>

 </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    import { mapMutations } from 'vuex';

    // Add columns: column 2 - show selection.
    // Add execute button below.
    // Write execution with lemmer

    export default {

        data: function() {
            return {
                stage: "",
                jobType: -1,
                selectedJob: -1,
                error: "",
            };
        },
        mounted: function() {
            this.fetchJobList().then((res) => {



            });
        },
        computed: {
            ...mapGetters([
                'jobList',
                'metaData',
                'activeProject'
            ])
        },
        methods: {

            ...mapActions(['fetchJobList', 'addNewJobAPI']),
            addNewJob: function() {
                if (this.selectFile < 0) return alert("Please select an input file to process!");

                var params = {};
                params.projectId = this.activeProject._id;
                params.jobType = this.jobType;
                params.options = { "inputFile": this.activeProject.inputs[this.selectedFile].label };
                this.addNewJobAPI(params).then((res) => {

                    this.$router.push("/user/project/" + this.activeProject._id + "/jobs");
                });
            },
            selectJob: function(index) {
                this.selectedJob = index;
            },
            isSelected: function(index) {
                return {
                    'is-selected': (this.selectedJob === index)
                };
            }

        }


    };
</script>

/
<style>
</style>
