
<template>
<!-- 后续待完善 -->
  <div class="project-date">
    <el-calendar v-model="value">
    </el-calendar>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      value:{
        type:String,
        default:''
      }
    },
    data() {
      return {

      };
    },
    watch: {},
    created() {},
    mounted() {},
    computed: {},
    methods: {}
  };
</script>
<style lang="scss" scoped>

</style>
