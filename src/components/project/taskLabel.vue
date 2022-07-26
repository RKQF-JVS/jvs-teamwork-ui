<template>
  <div class="task-label">
    <el-tabs :tab-position="tabPosition"  v-model='tabAction'>
      <el-tab-pane :key="index" v-for="(taskTag,index) in taskTagList" :name="taskTag.id">
        <div slot="label" class="tag-item">
          <el-badge is-dot :class="`badge-${taskTag.color}`"></el-badge>
          <div>{{taskTag.name}}</div>
        </div>
        <div class="config-content" v-loading="loading">
          <vue-scroll>
            <div class="content-item">
              <div class="infos">
                <div :key="index" v-for="(item, index) in list">
                  <div class="task-list" :class="{'done': item.finishStatus}">
                     <div>
                        <router-link class="text-default task-content"
                                      :to="`/project/space/task/${code}/detail/${item.id}`">
                            <el-tooltip placement="top"
                                        v-if="item.executor && item.executor.headImg">
                                <template slot="content">
                                    <span>{{item.executor.realName}}</span>
                                </template>
                                <img
                                  :src="item.executor.headImg"
                                  :title="item.executor.realName"
                                  class="avatar task-executor img-circle img-24 hinted m-r-sm">
                            </el-tooltip>
                            <el-avatar size="small" icon="user" class="m-r-sm" v-else></el-avatar>
                            <span class="task-name m-r">{{ item.name }}</span>
                            <span class="muted flex m-r tag-name" v-for="tag in item.tags" :key="tag.code">
                              <el-badge is-dot :class="`badge-${tag.color} m-r-xs`"/>
                              <div>{{tag.name}}</div>
                            </span>
                        </router-link>
                    </div>
                    <div class="label task-time" :class="showTimeLabel(item.endTime)"
                      v-if="item.endTime">
                      {{showTaskTime(item.startTime, item.endTime)}}
                    </div>
                  </div>
                </div>
                <div v-if="showLoadingMore" slot="loadMore"
                    :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                  <div v-if="loadingMore" v-loading="loadingMore"></div>
                  <el-button type="text" v-else @click="onLoadMore">加载更多</el-button>
                </div>
              </div>
            </div>
          </vue-scroll>
        </div>
      </el-tab-pane>
      <div class="m-t text-center" v-if="!loading && !list.length">
        <strong>
            <h2>项目中还没有标签</h2>
        </strong>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import moment from "moment";
import { formatTaskTime } from '@/util/date'
import { projectTaskTagList,projectTaskListByTask } from '@/api/project/tag'
export default {
  components: {},
  props: {
    code: {
      type: [String],
      default() {
        return ''
      }
    },
  },
  data() {
    return {
      loading: false,
      tabAction: null,
      tabPosition: 'left',
      taskTagList: [],
      list:[],
      showLoadingMore:false,
      loadingMore:false
    };
  },
  watch: {
    code(){
      this.init()
    },
    tabAction(){
      this.getTaskList()
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  computed: {},
  methods: {
    init(){
      this.getTaskTags()
    },
    getTaskTags(){
      projectTaskTagList({projectId:this.code}).then(res=>{
        console.log(res)
        if(res.data.code==0){
          this.taskTagList = res.data.data
          if(res.data.data.length){
            this.tabAction = res.data.data[0].id
          }
        }
      })
    },
    getTaskList(reset = true){
      if(!this.tabAction || this.tabAction == 0){
        return false
      }
      this.loading = true
      projectTaskListByTask({id:this.tabAction}).then(res=>{
        if(res.data.code == 0){
          this.list = res.data.data
        }
      }).finally(res=>{
        this.loading = false
      })
    },
    showTaskTime(time, timeEnd) {
      return formatTaskTime(time, timeEnd);
    },
    showTimeLabel(time) {
      let str = 'label-primary';
      if (time == null) {
          return str;
      }
      let cha = moment(moment(time).format("YYYY-MM-DD")).diff(moment().format("YYYY-MM-DD"), 'days');
      if (cha < 0) {
          str = 'label-danger';
      } else if (cha == 0) {
          str = 'label-warning';
      } else if (cha > 7) {
          str = 'label-normal'
      }
      return str;
    },
    onLoadMore(){

    }
  }
};
</script>
<style lang="scss" scoped>
.task-label{
  /deep/.el-tabs__item{
    text-align: left;
    padding: 0px 20px 0px 0px;
  }
  /deep/.el-tabs__header,/deep/.el-tabs__nav-wrap,/deep/.el-tab-pane{
    height: 82vh;
    min-width: 180px;
  }
  .tag-item {
    display: flex;
    .el-badge{
      margin-right: 10px;
    }
    /deep/.el-badge__content.is-dot{
      top: 0px;
    }
  }
  .config-content {
    height: 82vh;
    .content-item {
      display: flex;
      justify-content: space-between;
      flex: 1 1;
      margin-bottom: 24px;
      padding-right: 12px;
      padding-left: 12px;
      .infos {
        width: 100%;
        padding-right: 12px;

        p {
          margin-bottom: 6px;
        }

        .item-title {
          font-size: 16px;
        }

        .item-tips {
          margin-bottom: 12px;
        }
      }
    }
  }
  .config-content {
    text-decoration: none;
    .task-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      &.done {
        .task-name {
          color: #A6A6A6;
          text-decoration: line-through;
        }
      }
    }

    .task-content {
      display: flex;
      align-items: center;
      text-decoration: none;
    }
    .tag-name {
      display: flex;
      align-items: center;
      /deep/.el-badge__content.is-dot{
        top:0px;
      }
    }
    .task-executor {
      width: 24px !important;
      height: 24px !important;
    }
    .task-name {
        /*line-height: 1px;*/
    }
  }
  h2{
    margin-top: 0;
    margin-bottom: 0.5em;
    color: rgba(0,0,0,.85);
    font-weight: 500;
  }
}
</style>
