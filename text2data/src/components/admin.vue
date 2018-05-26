<template>
 <div class="columns is-fullheight">
      <div class="column is-one-quarter is-side-bar">     
         <span class="subtitle">Select user</span>
         <hr>
         <div class="content has-text-left">
            <div v-for="(item, index) in userList" :key="item._id">
              <a class="is-link" v-bind:class="isSelected(index)" @click="selectUser(index)">{{item.email}}</a>
            </div>
         </div>
        <hr>

        <form>
        <div class="field">
         <div class="control">
          <button class="button is-primary" @click="showForm()">Add new User</button>
         </div>
        </div>
        </form>
     </div>
      
      
     <div class="column is-three-quarters"> 
     <form v-show="formIsVisible">
      <div class="tag is-warning is-2" v-show="isNewUser">NEW USER FORM</div>
      <div class="field">
      <label class="label has-text-left">User Email</label>
      <div class="control">
       <input class="input" type="text" v-model="user.email">
      </div>
     </div>
  
     <div class="field" v-show="isNewUser">
      <label class="label has-text-left">Enter password</label>
      <div class="control">
       <input class="input" type="password" v-model="user.password">
      </div>
      </div>
  
     <div class="field">
      <label class="label has-text-left">Project Domain</label>
       <div class="control">
        <label>Select access level</label>
        <select>
         <option v-for="item in roles" :value="item">{{item}}</option>
        </select>
        </div>
     </div>

     <div class="field">
      <label class="label has-text-left">Add access to</label>
      <div class="control">
       <input class="input" type="password" v-model="access">
      </div>
      </div>
  
  
     <div class="field">
      <div class="control">
       <button type="button" class="button is-primary" v-on:click="Submit">Submit</button>
       <p class="help is-danger" v-show="error">{{error}}</p>
       <p class="help is-primary" v-show="message">{{message}}</p>
      </div>
     </div>
    </form>

   </div>



 </div>
</template>

<script>
 import { mapGetters } from 'vuex';
 import { mapActions } from 'vuex';
 import { mapMutations } from 'vuex';

 // Define access level: Admin, Domain (company), Client, project

 export default {
  data: function() {
   return {
    user: { email: "", password: "", role: "", accessTo: [], tags: [] },
    access: "",
    message: "",
    selectedUser: -1,
    error: "",
    formIsVisible: false,
    isNewUser: false,
    roles: ["Admin", "Domain", "Client", "Project"]
   };
  },
  computed: {
   ...mapGetters([
    'userList'
   ]),
  },
  methods: {
   ...mapMutations(['setActiveProjectById']),
   ...mapActions([
    'fetchUserList',
    'addUserAPI',
    'updateUserAPI'
   ]),

   selectUser: function(index) {
    this.user = this.userList[index];
    this.formIsVisible = true;
    this.isNewUser = false;
    this.selectedUser = index;
   },

   isSelected: function(index) {
    return {
     'is-prime': (this.selectedUser === index)
    };
   },

   showForm: function() {
    this.user = { email: "", password: "", role: "", accessTo: [], tags: [] };
    this.error = "";
    this.message = "";
    this.formIsVisible = true;
    this.isNewUser = true;
   },
   Submit: function() {
    if (this.isNewUser) { this.addNewUser(); }
    else {}
   },
   addNewUser: function() {
    if (this.user.email) {
     this.user.accessTo = this.access.split(';');
     this.addUserAPI(this.user).then((response) => {
      this.user.email = "";
      this.user.password = "";
      this.error = "";
      this.message = "User was successfuly added!";
     }).catch((error => {
      console.log(error);
      this.error = error;
     }));
    }
   }
  },
  mounted: function() {
   this.fetchUserList();
  }

 };
</script>

<style>
</style>
