<template>
  <div>
    <topbar :fresh="fresh" @fresh="freshHandle">
      <template slot="content">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item v-for="(item,index) in routerList" :key="index" :index="index+''">
            <template slot="title">
              <template v-if="item.icon">
                <i :class="item.icon" style="fill:currentColor;"></i>
              </template>
              {{item.name}}
            </template>
          </el-menu-item>
        </el-menu>

      </template>
    </topbar>
    <div class="jvs-main"
      :style="'top: 60px;height:calc(100% - 60px); width:calc(100% - 0px);left:0px;background: #f5f5f5;'">
      <div :class="{'jvs-main-loading': !alreadyLogin}"></div>
      <vue-scroll style="height:100%;" :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false}}">
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
      <!-- <el-scrollbar class="overhidden-scrollbar" style="height:100%" v-if="alreadyLogin"> -->

      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import topbar from '@/page/layout/topbar.vue'
import { getStore } from '@/util/store'
import routerList from '@/const/router'
  export default {
    components: {topbar},
    props: {},
    data() {
      return {
        fresh: false,
        alreadyLogin:false,
        routerList:routerList
      };
    },
    watch: {},
    created() {
      if(getStore({name: 'userInfo'}) && getStore({name: 'tenantId'})) {
        this.alreadyLogin = true
      }
    },
    mounted() {},
    computed: {
      activeIndex(){
        const pathArr = this.$route.path.split('/')
        let activeIndex = ''
        this.routerList.forEach(item=>{
          if(item.keyIndex=='/'+pathArr[1]){
            activeIndex = item.activeIndex
          }
        })
        return activeIndex
      },
      nowTagValue () {
        return this.$router.$jvsRouter.formatMenuPath(this.$route);
      }
    },
    methods: {
      // 刷新
      freshHandle (bool) {
        this.alreadyLogin = bool
        this.fresh = bool
        if (getStore({name: 'userInfo'})) {
          const user = JSON.parse(JSON.stringify(getStore({name: 'userInfo'})))
          if (!user.phone) {
            this.$perfectInfo()
          }
        }
      },
      handleSelect(key, keyPath){
        this.$router.push(this.routerList[key].path)
      }
    }
  };
</script>
<style lang="scss">
.overhidden-scrollbar>.el-scrollbar__wrap{
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}
.jvs-main-loading{
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('../../../public/jvs-ui-public/img/loading.gif');
  background-position: center;
  background-repeat: no-repeat;
}
.el-menu-demo{
  white-space: nowrap;
  display: flex;
}
</style>
