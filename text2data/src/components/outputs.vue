<template>
  <div>
     <h2>Project Outputs</h2>
   <div>
   <a @click='fetchActiveProject' class="button is-primary">
    Refresh outputs
   </a>    
   </div>

    <div class="section">
      <ul>
          <li v-for="(item,index) in activeProject.outputs">
              <a :href="getLink(item.label)" class="is-link" download>{{item.label}}</a>
          </li>
      </ul>
      <p class="help is-danger" v-show="!activeProject.outputs">No data processed yet</p>
    </div>
   
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { mapActions } from 'vuex';


  // Add columns: column 2 - show selection.
  // Add execute button below.
  // Write execution with lemmer

  export default {

    data: function() {
      return {
        stage: "",
        selectedFile: -1,
        error: "",
      };
    },
    computed: {
      ...mapGetters([
        'activeProject',
      ])
    },
    methods: {
      ...mapActions(['fetchActiveProject']),
      isSelected: function(index) {
        return {
          'has-text-weight-bold': (this.selectedFile === index)
        };
      },
      getLink: function(fname) {
        return '/api/project/' + this.activeProject._id + '/download/' + fname;
      },

      selectFile: function(index) {
        this.selectedFile = index;

      },

    }


  };
</script>

<style>
</style>
