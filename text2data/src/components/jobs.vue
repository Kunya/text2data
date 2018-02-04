<template>
 <div>
  
  <div class="section">
   <a @click='fetchJobList' class="button is-primary">
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
                selectedJob: -1,
                error: "",
            };
        },
        mounted: function() {
            this.fetchJobList();
        },
        computed: {
            ...mapGetters([
                'jobList',
            ])
        },
        methods: {
            ...mapActions(['fetchJobList']),
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
