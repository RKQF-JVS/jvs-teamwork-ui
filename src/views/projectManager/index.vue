<template>
  <div class="project-manager-layout">
    <div class="project-left" :style="{width:width,height:'100%'}">
      <sidebar></sidebar>
    </div>
    <div class="project-main" :style="{width:'calc(100% - '+ width + ')',height:'calc(100% - 0px)'}">
      <!-- 主体视图层 -->
      <!-- <el-scrollbar style="height:100%"> -->
        <vue-scroll style="height:100%" :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false}}">
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
        </vue-scroll>
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import sidebar from './sidebar/index.vue'
  export default {
    components: {sidebar},
    props: {},
    data() {
      return {
        width:'245px'
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
.project-manager-layout{
  transition: all .3s;
  display: flex;
  height: 100%;
  position: absolute;
  .project-left{
    background: #fff;
    color: #333333;
  }
  .project-main{
    transition: all .3s;
  }
}
</style>
