<template>
  <el-dialog
    title=""
    visible
    :custom-class="`project-dialog ${this.$route.query['full-screen']?'full-screen':''}`"
    :close-on-click-modal	="false"
    top="5vh"
    :modal="true"
    :show-close="false"
    :fullscreen="this.$route.query['full-screen']"
    :destroy-on-close="true"
  >
    <task-detail :taskCode="code" :projectCode="projectCode" @handleClose="detailClose" v-if="code"></task-detail>
  </el-dialog>
</template>

<script>
import taskDetail from '@/components/project/taskDetail.vue'
  export default {
    components: {taskDetail},
    props: {},
    data() {
      return {
        code: this.$route.params.code,
        projectCode: this.$route.params.taskId,
      };
    },
    watch: {},
    created() {
    },
    mounted() {},
    computed: {},
    methods: {
      detailClose() {
        const stageIndex = this.$route.query.from;
        let url = '';
        if (stageIndex) {
            url = `?from=${stageIndex}`;
        }
        this.$router.push(`/project/space/task/${this.projectCode}${url}`);
      },
    }
  };
</script>
<style lang="scss" scoped>
/deep/.project-dialog{
  width: calc(100vw - 100px) !important;
  max-width: 1360px;
}
/deep/.full-screen{
  width: calc(100vw - 0px) !important;
  max-width: 100vw;
  .task-detail-box .task-wrap{
    height: calc(100vh - 8vh) !important;
  }
  .task-detail-box .task-wrap .task-content .content-left{
    width: 73vw;
    max-width: 73vw;
  }
  .task-detail-box .task-wrap .task-content .content-right{
    height: calc(100vh - 8vh) !important;
    width: 26vw;
  }
  .right-scroll{
    height: 68vh !important;
  }
}
/deep/.el-dialog__header{
  display: none !important;
}
</style>
