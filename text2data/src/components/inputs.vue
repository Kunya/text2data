<template>
  <div>
    <div>
      <h2>Inputs</h2>
    </div>
     <ul>
        <li v-for="item in inputs">{{item}}</li>
     </ul>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default{
    props: ['uid'],
    watch:{
      
    },
    computed:{
        ...mapGetters([
            'inputs'
            ])
        }
};
</script>

<style>
</style>
