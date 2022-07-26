<template>
  <div class="knowledge-index-page">
    <div v-if="systemJud">
      <p class="phoneSym">手机端暂不支持</p>
    </div>
    <div v-else>
      <topbar :fresh="fresh" @fresh="freshHandle"></topbar>
      <pageInfo @fresh="freshHandle"></pageInfo>
    </div>
  </div>
</template>
<script>
import topbar from '@/page/layout/topbar'
import pageInfo from './page'
import { getStore } from "@/util/store.js";
import eventBus from "@/util/eventBus";

export default {
  components: {topbar, pageInfo},
  data () {
    return {
      systemJud:false,
      alreadyLogin: false,
      isSearch: false,
      keyword: '',
      fresh: false,
      form: {}
    }
  },
  methods: {
    handleSubmit() {},
    // 判断是否手机端
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    // 刷新
    freshHandle (bool) {
      this.alreadyLogin = bool
      this.fresh = bool
      if (getStore({name: 'userInfo'})) {
        const user = JSON.parse(JSON.stringify(getStore({name: 'userInfo'})))
        if (!user.phone) {
          // 暂时不需要
          this.$perfectInfo()
        }
      }
    }
  },
  created () {
    if (getStore({name: 'userInfo'})) {
      const user = JSON.parse(JSON.stringify(getStore({name: 'userInfo'})))
      if (!user.phone) {
        // 暂时不需要
        // this.$perfectInfo()
      }
    }
    if(getStore({name: 'userInfo'}) && getStore({name: 'tenantId'})) {
      this.alreadyLogin = true
    }
    if (this.isMobile()) {
      this.systemJud=true
    } else {
      this.systemJud=false
    }
    eventBus.$off("loginEvent")
    eventBus.$on("loginEvent", type => {
      switch(type) {
        case 'loginOut':
          sessionStorage.clear();
          localStorage.clear();
          this.alreadyLogin = false;
          this.$forceUpdate();
          break;
        default: ;break;
      }
    });
  },
  beforeDestory () {
    eventBus.$off("loginEvent")
  },
}
</script>
<style lang="scss" scoped>
.phoneSym{
  text-align: center;
  margin-top: 60%;
  color: #ec6d6d;
}
.knowledge-index-page{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.knowledge-index-page .search-box{
  height: calc(100vh - 60px);
}

.get_code {
  line-height: 36px;
  color: #3471FF;
  cursor: pointer;
  margin-right: 5px;
  font-size: 14px;
}
</style>
