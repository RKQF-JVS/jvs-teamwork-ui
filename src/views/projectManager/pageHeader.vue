<template>
  <div class="page-header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in list" :key="index" :class="{'breadcrumb-active':item.name==title}">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-header-title">
      {{title}}
      <!-- <div class="page-header-title"></div>
      <div class="page-header-action">
        <slot></slot>
      </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      list:{
        type:Array,
        default:()=>{[]}
      },
      title:{
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
.page-header{
  background: #fff;
  padding: 16px 32px 0;
  border-bottom: 1px solid #e8e8e8;
  .page-header-title{
    margin-top: 16px;
    flex: auto;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0,0,0,.85);
    margin-bottom: 16px;
  }
}
</style>
