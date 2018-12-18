<template>
  <div>
     <h2>Project Outputs</h2>
   <div>
   <a @click='fetchActiveProject' class="button is-primary">
    Refresh outputs
   </a>    
   </div>

    <div class="section">
        <table class="table">
            <thead>
                <tr>
                    <th>File Name</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in activeProject.outputs">
                    <td><a :href="getLink(item.label)" class="is-link" download>{{item.label}}</a>
                    </td>
                    <td>{{item.uploaded}} {{item.owner}}</td>
                    <td><a @click="deleteFile(index)" class="is-link" download>Delete</a></td>
                </tr>
            </tbody>
        </table>
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
      ...mapActions(['fetchActiveProject', 'deleteOutputFileAPI']),
      isSelected: function(index) {
        return {
          'has-text-weight-bold': (this.selectedFile === index)
        };
      },
      getLink: function(fname) {
        return '/api/project/' + this.activeProject._id + '/download/' + fname;
      },

      deleteFile(index) {
        this.deleteOutputFileAPI(index);
      },
      selectFile: function(index) {
        this.selectedFile = index;

      },

    }


  };
</script>

<style>
</style>
