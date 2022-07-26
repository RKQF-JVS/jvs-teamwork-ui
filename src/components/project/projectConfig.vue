<template>
  <div class="project-config">
    <el-tabs :tab-position="tabPosition"  v-model='tabAction' v-loading="loading">
      <el-tab-pane :key="0">
        <span slot="label" class="tab-span">
          <i class="el-icon-s-order"></i>概览
        </span>
        <div class="config-content">
          <div class="content-item">
            <div class="infos">
              <p class="item-title">项目封面</p>
              <div class="cover-item">
                <template v-if="project.projectCover">
                  <img class="avatar" :src="project.projectCoverUrl"/>
                </template>
                <span class="no-avatar" v-show="!project.projectCoverUrl"></span>
                <el-upload
                  class="cover-uploader"
                  :action="uploadAction"
                  :show-file-list="false"
                  :headers="headers"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess">
                  <el-button  class="upload">上传新封面</el-button>
                  <p slot="tip" class="upload-tips muted">最佳图片比例为300*150</p>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="content-item">
            <div class="infos">
              <p class="item-title">项目名称</p>
              <el-input v-model="project.projectName"></el-input>
            </div>
            <div class="infos">
              <p class="item-title">项目进度 (%)</p>
              <el-input-number :min="0" :max="100" v-model="project.projectSchedule"></el-input-number>
            </div>
          </div>
          <div class="content-item">
            <div class="infos">
              <p class="item-title">项目简介</p>
              <el-input type="textarea" :autosize="{ minRows: 3}" placeholder="介绍一下这个项目"
                v-model="project.projectDescription"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div class="infos">
              <p class="item-title">项目公开性</p>
              <el-select v-model="project.isPrivate" style="width:100%;">
                <el-option :key="0" :value="0" label="公开项目（所有人都可通过链接访问，仅项目成员可编辑）">
                </el-option>
                <el-option :key="1" :value="1" label="私有项目（仅项目成员可查看和编辑）">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="infos">
                <p class="item-title">项目拥有者</p>
                <div class="m-t" style="display: flex;align-items: center;">
                    <el-avatar :src="project.owner_avatar"></el-avatar>
                    <span class="m-l">{{project.createBy}}</span>
                </div>
            </div>
          </div>
          <el-divider/>
          <div class="content-item">
            <div class="infos">
              <el-button type="primary" class="middle-btn pull-right" @click="saveProject">保存</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :key="1">
        <span slot="label" class="tab-span">
          <i class="el-icon-s-promotion"></i>项目偏好
        </span>
        <div class="config-content task-config">
          <!-- <div class="content-item">
            <div class="infos">
              <p class="item-title">看板风格</p>
              <div class="item-tips muted">切换任务看板的主题风格，内置两种风格。</div>
              <el-radio-group @change="saveProject" v-model="project.task_board_theme">
                <el-radio style="display: block;height: 30px;line-height: 30px" label="default">默认</el-radio>
                <el-radio style="display: block;height: 30px;line-height: 30px" label="simple">简约</el-radio>
              </el-radio-group>
            </div>
          </div> -->
          <div class="content-item">
            <div class="infos">
                <p class="item-title">自动更新项目进度</p>
                <div class="item-tips muted">根据当前任务的完成情况自动计算项目进度。</div>
            </div>
            <el-switch
              v-model="project.autoUpdateSchedule"
              :active-value="1"
              :inactive-value="0"
              @change="saveProject">
            </el-switch>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :key="2">
        <span slot="label" class="tab-span">
          <i class="el-icon-s-tools"></i>任务设置
        </span>
        <div class="config-content task-config">
          <!-- <div class="content-item">
              <div class="infos">
                  <p class="item-title">项目ID</p>
                  <div class="item-tips muted">设置项目编号，编号将作为 ID 前缀，用以区别项目。支持 2-6 位字母。</div>
                  <el-input class="prefix-input" placeholder="如 My Project 可以设置为 MP"
                            v-model="project.projectPrefix"
                            :disabled="!project.isOpenPrefix"></el-input>
                  <el-button class="middle-btn" type="primary"
                            :disabled="!project.isOpenPrefix" @click="saveProject">保存
                  </el-button>
              </div>
              <el-switch v-model="project.isOpenPrefix" :active-value="1"
                :inactive-value="0" @change="saveProject"/>
          </div> -->
          <div class="content-item">
              <div class="infos">
                  <p class="item-title">任务开始时间</p>
                  <div class="item-tips muted">为任务设置开始时间，更科学地规划工作。</div>
              </div>
              <el-switch v-model="project.isOpenBeginTime" :active-value="1"
                :inactive-value="0" @change="saveProject"/>
          </div>
          <div class="content-item">
              <div class="infos">
                  <p class="item-title">新任务默认开启隐私模式</p>
                  <div class="item-tips muted">对本项目内的新任务默认开启隐私模式，创建成功后仅参与者可见</div>
              </div>
              <el-switch v-model="project.openTaskPrivate" :active-value="1"
                :inactive-value="0" @change="saveProject"/>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :key="3" v-if="false">
        <span slot="label" class="tab-span">
          <i class="el-icon-refresh"></i>任务流转
        </span>
        <div class="config-content">
          <div class="content-item task-workflow">
            <div class="infos" style="padding-right: 0">
              <div v-show="!doTaskWorkflowView">
                <p>
                  <el-button size="small" type="primary" icon="el-icon-plus" @click="doTaskWorkflow(null)">创建规则</el-button>
                </p>
                <div v-for="(item,index) in taskWorkflowList" :key="index" class="task-workflow-item">
                  <div class="task-workflow-name">测试</div>
                  <div>
                    <el-tooltip placement="top" content="编辑">
                      <a class="muted m-r-sm" @click="doTaskWorkflow(item)"><i class="el-icon-edit"></i></a>
                    </el-tooltip>
                    <el-tooltip placement="top" content="删除">
                      <a class="muted" @click="delTaskWorkflow(item.code)"><i class="el-icon-delete"></i></a>
                    </el-tooltip>
                  </div>
                </div>
                <div v-if="taskWorkflowList.length==0">
                  <el-empty :image-size="50"></el-empty>
                </div>
              </div>
              <div v-show="doTaskWorkflowView">
                <div class="header">
                  <p>
                    <el-button  class="middle-btn m-r-sm" @click="saveTaskWorkflow(false)">
                      取消
                    </el-button>
                    <el-button  class="middle-btn" type="primary"
                      @click="saveTaskWorkflow(true)" :disabled="!canSaveTaskWorkflow">保存
                    </el-button>
                  </p>
                </div>
                <div class="workflow-content">
                  <template v-if="!loadingWorkflowRule">
                    <div class="workflow-rule-item">
                        <p>规则名称</p>
                        <el-input v-model="currentTaskWorkflowRule.taskWorkflowName"></el-input>
                    </div>
                    <div class="workflow-rule-item">
                        <p>选择任务列表</p>
                        <el-select  v-model="currentTaskWorkflowRule.firstObj"
                            @change="(value)=>workflowRuleChange(value,'firstObj')">
                            <el-option v-for="(taskStage, index) in taskStages"
                              :value="taskStage.code" :key="index" :label="taskStage.name">
                            </el-option>
                        </el-select>
                    </div>

                    <template v-if="currentTaskWorkflowRule.firstObj">
                      <div class="workflow-rule-item">
                        <p>选择条件</p>
                        <el-select  v-model="currentTaskWorkflowRule.firstAction.action"
                          @change="(value)=>workflowRuleChange(value,'firstAction.action')">
                          <el-option v-for="(rule, index) in taskWorkflowRuleActions"
                            :value="rule.id" :key="index" :label="rule.name">
                          </el-option>
                        </el-select>
                      </div>
                      <template v-if="currentTaskWorkflowRule.firstAction.action != -1">
                        <template v-if="currentTaskWorkflowRule.firstAction.action == 3">
                          <div class="workflow-rule-item">
                            <p>选择执行者</p>
                            <el-select  v-model="currentTaskWorkflowRule.firstAction.value"
                              @change="(value)=>workflowRuleChange(value,'firstAction.value')">
                              <el-option v-for="(member, index) in projectMembers"
                                :value="member.code" :key="index" :label="member.name">
                              </el-option>
                            </el-select>
                          </div>
                        </template>
                        <div class="workflow-rule-item">
                          <p>选择结果</p>
                          <el-select  v-model="currentTaskWorkflowRule.firstResult.action"
                            @change="(value)=>workflowRuleChange(value,'firstResult.action')">
                            <el-option v-for="(type, index) in taskWorkflowRuleTypes"
                              :value="type.id" :key="index" :label="type.name">
                            </el-option>
                          </el-select>
                        </div>
                        <template v-if="currentTaskWorkflowRule.firstResult.action === 0">
                            <div class="workflow-rule-item">
                              <p>流转任务列表</p>
                              <el-select  v-model="currentTaskWorkflowRule.firstResult.value"
                                @change="(value)=>workflowRuleChange(value,'firstResult.value')">
                                <el-option v-for="(taskStage, index) in taskStages"
                                  :value="taskStage.code" :key="index" :label="taskStage.name">
                                </el-option>
                              </el-select>
                            </div>
                            <template v-if="currentTaskWorkflowRule.firstResult.value">
                              <div class="workflow-rule-item">
                                <p>选择执行者</p>
                                <el-select  v-model="currentTaskWorkflowRule.lastResult.value"
                                  @change="(value)=>workflowRuleChange(value,'lastResult.value')">
                                  <el-option v-for="(member, index) in projectMembers"
                                    :value="member.code" :key="index" :label="member.name">
                                  </el-option>
                                </el-select>
                              </div>
                            </template>
                              <template>
                                <div class="workflow-rule-item">
                                  <p>修改任务状态</p>
                                  <el-select  v-model="currentTaskWorkflowRule.state.value"
                                    @change="(value)=>workflowRuleChange(value,'state.value')">
                                    <el-option v-for="(state, index) in taskStates"
                                      :value="state.id" :key="index" :label="state.name">
                                    </el-option>
                                  </el-select>
                                </div>
                              </template>
                            </template>
                            <template v-if="currentTaskWorkflowRule.firstResult.action === 3">
                                <div class="workflow-rule-item">
                                    <p>选择执行者</p>
                                    <el-select  v-model="currentTaskWorkflowRule.firstResult.value"
                                      @change="(value)=>workflowRuleChange(value,'firstAction.action')">
                                      <el-option v-for="(member, index) in projectMembers"
                                        :value="member.code" :key="index" :label="member.name">
                                      </el-option>
                                    </el-select>
                                </div>
                                <template v-if="currentTaskWorkflowRule.firstResult.value">
                                  <div class="workflow-rule-item">
                                    <p>流转任务列表</p>
                                    <el-select  v-model="currentTaskWorkflowRule.lastResult.value"
                                      @change="(value)=>workflowRuleChange(value,'lastResult.value')">
                                      <el-option v-for="(taskStage, index) in taskStages"
                                        :value="taskStage.code" :key="index" :label="taskStage.name">
                                      </el-option>
                                    </el-select>
                                  </div>
                                </template>
                                <template>
                                  <div class="workflow-rule-item">
                                    <p>修改任务状态</p>
                                    <el-select  v-model="currentTaskWorkflowRule.state.value"
                                      @change="(value)=>workflowRuleChange(value,'state.value')">
                                      <el-option v-for="(state, index) in taskStates"
                                        :value="state.id" :key="index" :label="state.name">
                                      </el-option>
                                    </el-select>
                                  </div>
                                </template>
                            </template>
                      </template>
                    </template>
                  </template>
                  <div class="text-center" v-loading="loadingWorkflowRule">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :key="4">
        <span slot="label" class="tab-span">
          <i class="el-icon-more"></i>更多
        </span>
        <div class="config-content">
          <div class="content-item">
            <div class="infos">
              <p class="item-title">项目操作</p>
              <div class="item-tips muted">您可以执行以下操作</div>
              <el-button class="middle-btn" @click="archiveProject">
                  <span v-if="project.isArchive">取消归档</span>
                  <span v-if="!project.isArchive">归档项目</span>
              </el-button>
              <el-button class="middle-btn" @click="quitProject">退出</el-button>
              <el-button class="middle-btn" type="danger" @click="delProject">
                  <span v-if="project.recycleFlag">恢复项目</span>
                  <span v-if="!project.recycleFlag">移至回收站</span>
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { projectDetail,projectEdit,projectArchive,projectRecoveryArchive,projectRecycle,projectRecovery,projectExit } from '@/api/project/list'
import { projectWorkFlow } from '@/api/project/task'
import { getFileUrl } from '@/api/common'
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
      // projectCover:'https://beta.vilson.xyz/static/image/default/project-cover.png',
      project:{
        projectName:'',
        projectCover:'',
        projectCoverUrl:'',
        isPrivate:0,
        projectDescription:'',
        owner_avatar:'',
        projectPrefix:'',
        isOpenPrefix:'',
        openTaskPrivate:'',
        isOpenBeginTime:''
      },
      headers:{
        'Authorization':'Bearer ' + this.$store.getters.access_token
      },
      uploadAction:'/mgr/teamwork/fileUpload/uploadProjectFile',
      doTaskWorkflowView: false,
      taskWorkflowList: [],
      taskWorkflow:{},
      currentTaskWorkflowRule: {
        taskWorkflowName: '',
        firstObj: '',//哪个列表任务
        firstAction: {//做什么
            action: -1,
            value: ''
        },
        firstResult: {//就
            action: -1,
            value: ''
        },
        lastResult: {//最后
            action: -1,
            value: ''
        },
        state: {//任务状态
            action: -1,
            value: -1
        },
      },
      taskStages:[],
      loading:false,
      loadingWorkflowRule: false,
      taskWorkflowRuleActions:[
        {id: -1, name: "请选择"},
        {id: 0, name: "增加任务"},
        {id: 1, name: "被完成"},
        //{id: 2, name: "被重做"},
        {id: 3, name: "设置执行人"},
        // {id: 4, name: "截止时间"},
        // {id: 5, name: "优先级"},
      ],
      projectMembers:[],
      taskWorkflowRuleTypes:[
        {id: -1, name: "请选择"},
        {id: 0, name: "自动流转到"},
        {id: 3, name: "默认指派给"},
      ],
      taskStates: [
        {id: -1, name: "不做修改"},
        {id: 1, name: "已完成"},
        {id: 2, name: "未完成"},
      ]
    };
  },
  watch: {
    code() {
      this.getProject();
    }
  },
  created() {
    this.getProject();
    this.projectWorkFlow()
  },
  mounted() {
  },
  computed: {
    canSaveTaskWorkflow() {
      return this.currentTaskWorkflowRule.taskWorkflowName.trim() && this.currentTaskWorkflowRule.firstObj && this.currentTaskWorkflowRule.firstAction.action != -1 && this.currentTaskWorkflowRule.firstResult.action != -1 && this.currentTaskWorkflowRule.firstResult.value;
    }
  },
  methods: {
    getProject(){
      this.loading = true
      projectDetail({id:this.code}).then(res=>{
        if(res.data.code==0){
          this.loading = false
          this.project = Object.assign({},this.project,res.data.data)
        }
      })
    },
    projectWorkFlow(){
      projectWorkFlow({id:this.code}).then(res=>{
        if(res.data.code==0){
          this.taskWorkflowList = res.data.data
        }
      })
    },
    workflowRuleChange(value, name) {
      if (name == 'firstAction.action') {
        this.currentTaskWorkflowRule.firstAction.value = '';
      }
      if (name == 'firstResult.value') {
        this.currentTaskWorkflowRule.lastResult.value = '';
      }
      if (name == 'firstResult.action') {
        this.currentTaskWorkflowRule.firstResult.value = '';
        this.currentTaskWorkflowRule.lastResult.value = '';
      }
    },
    saveTaskWorkflow(save = false) {
      if (this.currentTaskWorkflowRule.firstResult.action) {
          this.currentTaskWorkflowRule.lastResult.action = 0;
      } else {
          this.currentTaskWorkflowRule.lastResult.action = 3;
      }
      let submitData = {
          taskWorkflowName: this.currentTaskWorkflowRule.taskWorkflowName,
          taskWorkflowRules: JSON.stringify(this.currentTaskWorkflowRule)
      };
      if (save) {
          if (this.taskWorkflow) {
              // submitData.taskWorkflowCode = this.taskWorkflow.code;
              // EditTaskWorkflow(submitData).then(res => {
              //     this.getTaskWorkflowList();

              // });
          } else {
              // submitData.projectCode = this.code;
              // saveTaskWorkflow(submitData).then(res => {
              //     this.getTaskWorkflowList();
              // });
          }

      }
      this.doTaskWorkflowView = false;
    },
    getTaskList(){

    },
    doTaskWorkflow(taskWorkflow = null){
      this.taskWorkflow = taskWorkflow;
      this.getTaskList()
      if (taskWorkflow) {

      }else{
        this.currentTaskWorkflowRule = {
          taskWorkflowName: '',
          firstObj: '',//哪个列表任务
          firstAction: {//做什么
              action: -1,
              value: ''
          },
          firstResult: {//就
              action: -1,
              value: ''
          },
          lastResult: {//最后
              action: -1,
              value: ''
          },
          state: {//任务状态
              action: -1,
              value: -1
          },
          taskStates: [
              {id: -1, name: "不做修改"},
              {id: 1, name: "已完成"},
              {id: 2, name: "未完成"},
          ],
        };
      }
      this.doTaskWorkflowView = true;
    },
    quitProject(){
      let that = this;
      this.$confirm(`一旦你退出了该项目，你将不能查看任何关于该项目的信息。退出项目后，如果想重新加入，请联系项目管理员。`, '退出项目', {
        confirmButtonText: '确定退出',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        projectExit({projectId:this.project.id}).then(res=>{
          console.log(res);
        })
        // this.$message.info("功能暂未开放，敬请期待！")
      }).catch(() => {

      });
    },
    delProject(){
      if (!this.project.recycleFlag) {
        this.$confirm(`一旦将项目「${this.project.projectName}」放入回收站，所有与项目有关的信息将会被放入回收站`, '确定放入回收站？', {
          confirmButtonText: '放入回收站',
          cancelButtonText: '再想想',
          type: 'warning',
          confirmButtonClass:'el-button--danger'
        }).then(() => {
          projectRecycle(this.project).then(res=>{
            if(res.data.data && res.data.code==0){
              this.$message.success("移入回收站成功")
              this.$emit('changeStatus')
            }
          })
        }).catch(() => {

        });
      }else{
        this.$confirm(`恢复「${this.project.projectName}」后就可以正常使用了`, '确定恢复项目？', {
          confirmButtonText: '恢复项目',
          cancelButtonText: '再想想',
          type: 'warning',
        }).then(() => {
          projectRecovery(this.project).then(res=>{
            if(res.data.data && res.data.code==0){
              this.$message.success("恢复成功")
              this.$emit('changeStatus')
            }
          })
        }).catch(() => {

        });
      }
    },
    archiveProject(){
      if (!this.project.isArchive) {
        this.$confirm(`一旦将项目「${this.project.projectName}」归档，本项目和所含信息将会被移到「归档项目」内，其中的内容依然会被统计和搜索收录，归档项目可以随时恢复并继续使用。`, '归档项目', {
          confirmButtonText: '归档',
          cancelButtonText: '再想想',
          type: 'warning',
          confirmButtonClass:'el-button--danger'
        }).then(() => {
          projectArchive(this.project).then(res=>{
            if(res.data.data && res.data.code==0){
              this.$message.success("归档成功")
              this.$emit('changeStatus')
            }
          })
        }).catch(() => {

        });
      }else{
        this.$confirm(`取消归档「${this.project.projectName}」后就可以正常使用了`, '取消归档项目？', {
          confirmButtonText: '取消归档',
          cancelButtonText: '再想想',
          type: 'warning',
          confirmButtonClass:'el-button--danger'
        }).then(() => {
          projectRecoveryArchive(this.project).then(res=>{
            if(res.data.data && res.data.code==0){
              this.$message.success("取消归档成功")
              this.$emit('changeStatus')
            }
          })
        }).catch(() => {

        });
      }
    },
    saveProject(){
      projectEdit(Object.assign({},this.project)).then(res=>{
        if(res.data.code==0){
          this.$message.closeAll()
          this.$message.success("保存成功")
          this.$emit('update', this.project);
        }
      })
    },
    handleSuccess(response, file, fileList) {
      if(response.code == 0 ){
        this.project.projectCover = response.data.fileName
        getFileUrl({fileName:this.project.projectCover}).then(res=>{
          if(res.data.code==0){
            this.project.projectCoverUrl  = res.data.data.url
          }
        })
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'||file.type === 'image/jpg'||file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('图片不能超过2MB!')
      }
      return isLt2M && isJPG
    },
  }
};
</script>
<style lang="scss" scoped>
.project-config{
  /deep/.el-tabs__item{
    text-align: left;
    padding: 0px 20px 0px 0px;
  }
  /deep/.el-tabs__header,/deep/.el-tabs__nav-wrap,/deep/.el-tab-pane{
    height: 730px;
    min-width: 180px;
  }
  /deep/.el-tab-pane{
    overflow-y: auto;
    padding: 15px 15px 0px 0px;
    box-sizing: border-box;
  }
  /deep/.el-tabs__content{
    padding-left: 14px;
  }
  .tab-span{
    i{
      margin-right: 10px;
    }
  }
  .config-content{
    .content-item{
      display: flex;
      justify-content: space-between;
      flex: 1 1;
      margin-bottom: 24px;
      .infos{
        width: 100%;
        padding-right: 12px;

        /deep/.el-input-number{
          width: 100%;
          .el-input-number__decrease,.el-input-number__increase{
            display: none  !important;;
          }
          .el-input{
            .el-input__inner{
              padding: 0px 15px;
              text-align: left;
            }
          }
        }
        p {
          margin-top: 0;
          margin-bottom: 6px;
        }
        .item-title{
          font-size: 16px;
        }
        .item-tips {
          margin-bottom: 12px;
        }
        .cover-item {
          display: flex;

          img {
            width: 300px;
            height: 150px;
            border-radius: 3px;
          }
          .no-avatar{
            width: 300px;
            height: 150px;
            background-color: #c7c9cc;
            border-radius: 3px;
          }
          .cover-uploader {
            display: block;
            margin-left: 24px;

            .upload-tips {
              margin-top: 12px;
            }
          }
        }
      }
      &.task-workflow{
        .workflow-content {
          margin-top: 12px;
          .workflow-rule-item {
            margin-bottom: 16px;
            p {
              color: rgba(0, 0, 0, 0.45);
            }
            .el-select{
              width: 100%;
            }
          }
        }
        .task-workflow-item{
          display: flex;
          flex: 1 1 auto;
          padding: 12px 0;
          border-bottom: 1px solid #e8e8e8;
          &:last-child{
            border:none;
          }
          .task-workflow-name{
            display: flex;
            flex: 1;
          }
          a {
            text-decoration: none;
            background-color: transparent;
            outline: none;
            cursor: pointer;
            transition: color .3s;
          }
          a:hover {
            color: #40a9ff;
          }
        }
      }
    }
    &.task-config {
      .content-item {
        padding-bottom: 24px;
        padding-right: 16px;
        border-bottom: 1px solid #e5e5e5;
      }

      .prefix-input {
        width: 50%;
        margin-right: 24px;
      }
    }
  }
}
</style>
