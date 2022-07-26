<template>
  <div class="files-pages">
     <div class="content-wrapper">
        <div class="content-item log-list">
          <div class="header">
            <span class="title">我的文件</span>
            <div class="header-actions">
                <!--<a><a-icon type="upload"></a-icon> 上传文件</a>-->
                <!-- <a-button id="upload-file" icon="up-circle" type="dashed">上传</a-button> -->
                <el-upload
                  class="upload-demo"
                  :headers="headers"
                  :action="uploadAction"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :show-file-list="false"
                  multiple>
                  <el-button size="mini" icon="iconfont icon-cloud-upload">上传</el-button>
                </el-upload>
            </div>
          </div>
          <div class="list-content" v-loading="tableLoading">
            <div class="list-item">
              <div class="title muted">名称</div>
              <div class="other-info muted">
                <div class="info-item">
                  <span>大小</span>
                </div>
                <div class="info-item">
                  <span>创建日期</span>
                </div>
                <div class="info-item">
                  <span>创建人</span>
                </div>
              </div>
              <div class="actions-box">
                <!-- <span :key="item" v-for="item in 3">
                </span> -->
              </div>
            </div>
            <div class="list-item" :key="index" v-for="(item, index) in files">
              <div class="title muted">{{item.originName}}</div>
              <div class="other-info muted">
                <div class="info-item">
                  <span>{{(formatSize(item.size))}}</span>
                </div>
                <div class="info-item">
                  <span>{{ formatTime(item.createTime) }}</span>
                </div>
                <div class="info-item">
                  <span>{{item.createBy}}</span>
                </div>
              </div>
              <div class="actions-box">
                <el-tooltip content="下载" placement="top" style="margin-right:10px;">
                  <a class="muted" target="_blank" :href="item.fileUrl"><i class="iconfont icon-cloud-download"/></a>
                </el-tooltip>
                <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
                  <el-tooltip effect="dark" content="更多操作" placement="top">
                    <i class="el-icon-more" style="cursor: pointer;"></i>
                  </el-tooltip>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="`copy,${index}`">
                      <i class="el-icon-copy-document"></i><span>复制链接</span>
                    </el-dropdown-item>
                    <el-dropdown-item :command="`recycle,${index}`">
                      <i class="el-icon-delete-solid"></i><span>移到回收站</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div v-if="showLoadingMore"
                :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
              <div v-if="loadingMore"></div>
              <el-button v-else type='text' @click="onLoadMore">加载更多</el-button>
            </div>
          </div>
        </div>
     </div>
  </div>
</template>

<script>
import {relativelyTime} from "@/util/date";
import { projectFile } from '@/api/project/list'
import { projectFileListAll,projectFileRecycle } from '@/api/project/file'
export default {
  components: {},
  props: {},
  data() {
    return {
      loadingMore:false,
      projectId:this.$route.params.taskId,
      files:[],
      page:{
        size:20,
        currentPage:1,
        total:0
      },
      headers:{
      'Authorization':'Bearer ' + this.$store.getters.access_token
      },
      uploadAction:'/mgr/teamwork/fileUpload/uploadProjectFile',
      tableLoading:false
    };
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  computed: {
    showLoadingMore(){
      return this.page.size*this.currentPage<this.page.total
    }
  },
  methods: {
    formatTime(time) {
      return relativelyTime(time);
    },
    formatSize(size) {
      let type = 'KB';
      size = size / 1024;
      if (size >= 1024) {
          size /= 1024;
          type = 'MB';
      }
      return `${size.toFixed(2)} ${type}`;
    },
    init(reset = true){
      if(reset){
        this.files = []
      }
      this.tableLoading = true
      projectFileListAll({size:this.page.size,current:this.page.currentPage,projectId:this.projectId}).then(res=>{
        if(res.data.code ==0 ){
          this.files.push(...res.data.data.records)
          this.total = res.data.data.total
        }
      }).finally(res=>{
        this.tableLoading = false
      })
    },
    onLoadMore(){

    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.error('图片不能超过20MB!')
      }
      return isLt20M
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      if(response.code == 0 ){
        projectFile({id:this.projectId,baseFile:response.data}).then(res=>{
          if(res.data.code == 0 ){
            this.init()
          }
        })
      }
    },
    handleCommand(val){
      const arr = val.split(',')
      const index = arr[1]
      switch(arr[0]){
        case 'copy':
          this.$copyText(this.files[index].fileUrl).then(res=>{
            if(res.code==0){
              this.$message.success("复制链接成功")
            }
          })
          break;
        case 'recycle':
          this.tableLoading = true
          projectFileRecycle({fileId:this.files[index].id}).then(res=>{
            if(res.data.code == 0){
              this.files.splice(index,1)
            }
          }).finally(res=>{
            this.tableLoading = false
          })
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.files-pages{
  padding: 12px;
  overflow: auto;
  .content-item {
    background: #fff;
    padding: 6px 0 18px 0;
    border-radius: 4px;

    .header {
      padding: 12px 20px 6px 20px;
      display: flex;
      justify-content: space-between;

      .title {
        font-size: 18px;
      }
    }
    .list-content{
      .list-item{
        padding: 12px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title{
          flex: 1;
          font-size: 14px;
        }
        .other-info{
          display: flex;
          .info-item{
            display: flex;
            flex-direction: column;
            padding-left: 0;
            width: 90px;
            text-align: right;
          }
        }
        .actions-box{
          flex: 0 0 auto;
          margin-left: 48px;
          padding: 0;
          font-size: 14px;
          list-style: none;
          min-width: 82px;

          text-align: right;
          >span{
            position: relative;
            display: inline-block;
            padding: 0 8px;
            color: rgba(0,0,0,.45);
            font-size: 14px;
            line-height: 22px;
            text-align: center;
            cursor: pointer;
            width: 14px;
          }
          >span:first-child {
            padding-left: 0;
          }
        }
      }
    }
  }
  .content-wrapper {
    width: 1100px;
    margin: auto auto;
    .log-list {
      background: #fff;
    }
  }
}
</style>
