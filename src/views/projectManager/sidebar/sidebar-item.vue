<template>
  <div class="menu-wrapper">
    <el-submenu v-for="(item, index) in menu" :key="'menuNav'+index" :index="index+''" :class="{'collapseNav': collapse}">
      <template slot="title">
        <i :class="item.extend[iconKey]"></i>
        <span slot="title" :alt="item.extend[pathKey]" v-show="!collapse">{{item.extend[labelKey]}}</span>
      </template>
      <template>
        <el-menu-item
          v-for="(it, itindex) in item.children"
          :key="'navmenu'+itindex"
          :index="it.extend[pathKey]"
          @click="open(it.extend)"
          :class="{'menu-item-li':true,'is-active-item':vaildAvtive(it.extend)}"
        >
          <i :class="it.extend[iconKey]"></i>
          <span slot="title" :alt="it.extend[pathKey]">{{it.extend[labelKey]}}</span>
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import {config} from "./config.js";
  export default {
    components: {},
    props: {
      menu: {
        type: Array
      },
      screen: {
        type: Number
      },
      first: {
        type: Boolean,
        default: false
      },
      props: {
        type: Object,
        default: () => {
          return {};
        }
      },
      collapse: {
        type: Boolean
      },
    },
    data() {
      return {
        config:config
      };
    },
    watch: {},
    created() {},
    mounted() {},
    computed: {
      labelKey () {
        return this.props.label||this.config.propsDefault.label;
      },
      pathKey () {
        return this.props.path||this.config.propsDefault.path;
      },
      iconKey () {
        return this.props.icon||this.config.propsDefault.icon;
      },
      nowTagValue () {
        return this.$router.$jvsRouter.formatMenuPath(this.$route);
      }
    },
    methods: {
      vaildAvtive (item) {
        const groupFlag=(item["group"]||[]).some(ele =>
          this.$route.path.includes(ele)
        );
        return this.nowTagValue===item[this.pathKey]||groupFlag;
      },
      open (item) {
        if(item[this.pathKey] === this.$router.$jvsRouter.getRoutePath(this.$route)){
          return
        }
        let tempStr = ""
        if(item.url.indexOf('#') > -1){
          tempStr = (item.url && ('#' + item.url.split('#')[1])) || ''
        }
        if(this.$route.hash && this.$route.query && this.$route.query.src  && tempStr == (this.$route.query.src  + this.$route.hash)) {
          return false
        }
        if (this.screen<=1) this.$store.commit("SET_COLLAPSE");
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey]
          }),
          query: item.query,
          params: item.params
        })
      },
      vaildRoles (item) {
        item.meta=item.meta||{};
        return item.meta.roles? item.meta.roles.includes(this.roles):true;
      },
    }
  };
</script>
<style lang="scss" scoped>

</style>
