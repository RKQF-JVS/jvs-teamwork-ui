<template>
  <div class="project-template-stages">
    <div class="project-wrapper">
      <div class="action">
        <el-button type="primary" icon="el-icon-plus" @click="doAction(null,'new')">添加任务</el-button>
      </div>
      <h3>「{{$route.query.name}}」任务列表</h3>
      <el-table :data="dataSource" v-loading="loading" :show-header="false">
        <el-table-column label="内容">
          <template slot-scope="scope">
            <div class="title">{{scope.row.name}}</div>
            <div>排序:{{scope.row.sort}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <i class="el-icon-edit cursor-pointer" @click="doAction(scope.row,'edit')"></i>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="删除" placement="top">
              <i class="el-icon-delete cursor-pointer" @click="doAction(scope.row,'del',scope.$index)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="showLoadingMore" v-loading="loadingMore"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
        <el-button @click="onLoadMore">查看更多任务</el-button>
      </div>
    </div>
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
        <el-form-item label="" prop="name">
          <el-input v-model="form.name" placeholder="任务名称（必填）"></el-input>
        </el-form-item>
        <el-form-item label="" prop="sort">
          <el-input v-model="form.sort" placeholder="排序"></el-input>
          <!-- <div class="form-explain">排序，值越大越靠前，默认0</div> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="actionInfo.confirmLoading">保存任务</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { projectTemplatTaskPage,projcetTemplateTaskSave,projectTemplateTaskDel } from '@/api/project/template'
export default {
  components: {},
  props: {},
  data() {
    return {
      dataSource: [],
      loading: false,
      showLoadingMore: false,
      loadingMore: false,
      currentTemplate: {},
      actionInfo: {
        modalStatus: false,
        confirmLoading: false,
        modalTitle: '编辑任务',
      },
      form:{
        name:'',
        sort:''
      },
      rules:{
        name:[{ required: true, message: '请输入任务名称' }]
      }
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init()
  },
  mounted() {},
  computed: {},
  methods: {
    beforeClose(){
      this.$refs.form.resetFields();
      this.actionInfo.modalStatus = false
    },
    handleSubmit(){
      this.$refs.form.validate((valid)=>{
        if (valid) {
          this.actionInfo.confirmLoading = true
          projcetTemplateTaskSave(Object.assign({},this.form,{templateId:this.$route.params.code,sort:this.form.sort||0})).then(res=>{
            if(res.data.code==0){
              this.beforeClose()
              this.init()
            }
          }).finally(res=>{
            this.actionInfo.confirmLoading = false
          })
        }
      })
    },
    init(){
      this.loading = true
      projectTemplatTaskPage({templateId:this.$route.params.code}).then(res=>{
        if(res.data.code==0){
          this.dataSource = res.data.data
        }
      }).finally(res=>{
        this.loading = false
      })
    },
    onLoadMore(){

    },
    doAction(record, action, index) {
      this.currentTemplate = record;
      if (action == 'edit' || action == 'new') {
          // setTimeout(function () {
          //     app.form && app.form.resetFields();
          // }, 0);
          this.actionInfo.modalStatus = true;
          this.actionInfo.modalTitle = '添加任务';
          if (action == 'edit') {
            this.$nextTick(()=>{
              this.actionInfo.modalTitle = '编辑任务';
              this.form =Object.assign({},record)
            })
          }
      } else if (action == 'del') {
        this.$confirm(`删除任务「${this.currentTemplate.name}」后已以该任务创建的项目不受影响`, '确定删除任务？', {
          confirmButtonText: '删除任务',
          cancelButtonText: '再想想',
          confirmButtonClass:'el-button--danger',
          type: 'warning'
        }).then(() => {
          projectTemplateTaskDel(this.currentTemplate.id).then(res=>{
            if(res.data.code==0){
              this.$message.success("删除成功")
              this.init()
            }
          })
        }).catch(() => {

        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.project-template-stages{
  padding: 24px;
  .project-wrapper{
    padding: 24px;
    background: #fff;
    .action{
      padding-bottom: 12px;
    }
    .title{
      margin-bottom: 4px;
      color: #333;
      font-size: 14px;
      line-height: 22px;
    }
    /deep/.el-table__empty-block{
      border: none;
    }
  }
}
h3{
  margin-top: 0;
  margin-bottom: 0.5em;
  color: rgba(0,0,0,.85);
  font-weight: 500;
}
.cursor-pointer{
  cursor: pointer;
  &:hover{
    color: #1890ff;
  }
}
</style>
