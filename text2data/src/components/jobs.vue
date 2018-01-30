<template>
 <div>
  
  <div class="section">Jobs in project
      <ul>
          <li v-for="(item,index) in jobList">
              <a class="is-link" v-bind:class="isSelected(index)" @click="selectJob(index)">{{item.label}}</a>
          </li>
      </ul>
      <p class="help is-danger" v-show="!jobList">No jobs started yet. Please go to Inputs to start one.</p>
  </div>
   
 </div>
</template>

<script>
    import { mapGetters } from 'vuex';
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
        computed: {
            ...mapGetters([
                'jobList',
            ])
        },
        methods: {}


    };
</script>

/
<style>
</style>
