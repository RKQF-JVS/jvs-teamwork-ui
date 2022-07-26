<template>
  <!-- 这里是用于基础布局的地方 -->
  <div class="task-layout">
    <div class="task-top">
      <topbar>
      </topbar>
    </div>
    <div class="task-main" :style="{width:'calc(100% - '+ width + ')'}">
      <!-- 主体视图层 -->
      <!-- <el-scrollbar style="height:100%;"> -->
        <!-- <vue-scroll style="height:calc(100% - 0px);width:100%;" :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false}}"> -->
          <keep-alive>
            <router-view
              class="jvs-view"
              v-if="$route.meta.$keepAlive"
            />
          </keep-alive>
          <router-view
            class="jvs-view"
            v-if="!$route.meta.$keepAlive"
          />
        <!-- </vue-scroll> -->
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import topbar from './topbar'
  export default {
    components: {topbar},
    props: {},
    data() {
      return {
        width:0
      };
    },
    watch: {},
    created() {},
    mounted() {
    },
    computed: {},
    methods: {}
  };
</script>
<style lang="scss" scoped>
.task-layout{
  // position: relative;
  .task-main{
    .el-scrollbar{
      overflow-x: clip;
      overflow-y: initial;
    }
    position: absolute;
    top: 0px;
    width: 100%;
    margin-top: 51px;
    height: calc(100% - 52px);
    // height: 100%;
    // .jvs-view{
    //   position: relative;
    //   padding-top: 51px;
    // }
  }
}
</style>
