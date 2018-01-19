<template>
 <div>
  
  <div class="section">Uploaded Text Data
      <ul>
          <li v-for="(item,index) in activeProject.inputs">
              <a class="is-link" v-bind:class="isSelected(index)" @click="selectFile(index)">{{item.label}}</a>
          </li>
      </ul>
      <p class="help is-danger" v-show="!activeProject.inputs">No data uploaded yet</p>
  </div>
   
    
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
   
  <div class="section has-text-centered">
   <a class="button is-primary">
    Execute
   </a>    
  </div>
  
 </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex';
import axios from "axios";

// Add columns: column 2 - show selection.
// Add execute button below.
// Write execution with lemmer

export default{

    data: function() {
     return {
            stage:"",
            selectedFile:-1,
            error:"",
            files: new FormData(),
            filename:""
        };
    },
    computed:{
        ...mapGetters([
            'activeProject',
            'activeProjectInputs'
            ])
        },
    methods:{
        ...mapMutations(['addInputFile']),
            
            isSelected:function(index){
             return {
                      'has-text-weight-bold': (this.selectedFile===index)
                    };
            },
            
            fileChange(fileList) {
                this.files.append("userData", fileList[0], fileList[0].name);
                this.stage="uploading";
                this.fileName=fileList[0].name;
                this.error="";
                this.uploadFile();
        },
        
        selectFile:function(index){
          this.selectedFile=index;
        },
        
        uploadFile() {
                var url= `api/project/upload/${this.activeProject._id}`;
                axios({ method: "POST", "url": url, "data": this.files }).then(result => {
                    //console.dir(JSON.stringify(result));
                    //#update file list
                    this.addInputFile({id: result.data.id, label:this.fileName});
                    this.stage="uploaded";
                    this.files=new FormData();
                }, error => {
                    this.error=error;
                    this.stage="";
                    this.files=new FormData();
                });

        }
    }
    
    
};
</script>

/<style>
</style>
