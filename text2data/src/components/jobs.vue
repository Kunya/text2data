<template>
 <div>
  
  <div class="box">
    
    <div class="select">
     <select v-model="jobType">
      <option value="-1" selected disabled hidden>Please select job type</option>
      <option v-for="(job,index) in metaData.jobTypes" :value="index" v-bind:key="job._id">{{job.label}}</option>
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
                <tr v-for="(item,index) in jobList" v-bind:key="item._id" v-bind:class="isSelectedJob(index)">
                    <td><a class="is-link" @click="selectJob(index)">
                  {{item.registered}}
                  </a>
                    </td>
                    <td>{{item.jobType}}</td>
                    <td style="word-wrap: break-word; width: 230px;">{{item.details}}</td>
                    <td><i v-show="false" class="fa fa-spinner fa-spin" aria-hidden="true"></i>{{item.status}}</td>
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
    import socketio from 'socket.io-client';
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
                isConnected: false,
                socket: {}
            };
        },
        mounted() {
            this.fetchJobList().then(() => {});
            var vm = this;
            this.socket = socketio.connect({ secure: true });
            this.socket.on('connect', () => {
                vm.isConnected = true;
                //console.log("Connected via Socket to server");
            });
            this.socket.on('disconnect', () => {
                vm.isConnected = false;
                //console.log("Disconnected from server Socket");
            });

        },
        beforeDestroy: function() {
            if (this.$options.socket) this.socket.emit('end');
        },
        computed: {
            ...mapGetters([
                'jobList',
                'metaData',
                'activeProject'
            ])
        },
        watch: {
            // эта функция запускается при любом изменении вопроса
            jobType: function(newType, oldType) {
                this.tabIndex = 0;
            } //,
            //isConnected: function(newType, oldType) {
            //    console.log("isConnected now " + newType + ", was" + oldType);
            //    }

        },
        methods: {
            ...mapMutations(['setJobStatus', 'addJob']),
            ...mapActions(['fetchJobList', 'addNewJobAPI']),

            checkJobStatus(jobIndex) {
                var jobStatus = this.jobList[jobIndex].status;
                if (!jobStatus) return false;
                if (jobStatus === "Completed") return false;
                if (jobStatus.slice(0, 6) === "Failed") return false;
                return true;
            },

            addNewJob() {
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
                //console.log(params);
                var vm = this;
                vm.addNewJobAPI(params).then(function(res) {
                    // Connected, let's sign-up for to receive messages for this room
                    //console.log("Client is connected = " + vm.isConnected);
                    //console.log("JOB = " + res);

                    if (vm.isConnected) {
                        //console.log('emited job:' + res._id);
                        vm.socket.emit('job', res._id);
                        vm.socket.on('status', function(data) {
                            //console.log('Incoming message:', data);
                            vm.setJobStatus(data);
                        });
                    }

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
