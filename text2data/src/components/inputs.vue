<template>
 <div>
  
  <div class="section">Uploaded Text Data
      <ul>
          <li v-for="item in activeProject.inputs">{{item.label}}</li>
      </ul>
      <p class="help is-danger" v-show="activeProject.inputs">No data uploaded yet</p>
  </div>
   
    
   <div class="file has-name">
    <label class="file-label">
     <button v-on:click="$upload.select('inputs')" :disabled="$upload.meta('inputs').status === 'sending'">
        <span class="file-cta">
         <span class="file-icon"><i class="fa fa-upload"></i></span>
         <span class="file-label">Upload new data…</span>
        </span>
        
     </button>
     <p class="help is-primary" v-show="$upload.meta('inputs').status === 'sending'">Uploading...</p>
   
     
       <div v-if="$upload.errors('inputs').length">
         <div v-for="error in $upload.errors('inputs')">
          {{ error.rule }}: {{ error.message }}
         </div>
       </div>

       
     </span>
    </label>
   </div>
  
 </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default{

created() {
    this.$upload.new('inputs', {
        async: true,
        extensions:false,
        maxSizePerFile: 10*1024,
        onSuccess(res) {
            console.log("Data uploaded!! Weeuw");
        },
        onError() {
            console.log("Data not uploaded");
        }
    });
},

mounted() {
    var url= `api/project/upload/${this.activeProject._id}`;
    console.log("upload url is:" + url);
    this.$upload.reset('inputs', {
        url: url
    });
},
    computed:{
        ...mapGetters([
            'activeProject'
            ])
        },
    methods:{
        uploadFile:function(files){
            //document.getElementById('uploadDataForm').submit();
        }
    }
    
    
};
</script>

<style>
</style>
