<template>
  <!-- <el-scrollbar class="el-menu-scrollbar" style="height:calc(100% - 0px);"> -->
    <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false}}" class="el-menu-scrollbar" style="height:calc(100% - 0px);">
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
          :needmove="true"
        ></sidebar-item>
      </el-menu>
    </vue-scroll>
  <!-- </el-scrollbar> -->
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarItem from './sidebar-item.vue'
import {sidebarList } from './config'
export default {
  name:'sidebar',
  components: {sidebarItem},
  props: {},
  data() {
    return {
      keyCollapse:false,
      menu:sidebarList,
      screen:-1
    };
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["website"]),
    nowTagValue: function () {
      return this.$router.$jvsRouter.getRoutePath(this.$route);
    },
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.el-menu-scrollbar {
  background: #fff;
  color: #333333;
}
</style>
