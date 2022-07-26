<template>
  <div class="page-body">
    <div class="template-list">
      <div class="template-list-typeandbtn-box">
        <el-tabs v-model="activeName" @tab-click="handleClick" :style="{width:'calc(100% - '+getCreateBtn+')'}">
          <el-tab-pane label="自定义模板" name="0"></el-tab-pane>
          <!-- <el-tab-pane label="公共模板" name="1"></el-tab-pane> -->
        </el-tabs>
        <el-button id="create-btn" type="primary" icon="el-icon-plus" class="create-btn" size="small" @click="doAction(null,'new')">制作项目模板</el-button>
      </div>
      <div class="project-list-box">
        <el-table
          :data="tableData"
          stripe
          :show-header="false"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="projectName"
            label="头像" width="70">
            <el-avatar :size="50" shape="square" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" style="display: flex;"></el-avatar>
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="内容">
            <template slot-scope="scope">
              <div class="template-content">
                <div class="template-info">
                  <div class="template-info-title">{{scope.row.templateName}}</div>
                  <div>{{scope.row.description}} </div>
                </div>
                <div class="template-flowable">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="(item,index) in scope.row.list" :key="index">{{item.name}}</el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
                <div class="template-action" v-if="activeName==0">
                  <el-tooltip content="任务列表" placement="top">
                    <i class="el-icon-menu" @click="doAction(scope.row,'stages')"></i>
                  </el-tooltip>
                  <el-divider direction="vertical"></el-divider>
                  <el-tooltip content="编辑" placement="top">
                    <i class="el-icon-edit" @click="doAction(scope.row,'edit',scope.$index)"></i>
                  </el-tooltip>
                  <el-divider direction="vertical"></el-divider>
                  <el-tooltip content="删除" placement="top">
                    <i class="el-icon-delete" @click="doAction(scope.row,'del',scope.$index)"></i>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin-top:10px;" v-if="showMore">
          <el-button v-loading="loading" size="mini" @click="loadMorePage">加载更多</el-button>
        </div>
      </div>
    </div>
    <!-- 创建项目 -->
    <el-dialog
      :title="actionInfo.modalTitle"
      :visible.sync="actionInfo.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="360px"
      top="8vh"
      :destroy-on-close="true"
      :before-close="beforeClose"
      :modal="true">
      <el-form ref="form" :rules="rules" :model="form" style="padding:20px 20px 1px 0;">
        <div class="cover-item">
          <template v-if="cover">
            <img class="avatar" :src="cover"/>
          </template>
          <span class="no-avatar" v-show="!cover"></span>
          <el-upload
            class="upload-demo"
            :headers="headers"
            :action="uploadAction"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :show-file-list="false">
            <el-button size="small" icon="el-icon-upload2">上传封面</el-button>
            <span slot="tip" class="upload-tips muted">最佳图片比例为300*150</span>
          </el-upload>
        </div>
        <el-form-item label="" prop="templateName">
          <el-input v-model="form.templateName" placeholder="模板名称（必填）"></el-input>
        </el-form-item>
        <el-form-item label="" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="模板说明"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="actionInfo.confirmLoading">保存模板</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { projectTempPage,projectTemplateSave,projectTemplateDel } from '@/api/project/template'
import { getFileUrl } from '@/api/common'
export default {
  components: {},
  props: {},
  data() {
    return {
      activeName:0,
      newData:{
        code:''
      },
      loading: false,
      tableData:[],
      actionInfo: {
        modalStatus: false,
        confirmLoading: false,
        modalTitle: '编辑模板',
      },
      form:{
        templateName:'',
        description:'',
        templateCover:''
      },
      cover:'',
      rules:{
        templateName:[{ required: true, message: '请输入模板名称' }]
      },
      page:{
        pageSize:20,
        total:0,
        currentPage:1
      },
      headers:{
        'Authorization':'Bearer ' + this.$store.getters.access_token
      },
      uploadAction:'/mgr/teamwork/fileUpload/uploadProjectFile',
    };
  },
  watch: {},
  created() {
    this.getPageInfo()
  },
  mounted() {
    this.$nextTick(()=>{
      let btnDom = document.getElementById('create-btn')
      this.createBtnWidth =  btnDom?btnDom.offsetWidth:0 + 20
    })
  },
  computed: {
    showMore(){
      return (this.page.pageSize*this.page.currentPage)<this.page.total
    },
    getCreateBtn(){
      return (this.createBtnWidth+20) +"px"
    },
  },
  methods: {
    getPageInfo(){
      this.loading = true
      projectTempPage({
        size:this.page.pageSize,
        current:this.page.currentPage
      }).then(res=>{
        this.loading = false
        if(res.data.code==0){
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
        }
      })
    },
    loadMorePage(){
      this.tableLoading = true
      this.page.currentPage ++
      this.getPageInfo()
    },
    handleSuccess(response, file, fileList) {
      if(response.code == 0 ){
        this.form.templateCover = response.data.fileName
        this.getFileUrl()
      }
    },
    getFileUrl(){
      getFileUrl({fileName:this.form.templateCover}).then(res=>{
        if(res.data.code==0){
          this.cover  = res.data.data.url
        }
      })
    },
    beforeClose(){
      this.$refs.form.resetFields();
      this.actionInfo.modalStatus = false
    },
    handleSubmit(){
      this.$refs.form.validate((valid)=>{
        if (valid) {
          this.actionInfo.confirmLoading = true
          projectTemplateSave(
            Object.assign({},this.form)
          ).then(res=>{
            this.getPageInfo()
            this.beforeClose()
          }).finally(res=>{
            this.actionInfo.confirmLoading = false
          })
        }
      })
    },
    doAction(record, action, index) {
      this.currentTemplate = record;
      this.newData = {code: ''};
      if (action == 'edit' || action == 'new') {
          this.actionInfo.modalStatus = true;
          this.actionInfo.modalTitle = '自定义模板';
          if (action == 'edit') {
            this.$nextTick(()=>{
              this.actionInfo.modalTitle = '编辑模板';
              this.form = Object.assign({},record)
              this.newData = record;
              if(record.templateCover){
                this.getFileUrl()
              }
            });
          }
      } else if (action == 'del') {
        this.$confirm(`删除模板「${this.currentTemplate.templateName}」后已从该模板创建的项目不受影响`, '确定删除模板？', {
          confirmButtonText: '删除模板',
          cancelButtonText: '再想想',
          confirmButtonClass:'el-button--danger',
          type: 'warning'
        }).then(() => {
          projectTemplateDel(this.currentTemplate).then(res=>{
            if(res.data.code==0){
              this.$message.success("删除模板成功")
              this.tableData.splice(index,1)
            }
          })
        }).catch(() => {

        });
      } else if (action == 'stages') {
          const {href} = this.$router.resolve({
              path: '/project/template/taskstages/' + record.id + '?name=' + record.templateName,
          });
          window.open(href, '_blank');
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'||file.type === 'image/jpg'||file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('图片不能超过20MB!')
      }
      return isLt2M && isJPG
    },
    handleClick(){

    }
  }
};
</script>
<style lang="scss" scoped>
.page-body{
  padding-top: 24px;
  margin: 0px 0px;
  .template-list{
    background-color: white;
    border-radius: 5px;
    padding: 24px 24px 12px 24px;
    margin: 0 24px 24px;
    .template-list-typeandbtn-box{
      margin: 0 0 16px 0;
      border-bottom: 1px solid #e8e8e8;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      /deep/.el-tabs>.el-tabs__header{
        margin: 0px;
        .el-tabs__nav-wrap::after{
          height: 1px;
        }
      }
    }
    .project-list-box{
      .table-content-flex{
        display: flex;
      }
      /deep/.el-table__body{
        *{
          color: rgba(0,0,0,.45);
        }
        i:hover{
          color: #1890ff;
          cursor: pointer;
        }
        a{
          color: #1890ff;
          text-decoration: none;
          background-color: transparent;
          outline: none;
          cursor: pointer;
          -webkit-transition: color .3s;
          transition: color .3s;
        }
      }
    }
  }
}
.template-content{
  display: flex;
  align-items: center;
  flex:1 auto;
 .template-info{
  display: flex;
  flex-direction: column;
  flex: 1 1;
  .template-info-title{
    color: #333 !important;
  }
  div:last-child{
    min-height: 23px;
  }
 }
 .template-flowable{

 }
 .template-action{
   margin-left: 25px;
 }
}
.cover-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 22px !important;
  margin-left: 10px;
  .avatar, .no-avatar {
    width: 300px;
    height: 150px;
    line-height: 150px;
    font-size: 18px;
    border-radius: 4px;
    margin-bottom: 12px !important;
  }

  .no-avatar {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      list-style: none;
      text-align: center;
      background: #ccc;
      color: #fff;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      vertical-align: middle;
      display: block;
  }
  .upload-tips {
    margin-left: 12px;
  }
}
</style>
