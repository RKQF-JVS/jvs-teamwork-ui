<template>
  <div>
    <el-skeleton :rows="rows" animated v-if="dataLength==0" />
    <template v-else>
      <slot name="card-body"></slot>
    </template>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      dataLength:{
        type:Number,
        default:0
      },
      rows:{
        type:Number,
        default:4
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
<style lang="scss">

</style>
