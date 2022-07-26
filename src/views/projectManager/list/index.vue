<template>
  <div class="page-body">
    <div class="project-list">
      <div class="project-list-typeandbtn-box">
        <el-tabs v-model="activeName" @tab-click="handleClick" :style="{width:'calc(100% - '+getCreateBtn+')'}">
          <el-tab-pane label="全部项目" name="my"></el-tab-pane>
          <el-tab-pane label="我的收藏" name="collect"></el-tab-pane>
          <el-tab-pane label="已归档" name="archive"></el-tab-pane>
          <el-tab-pane label="回收站" name="delete"></el-tab-pane>
        </el-tabs>
        <el-button id="create-btn" type="primary" icon="el-icon-plus" class="create-btn" size="small" @click="doAction(null,'new')">创建新项目</el-button>
      </div>
      <div class="project-list-box">
        <el-table
          :data="tableData"
          v-loading="tableLoading"
          :show-header="false"
          style="width: 100%">
          <el-table-column
            prop="projectName"
            label="项目名称">
            <template slot-scope="scope">
              <div class="table-content-flex">
                <el-avatar :size="50" shape="square" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                <div style="margin-left: 16px;">
                  <router-link :to="'/project/space/task/' + scope.row.id">{{scope.row.projectName}}</router-link>
                  <div>{{scope.row.projectDescription}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="创建日期">
            <template slot-scope="scope">
              <div class="table-content-flex">
                <div style="width:80px;">
                  <div>创建日期</div>
                  <div>{{moment(scope.row.createTime).format("YYYY-MM-DD")}}</div>
                </div>
                <div style="padding-left: 48px;">
                  <div>创建人</div>
                  <div>{{scope.row.createBy}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="项目进度">
            <template slot-scope="scope">
              <div>进度</div>
              <div><el-progress :percentage="scope.row.projectSchedule"></el-progress></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="135" min-width="135px">
            <template slot-scope="scope">
              <div style="text-align: center;">
                <template v-if="newActionName!='archive'&&newActionName!='delete'">
                  <el-tooltip content="添加成员" placement="top">
                    <i class="el-icon-user" @click="inviteProjectMember(scope)"></i>
                  </el-tooltip>
                  <el-divider direction="vertical"></el-divider>
                </template>
                <template v-if="newActionName!='archive'&&newActionName!='delete'">
                  <el-tooltip content="项目设置" placement="top">
                    <i class="iconfont icon-setting" @click="doAction(scope.row,'edit',scope.$index)"></i>
                  </el-tooltip>
                  <el-divider direction="vertical"></el-divider>
                </template>
                <template v-if="newActionName!='archive'&&newActionName!='delete'">
                  <el-tooltip :content="`${scope.row.collectStatus==0?'加入收藏':'取消收藏'}`" placement="top">
                    <i :class="{'iconfont icon-collection-fill':true,'collection-fill-icon':scope.row.collectStatus}" @click="doAction(scope.row,'collect',scope.$index)"></i>
                  </el-tooltip>
                  <el-divider direction="vertical"></el-divider>
                </template>
                <template v-if="newActionName=='delete'">
                  <el-tooltip content="恢复项目" placement="top">
                    <i class="el-icon-refresh-right" @click="doAction(scope.row,'recovery',scope.$index)"></i>
                  </el-tooltip>
                </template>
                <template v-if="newActionName=='archive'">
                  <el-tooltip content="恢复项目" placement="top">
                    <i class="el-icon-refresh-right" @click="doAction(scope.row,'recoveryArchive',scope.$index)"></i>
                  </el-tooltip>
                  <el-divider direction="vertical"></el-divider>
                </template>
                <el-tooltip content="移至回收站" placement="top" v-if="newActionName!='delete'">
                  <i class="el-icon-delete" @click="doAction(scope.row,'del',scope.$index)"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin-top:10px;" v-if="showMore">
          <el-button v-loading="tableLoading" size="mini" @click="loadMorePage">加载更多</el-button>
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
      append-to-body
      :destroy-on-close="true"
      :before-close="beforeClose"
      :modal="true">
      <el-form ref="form" :rules="rules" :model="form" style="padding:20px 20px 1px 0;">
        <el-form-item label="" prop="name">
          <el-input v-model="form.name" placeholder="项目名称(必填)"></el-input>
        </el-form-item>
        <el-form-item label="" prop="templateCode">
          <el-select v-model="form.templateCode" placeholder="项目模板" style="width:100%;" popper-class="templateClass">
            <el-option
              v-for="item in templateList"
              :key="item.id"
              :label="item.templateName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="项目简介"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="actionInfo.confirmLoading">完成并创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 邀请新成员 -->
    <projectMember v-model="showInviteMember" v-if="showInviteMember"></projectMember>
    <!-- 项目设置 -->
    <el-dialog :title="projectModal.modalTitle"
      :visible.sync="projectModal.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="800px"
      top="5vh"
      :modal="true"
    >
      <projectConfig :code="currentProjectCode" @update="updateProject" @changeStatus="changeStatus" v-if="projectModal.modalStatus"></projectConfig>
    </el-dialog>
  </div>
</template>

<script>
import projectMember from '@/components/project/projectMember.vue'
import projectConfig from '@/components/project/projectConfig.vue'
import { projectSave,projectPage,projectCollection,projectRecycle,projectRecovery,projectRecoveryArchive } from "@/api/project/list"
import { projectTemplateAll } from '@/api/project/template'
import moment from "moment";
export default {
  components: {
    projectMember,projectConfig
  },
  props: {},
  data() {
    return {
      showInviteMember:false,
      createBtnWidth:0,
      tableData:[],
      currentProject:{},
      currentProjectIndex:0,
      actionInfo: {
        modalStatus: false,
        confirmLoading: false,
        modalTitle: '编辑项目',
      },
      form:{
        name:'',
        templateCode:'',
        description:''
      },
      templateList:[],
      /*项目设置*/
      projectModal: {
        modalStatus: false,
        modalTitle: '项目设置',
      },
      newData: {
        code: ''
      },
      rules:{
        name:[{ required: true, message: '请输入项目名称' }]
      },
      newActionName:'',
      tableLoading:false,
      currentProjectCode:'',
      page:{
        pageSize:20,
        currentPage:1,
        total:0
      }
    };
  },
  watch: {
    activeName:{
      handler(newVal,oldVal){
        // 这里监听路由变化，更新请求数据
        this.getPageInfo()
      }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(()=>{
      let btnDom = document.getElementById('create-btn')
      this.createBtnWidth =  btnDom?btnDom.offsetWidth:0 + 20
      this.getPageInfo()
      this.projectTemplates();
    })
  },
  computed: {
    showMore(){
      return (this.page.pageSize*this.page.currentPage)<this.page.total
    },
    getCreateBtn(){
      return (this.createBtnWidth+20) +"px"
    },
    activeName:{
      get(){
        this.newActionName = this.$route.params.type
        return this.$route.params.type
      },
      set(newVal){
        this.newActionName = newVal
        console.log(newVal)
      }
    }
  },
  methods: {
    moment,
    changeStatus(){
      this.projectModal.modalStatus = false
      this.getPageInfo()
    },
    projectTemplates(){
      projectTemplateAll().then(res=>{
        if(res.data.code==0){
          this.templateList = res.data.data
        }
      })
    },
    getPageInfo(){
      this.tableLoading = true
      projectPage({
        selectType:this.newActionName.toUpperCase(),
        size:this.page.pageSize,
        current:this.page.currentPage
      }).then(res=>{
        this.tableLoading = false
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
    beforeClose(){
      this.$refs.form.resetFields();
      this.actionInfo.modalStatus = false
      this.actionInfo.confirmLoading = false
    },
    updateProject(data){
      this.tableData.splice(this.currentProjectIndex,1)
      this.tableData.splice(this.currentProjectIndex,0,data)
    },
    handleSubmit(){
      this.$refs.form.validate((valid)=>{
        if (valid) {
          this.actionInfo.confirmLoading = true
          projectSave({
            projectName:this.form.name,
            projectDescription:this.form.description,
            templateId:this.form.templateCode
          }).then(res=>{
            console.log(res)
            this.getPageInfo()
            this.beforeClose()
          })
        }
      })
    },
    doAction(record, action, index) {
      this.currentProject = record;
      this.currentProjectIndex = index;
      this.newData = {id: 0};
      if (action == 'new') {
        this.actionInfo.modalStatus = true;
        this.actionInfo.modalTitle = '创建项目';
      } else if (action == 'edit') {
        this.currentProjectCode = record.id;
        this.projectModal.modalStatus = true;
      } else if (action == 'del') {
        this.$confirm(`一旦将项目「${this.currentProject.projectName}」放入回收站，所有与项目有关的信息将会被放入回收站`, '确定放入回收站？', {
          confirmButtonText: '放入回收站',
          cancelButtonText: '再想想',
          confirmButtonClass:'el-button--danger',
          type: 'warning'
        }).then(() => {
          projectRecycle(this.currentProject).then(res=>{
            if(res.data.code == 0 && res.data.data){
              this.$message.closeAll()
              this.$message.success("放入回收站成功")
              this.tableData.splice(index,1)
            }
          })
        }).catch(() => {

        });
      } else if (action == 'recoveryArchive') {
        this.$confirm(`恢复「${this.currentProject.projectName}」后就可以正常使用了`, '取消归档项目？', {
          confirmButtonText: '取消归档',
          cancelButtonText: '再想想',
          type: 'warning'
        }).then(() => {
          projectRecoveryArchive(this.currentProject).then(res=>{
            if(res.data.data && res.data.code==0){
              this.tableData.splice(index,1)
            }
          })
        }).catch(() => {

        });
      }else if (action == 'collect') {
        const type = record.collectStatus ? 'cancel' : 'collect';
        projectCollection({projectId:record.id,type:type}).then(res=>{
          this.$set(this.tableData[index],'collectStatus',!record.collectStatus)
          this.$message.success(`${type=='collect'?'加入收藏成功':'取消收藏成功'}`)
          if(this.newActionName=='collect'){
            this.tableData.splice(index,1)
          }
        })
      }else if (action == 'recovery') {
        this.$confirm(`恢复「${this.currentProject.projectName}」后就可以正常使用了`, '确定恢复项目？', {
          confirmButtonText: '恢复项目',
          cancelButtonText: '再想想',
          type: 'warning'
        }).then(() => {
          projectRecovery(this.currentProject).then(res=>{
            if(res.data.data && res.data.code==0){
              this.$message.closeAll()
              this.$message.success("恢复项目成功")
              this.tableData.splice(index,1)
            }
          })
        }).catch(() => {

        });
      }
    },
    inviteProjectMember(item) {
      this.currentProject = item;
      this.currentProjectCode = item.code;
      this.showInviteMember = true;
    },
    handleClick(){
      this.getPageInfo()
    }
  }
};
</script>
<style lang="scss" scoped>
.page-body{
  padding-top: 24px;
  margin: 0px 0px;
  .project-list{
    background-color: white;
    border-radius: 5px;
    padding: 24px 24px 12px 24px;
    margin: 0 24px 24px;
    .project-list-typeandbtn-box{
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
</style>
<style>
.templateClass{
  min-width: 320px !important;
}
</style>
