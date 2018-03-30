<template>
 <div>
  
  <div class="columns">

  <div class="column">      
  <div class="box">
      <span class="has-text-weight-bold">Uploaded Files</span>
      <br></br>
  <div>quick search</div>
  <input type="text" v-model="searchText">
  <select v-model="searchTag">
    <option disabled value="">Select a Tag to filter</option>
    <option value="">All</option>
    <option value="testData">Data to process</option>
    <option value="trainData">Train Data</option>
    <option value="codeFrame">Codeframe</option>
  </select>
   <hr>
      <ul>
          <li v-for="(item,index) in filteredList">
              <a class="is-link" v-bind:class="isSelected(index)" @click="selectFile(index)">{{item.label}}</a>
          </li>
      </ul>
      <p class="help is-danger" v-show="!activeProject.inputs">No data uploaded yet</p>

   <hr>
   <div class="file has-name">
    <label class="file-label">
     <input type="file" name="file" :disabled="stage==='uploading'" v-on:change="fileChange($event.target.files)" />
     
     
      <div class="is-error" v-show="error">
          {{ error }}
      </div>
    </label>
    <p class="help is-primary" v-show="stage==='uploading'">Uploading...</p>
    <p class="help is-primary" v-show="stage==='uploaded'">File was uploaded!</p>
   </div>
  </div>
  </div>
   
  <div class="column">  
    <div class="box">
     <div v-if="selectedFile>=0">
     <div><span class="has-text-weight-bold">Uploaded by:</span> {{activeProject.inputs[selectedFile].owner | friendlyNA}}</div>  
     <div><span class="has-text-weight-bold">Uploaded at:</span> {{activeProject.inputs[selectedFile].uploaded | friendlyNA}}</div>  
     <span class="has-text-weight-bold">Select File Tag</span>
     <select v-model="activeProject.inputs[selectedFile].tag">
      <option disabled value="">Select File Tag</option>
      <option value="testData">Data to process</option>
      <option value="trainData">Train Data</option>
      <option value="codeFrame">Codeframe</option>
     </select>
     </div>
    </div>
  </div>
  </div>
   
  
</div>
  

</template>

<script>
    import { mapGetters } from 'vuex';
    import { mapMutations } from 'vuex';
    import axios from "axios";
    import { mapActions } from 'vuex';


    // Add columns: column 2 - show selection.
    // Add execute button below.
    // Write execution with lemmer

    export default {

        data: function() {
            return {
                jobType: "lemmer",
                stage: "",
                selectedFile: -1,
                selectedObj: {},
                error: "",
                files: new FormData(),
                filename: "",
                searchText: "",
                searchTag: "",
            };
        },
        filters: {
            friendlyNA: function(value) {
                if (!value) return 'No information';
                return value;
            }

        },
        computed: {
            ...mapGetters([
                'activeProject'
            ]),
            filteredList: function() {
                return this.activeProject.inputs.filter(item => {
                    var sText = true;
                    var sTag = true;

                    if (this.searchTag) sTag = (item.tag === this.searchTag);
                    if (this.searchText) sText = item.label.includes(this.searchText);

                    return sText && sTag;
                });
            }

        },
        methods: {
            ...mapMutations(['addInputFile']),
            isSelected: function(index) {
                return {
                    'has-text-weight-bold': (this.selectedFile === index)
                };
            },

            fileChange(fileList) {
                this.files.append("userData", fileList[0], fileList[0].name);
                this.stage = "uploading";
                this.fileName = fileList[0].name;
                this.error = "";
                this.uploadFile();
            },

            selectFile(index) {
                this.selectedFile = index;
                this.selectedObj = this.activeProject.inputs[index];
            },

            uploadFile() {
                var url = `api/project/upload/${this.activeProject._id}`;
                axios({ method: "POST", "url": url, "data": this.files }).then(result => {
                    //console.dir(JSON.stringify(result));
                    //#update file list
                    this.addInputFile({ id: result.data.id, label: this.fileName });
                    this.stage = "uploaded";
                    this.files = new FormData();
                }, error => {
                    this.error = error;
                    this.stage = "";
                    this.files = new FormData();
                });

            }
        }


    };
</script>


<style>
</style>
