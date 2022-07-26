<template>
  <div class="project-recycle">
    <el-tabs :tab-position="tabPosition"  v-model='tabAction' @tab-click="handleClick">
      <el-tab-pane :key="0">
         <template slot="label"><i class="el-icon-news"/>任务</template>
      </el-tab-pane>
      <el-tab-pane :key="1">
        <template slot="label"><i class="el-icon-link"/>文件</template>
      </el-tab-pane>
      <div class="config-content">
          <vue-scroll>
            <div class="content-item">
              <div class="infos">
                <div v-for="(item,index) in list" :key="index" class="list-item">
                  <div class="list-item-content">
                    <div class="title">
                      <router-link class="text-default" v-show="tabAction == '0'"
                        :to="`/project/space/task/${code}/detail/${item.code}`">
                        {{ item.name }}
                      </router-link>
                      <a target="_blank" class="text-default" v-show="tabAction == '1'" :href="item.fileUrl">
                        {{ item.originName }}
                      </a>
                    </div>
                    <div class="description">
                        {{showTaskTime(item.delTime)}}
                    </div>
                  </div>
                  <div class="actions">
                    <a class="muted" @click="recoveryTask(item,index)">
                      <el-tooltip placement="top" content="恢复内容">
                          <i class="el-icon-refresh-right"/>
                      </el-tooltip>
                    </a>
                    <a class="muted" @click="deleteItem(item,index)">
                      <el-tooltip placement="top" content="彻底删除">
                          <i class="el-icon-delete"/>
                      </el-tooltip>
                    </a>
                  </div>
                </div>
                <div v-if="list.length==0">
                  <el-empty :image-size="50"></el-empty>
                </div>
                <div v-if="showLoadingMore"
                    :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                  <div v-if="loadingMore"></div>
                  <el-button v-else type='text' @click="onLoadMore">加载更多</el-button>
                </div>
              </div>
            </div>
          </vue-scroll>
        </div>
    </el-tabs>
  </div>
</template>

<script>
import {relativelyTaskTime} from "@/util/date";
import { projectTasklistRecycle,projectTaskDel,projectTaskRecovery } from '@/api/project/task'
import { projectFileListRecycle,projectFileRecovery,projectFileDel } from '@/api/project/file'
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
      tabAction: 0,
      tabPosition: 'left',
      loadingMore:false,
      list:[],
      page:{
        total:0,
        currentPage:1,
        pageSize:20
      }
    };
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  computed: {
    showLoadingMore(){
      return this.page.currentPage*this.page.pageSize<this.page.total
    }
  },
  methods: {
    handleClick(val){
      if(val==this.tabAction){
        return
      }
      this.list = []
      this.page = {
        total:0,
        currentPage:1,
        pageSize:20
      }
      if(this.tabAction==0){
        this.getTaskListRecycle()
      }else{
        this.getFileListRecycle()
      }
    },
    showTaskTime(time) {
      return relativelyTaskTime(time);
    },
    init(){
      this.list = []
      this.getTaskListRecycle()
    },
    getTaskListRecycle(){
      projectTasklistRecycle({projectId:this.code,size:this.page.pageSize,current:this.page.currentPage}).then(res=>{
        if(res.data.code==0){
          this.list = res.data.data.records
          this.page.total = res.data.data.total
        }
      })
    },
    getFileListRecycle(){
      projectFileListRecycle({projectId:this.code,size:this.page.pageSize,current:this.page.currentPage}).then(res=>{
        if(res.data.code==0){
          this.list = res.data.data.records
          this.page.total = res.data.data.total
        }
      })
    },
    onLoadMore(){
      this.page.currentPage++
      if(this.tabAction==0){
        this.getTaskListRecycle()
      }else{
        this.getFileListRecycle()
      }
    },
    recoveryTask(item,index){
      if(this.tabAction==1){
        projectFileRecovery({fileId:item.id}).then(res=>{
          if(res.data.code==0){
            this.getFileListRecycle()
          }
        })
      }else{
        projectTaskRecovery({taskId:item.id}).then(res=>{
          if(res.data.code == 0){
            this.getTaskListRecycle()
            this.$emit("refreshList")
          }
        })
      }
    },
    deleteItem(item,index){
      if(this.tabAction==1){
        projectFileDel({fileId:item.id}).then(res=>{
          if(res.data.code==0){
            this.getFileListRecycle()
          }
        })
      }else{
        projectTaskDel({taskId:item.id}).then(res=>{
          if(res.data.code == 0){
            this.getTaskListRecycle()
          }
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.project-recycle{
  /deep/.el-tabs__item{
    text-align: left;
    padding: 4px 20px 4px 0px;
    height: 48px;
    i{
      margin-right: 8px;
      font-size: 16px;
    }
  }
  // ,/deep/.el-tab-pane
  /deep/.el-tabs__header,/deep/.el-tabs__nav-wrap{
    height: 82vh;
    min-width: 180px;
  }
  /deep/.el-tab-pane{
    overflow-y: auto;
    padding: 15px 15px 0px 0px;
    box-sizing: border-box;
  }
  .config-content {
    height: 80vh;

    .content-item {
      display: flex;
      justify-content: space-between;
      flex: 1 1;
      margin-bottom: 24px;
      padding-left: 12px;
      .infos {
        width: 100%;
        padding-right: 12px;
        .list-item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          &:first-child{
            padding: 0px 0px 12px;
          }
          .list-item-content{
            display: flex;
            flex-direction: column;
            flex: 1;
            .title{
              margin-bottom: 4px;
              color: #333;
              font-size: 14px;
              line-height: 22px;
              a:hover{
                color: #1890ff !important;
              }
            }
            .description{
              color: rgba(0,0,0,.45);
              font-size: 14px;
              line-height: 22px;
            }
          }
          .actions{
            a{
              position: relative;
              display: inline-block;
              padding: 0 8px;
              color: rgba(0,0,0,.45);
              font-size: 14px;
              line-height: 22px;
              text-align: center;
              cursor: pointer;
              &:hover{
                color: #1890ff !important;
              }
            }

            a+a{
              border-left: 1px solid #e8e8e8;
            }
          }
        }
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
}
</style>
