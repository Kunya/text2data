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
     <div class="box">
      <br/>        
       <div class="tabs">
       <ul>
        <template v-for="(tab, index) in metaData.jobTypes[jobType].inputs">
         <li v-bind:class="isSelectedTab(index)">
            <a @click="selectTab(index)">{{tab.property}}</a>
         </li>
        </template>
</ul>
</div>

<ul>
    <li v-for="(file,ind) in activeProject.inputs">
        <a class="is-link" v-bind:class="isSelectedFile(ind)" @click="selectFile(ind)">{{file.label}}</a>
    </li>
</ul>
</div>
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
                <tr v-for="(item,index) in jobList" v-bind:class="isSelectedJob(index)">
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
                tabIndex: 0,
                jobIndex: -1,
                fileIndex: -1,
                fileSelections: [],
                error: "",
                socket: {},
            };
        },
        mounted: function() {
            this.fetchJobList().then((res) => {});
        },
        beforeDestroy: function() {
            if (this.socket) this.socket.emit('end');
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
                var params = { options: {} };
                var emptyTabs = "";
                if (this.fileIndex > -1) this.fileSelections[this.tabIndex] = this.fileIndex; //save current selection


                //check if user provided all inputs and prepare request to server
                this.metaData.jobTypes[this.jobType].inputs.forEach((x, i) => {
                    if (this.fileSelections[i] < 0) {
                        emptyTabs = emptyTabs + ", " + this.metaData.jobTypes[this.jobType].inputs[i].property;
                    }
                    else {
                        params.options[x.property] = this.activeProject.inputs[this.fileSelections[i]].label;
                    }
                });

                if (emptyTabs) return alert("Please select an input file on tab(s): " + emptyTabs.substr(2));

                params.projectId = this.activeProject._id;
                params.jobType = this.metaData.jobTypes[this.jobType].type;
                console.log(params);
                this.addNewJobAPI(params).then((res) => {
                    this.socket = this.$socketIO.connect();

                    this.socket.on('connect', function() {
                        // Connected, let's sign-up for to receive messages for this room
                        console.log('Connected by Socket');
                        this.socket.emit('job', res.jobId);
                    });

                    this.socket.on('status', function(data) {
                        console.log('Job status:', data);
                    });



                });
            },
            selectFile: function(index) {
                this.fileIndex = index;
            },
            isSelectedFile: function(index) {
                return {
                    'has-text-weight-bold': (this.fileIndex === index)
                };
            },
            selectTab: function(index) {
                this.fileSelections[this.tabIndex] = this.fileIndex;
                this.tabIndex = index;
                this.fileIndex = this.fileSelections[this.tabIndex];
            },
            isSelectedTab: function(index) {
                return {
                    'is-active': (this.tabIndex === index)
                };
            },
            selectJob: function(index) {
                this.jobIndex = index;
            },
            isSelectedJob: function(index) {
                return {
                    'is-selected': (this.jobIndex === index)
                };
            },



        }


    };
</script>


<style>
</style>
