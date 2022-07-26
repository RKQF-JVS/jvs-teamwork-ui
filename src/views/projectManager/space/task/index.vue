<template>
  <div class="task-main-box" v-loading="loading">
    <div class="top-bar-right">
      <!-- <div class="top-bar-view" @click="viewType=!viewType">
        <i class="el-icon-s-order" v-if="viewType"></i>
        <i class="el-icon-s-grid" v-else></i>
        {{viewType=='view'?'看板视图':'表格视图'}}
      </div>
      <el-divider direction="vertical"></el-divider>
      </el-date-picker> -->
      <div class="top-bar-search" :class="{'active':searchDrawer}" @click="showDrawer('search')">
        <i class="el-icon-search"></i>筛选
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="top-bar-user" :class="{'active':userDrawer}" @click="showDrawer('user')"><i class="el-icon-user"></i><span style="padding-left:5px;">{{projectMembers.length}}</span></div>
      <el-divider direction="vertical"></el-divider>
      <div class="top-bar-menu" :class="{'active':menuDrawer}" @click="showDrawer('menu')"><i class="el-icon-s-operation"></i>菜单</div>
    </div>
    <!--  :move="stageMove"  @update="stageSort" -->
    <draggable v-model="taskStages"
        :options="{group:'stages',filter:'.undraggables',handle:'.task-draggable-handle',ghostClass:'stage-ghost',animation: 200,forceFallback:false}"
        id="task-view-box" class="task-view-box" @sort="stageSort">
      <div class="task-item-box" v-for="(stage,index) in taskStages" :key="index" :id="stage.id">
        <div class="task-item-title task-draggable-handle">
          <div>{{stage.projectMouldName}} · {{stage.tasks.length}}</div>
          <div>
            <el-tooltip class="item" effect="dark" content="编辑任务列表" placement="top">
                <el-dropdown trigger="click" placement='bottom'  @command="handleCommand">
                  <i class="el-icon-more"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="iconfont icon-edit" :command="`editStage_`+stage.id+'_'+index">编辑列表</el-dropdown-item>
                    <el-dropdown-item icon="iconfont icon-user" :command="`setExecutor_`+stage.id+'_'+index">设置本列所有任务执行者</el-dropdown-item>
                    <el-dropdown-item icon="iconfont icon-delete" :command="`recycleBatch_`+stage.id+'_'+index">本列所有任务移到回收站</el-dropdown-item>
                    <el-dropdown-item icon="iconfont icon-delete" :command="`delStage_`+stage.id+'_'+index">删除列表</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip>
          </div>
        </div>
        <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false}}">
          <div class="task-item-content" :id="stage.id">
            <!-- 未完成列表 -->
            <draggable v-model="stage.unDoTaskStages"
              :options="{group:'task',ghostClass:'task-ghost',dragClass:'task-drag',fallbackClass:'task-drag',forceFallback:false}"
              @end="taskSort" class="task">
              <template v-for="(unDoItem,unDoIndex) in stage.unDoTaskStages">
                <!-- v-if="!unDoItem.canRead" -->
                <div class="task-card-item ui-sortable-handle" :id="unDoItem.id" @click.stop="taskDetail(unDoItem.id,unDoIndex)"
                  :class="showTaskPri(unDoItem.priorityLevel)" :key="unDoIndex" :index="unDoIndex">
                  <!-- <div class="task-priority bg-priority-0"></div> -->
                  <el-tooltip placement="top" :disabled="isShowCount(unDoItem.childCount,1)">
                    <template slot="content">
                      <!-- v-if="task.hasUnDone"  -->
                      <span style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                    </template>
                    <i class="card-check iconfont icon-kongcheck" :class="{'disabled': !isShowCount(unDoItem.childCount,1)}" @click.stop="taskDone(unDoItem,index,unDoIndex,1)"></i>
                  </el-tooltip>
                  <div class="task-card-item-detail">
                    <div class="task-card-item-info">
                      <div class="task-card-item-name" style="overflow-wrap: anywhere;white-space: initial;">
                        {{unDoItem.taskName }}
                      </div>
                      <el-tooltip placement="top">
                        <template slot="content">
                          <span style="font-size: 12px;">{{unDoItem.userDto.realName}}</span>
                        </template>
                        <img v-if="unDoItem.userDto.headImg" :src="unDoItem.userDto.headImg" width="24" height="24"/>
                      </el-tooltip>
                    </div>
                    <div class="task-card-item-menu muted">
                      <span class="icon-wrapper" :style="{color: getStatusColor(unDoItem.executeStatus), fontSize: '12px !important'}" v-if="unDoItem.executeStatus!='0'">{{findByValue(unDoItem.executeStatus)}}</span>
                      <span class="icon-wrapper label" :class="showTimeLabel(unDoItem.endTime)" v-if="unDoItem.endTime" style="font-size:12px !important;">
                        <span :title="unDoItem.endTime" style="font-size:12px !important;">
                            {{ showTaskTime(unDoItem.beginTime,unDoItem.endTime)}}
                        </span>
                      </span>
                      <span class="icon-wrapper tag-list-item-title" v-if="unDoItem.isRemark">
                        <i class="iconfont icon-beizhu"></i>
                      </span>
                      <span class="icon-wrapper tag-list-item-title" v-if="unDoItem.childCount && isShowCount(unDoItem.childCount,0)">
                        <i class="el-icon-s-fold"></i>
                        <span style="margin-left:2px;">{{unDoItem.childCount}}</span>
                      </span>
                      <span class="icon-wrapper tag-list-item-title muted" v-for="(item,index) in unDoItem.projectTaskTags" :key="index">
                        <div class="badge-item-dot" :class="`badge-item-${item.color}`"></div>
                        {{item.name}}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
            <!-- 创建任务卡片 -->
            <div class="task-create-card" v-show="stage.showTaskCard" :id="'card'+index">
              <div class="task-create-card-content">
                <el-input type="textarea" :ref="`inputTaskName${index}`" v-model="task.name" placeholder="任务内容"  :autosize="{ minRows: 4}" style="padding: 10px;box-sizing: border-box;"></el-input>
                <!-- 占行，可能设置执行人 -->
                <div class="task-executor-set">
                  <el-dropdown trigger="click" style="width:100%;" @command="setExecutorMember">
                    <div class="el-dropdown-link">
                      <img :src="defaultExecutor.headImg" width="32px" height="32px" style="border-radius: 50%;">
                      <span class="user-name">{{defaultExecutor.realName}}</span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(item,index) in projectMembers" :key="index" :command="item">
                        <div class="check-member-list">
                          <div>
                            <img :src="item.memberInfo.headImg" width="32px" height="32px" style="border-radius: 50%;">
                            <span>{{item.memberInfo.realName}}</span>
                          </div>
                          <i class="el-icon-check" v-if="defaultExecutor.id == item.memberInfo.id"></i>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="task-submit-set">
                  <jvs-button type="default" size="medium" @click="showTaskCard(index,false)">取消</jvs-button>
                  <jvs-button type="primary" size="medium" @click="createTaskItme(stage.id,index)" :loading="createTaskLoading" :disabled="!task.name" :class="{'disabled-btn':!task.name}">创建</jvs-button>
                </div>
              </div>
            </div>
            <!-- 完成列表 -->
            <draggable v-model="stage.doneTasks"
              :options="{group:'task-done',ghostClass:'task-ghost',dragClass:'task-drag',fallbackClass:'task-drag',forceFallback:false}"
              @end="taskSort"
              class="task">
                <template v-for="(doItem,doIndex) in stage.doneTasks">
                  <div class="task-card-item ui-sortable-handle task-do" @click.stop="taskDetail(doItem.id,doIndex)" :key="doIndex" :index="doIndex" v-if="!doItem.canRead">
                    <i class="card-check iconfont icon-check" @click.stop="taskDone(doItem,index,doIndex,0)"></i>
                    <div class="task-card-item-detail">
                      <div class="task-card-item-info">
                        <div class="task-card-item-name" style="overflow-wrap: anywhere;white-space: initial;">
                          {{doItem.taskName }}
                        </div>
                        <el-tooltip placement="top">
                          <template slot="content">
                            <span style="font-size: 12px;">{{doItem.userDto.realName}}</span>
                          </template>
                          <img v-if="doItem.userDto.headImg" :src="doItem.userDto.headImg" width="24" height="24"/>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </template>
            </draggable>
            <!-- 添加按钮 -->
            <div class="task-item-btn-box"  @click="showTaskCard(index,true)" v-if="!stage.showTaskCard">
              <i class="el-icon-circle-plus-outline"></i>添加任务
            </div>
          </div>
        </vue-scroll>
      </div>
      <div  class="task-item-box undraggables task-create-box">
        <div v-show="!showCreateTask" class="task-create">
          <span @click="changeShowCreateTask(1)">
            <i class="el-icon-plus"></i>
            新建任务列表
          </span>
        </div>
        <div v-show="showCreateTask" class="task-create-input">
          <el-input v-model="createTaskName" placeholder="新建任务列表" @keyup.enter.native="creteTask()" autofocus ref="createTaskInput"></el-input>
          <div class="task-create-input-button">
            <span @click="changeShowCreateTask(0)" class="task-create-cancal">取消</span>
            <jvs-button type="primary" @click="creteTask">保存</jvs-button>
          </div>
        </div>
      </div>
    </draggable>
    <!-- 筛选 -->
    <taskDrawer title="任务筛选" :display.sync="searchDrawer"  :inner="true" :width="'333px'" :mask="false">
      <taskSearch @search="taskSearchAction"></taskSearch>
    </taskDrawer>
    <!-- 项目成员 -->
    <taskDrawer title="项目成员" :display.sync="userDrawer"  :inner="true" :width="'333px'" :mask="false">
      <div class="user-search">
        <el-input v-model="userSearch" placeholder="输入昵称或邮箱查找">
          <template slot="prefix">
            <i class="el-icon-search"></i>
          </template>
        </el-input>
      </div>
      <div class="user-add-user member-list-item" @click="openAddNewUser">
        <el-avatar icon="el-icon-plus" class="user-avater"></el-avatar>
        <span>邀请新成员</span>
      </div>
      <div class="member-user-list member-list-item" v-for="(item,index) in projectMembers" :key="index">
        <el-avatar icon="el-icon-plus" class="user-avater" :src="item.memberInfo.headImg"></el-avatar>
        <div class="member-user-info">
          <div class="member-user-email-name">
            <span class="name">{{item.memberInfo.realName}}</span>
            <!-- <span class="email">57087@qq.com</span> -->
          </div>
          <div class="menber-user-info-opera muted" v-if="!item.isOwner" @click="delMember(item,index)">
            <i class="el-icon-user"></i>
            <span>移除</span>
          </div>
        </div>
      </div>
      <el-empty v-if="projectMembers.length==0"></el-empty>
    </taskDrawer>
    <!-- 菜单 -->
    <taskDrawer title="项目设置" :display.sync="menuDrawer"  :inner="true" :width="'333px'" :mask="false">
      <div style="padding-top:6px;"></div>
      <div v-for="(item,index) in projectSetting" :key="index" @click="openTypeFun(item)" class="seeting-item">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </div>
    </taskDrawer>
    <!-- 邀请新成员 -->
    <projectMember v-model="addNewUserDialogVisible" v-if="addNewUserDialogVisible" :projectId="$route.params.taskId" @changeMember="getProjectMembers"></projectMember>
    <!-- 项目设置 -->
    <el-dialog :title="projectModal.modalTitle"
      :visible.sync="projectModal.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="800px"
      top="5vh"
      :modal="true"
    >
      <projectConfig :code="$route.params.taskId" v-if="projectModal.modalStatus"  @update="updateProject" @changeStatus="changeStatus"></projectConfig>
    </el-dialog>
    <!-- 标签 -->
    <el-dialog :title="taskTagModal.modalTitle"
      :visible.sync="taskTagModal.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="800px"
      top="5vh"
      :modal="true"
    >
      <taskLabel v-if="taskTagModal.modalStatus" :code="$route.params.taskId"></taskLabel>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog :title="recycleModal.modalTitle"
      :visible.sync="recycleModal.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="800px"
      top="5vh"
      :modal="true"
    >
      <projectRecycle v-if="recycleModal.modalStatus" :code="code" @refreshList="getTaskStages(false)"></projectRecycle>
    </el-dialog>
    <!-- 加载详情的router-view -->
    <router-view></router-view>
    <!-- 编辑任务列表 -->
    <el-dialog :title="stageModal.modalTitle"
      :visible.sync="stageModal.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="360px"
      top="5vh"
      :modal="true"
      :before-close="beforeClose"
    >
      <el-form :model="stagForm" :rules="rules" ref="form" style="padding:20px 20px 1px 0;">
        <el-form-item label="" prop="name">
          <el-input ref="inputStageTitle" v-model="stagForm.name" placeholder="列表标题"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="action-btn pull-right">
            <a type="text" class="cancel-text muted" @click="beforeClose">
              取消
            </a>
            <el-button type="primary" size="small" @click="editStage"  class="middle-btn">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 设置任务执行者 -->
    <el-dialog :title="projectMemberModal.modalTitle"
      :visible.sync="projectMemberModal.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="360px"
      top="5vh"
      :modal="true"
      :before-close="beforeCloseMember"
    >
      <vue-scroll v-if="projectMemberModal.modalStatus" :ops="{bar: {background: '#cecece'}}" style="height:420px;">
        <div class="member-list">
            <div v-for="(item,index) in executeMemberList" :key="index" class="customer-list-item">
              <div class="customer-content">
                <el-avatar size="medium" :src="item.memberInfo.headImg" icon="el-icon-user"></el-avatar>
                <div class="customer-info">
                  <div>{{item.memberInfo.realName}}</div>
                  <!-- <div>54552390@qq.com</div> -->
                </div>
              </div>
              <div class="action-box">
                <el-button size="small" class="dashed btn-sm " icon="el-icon-user" @click="setExecutor(item)">设置</el-button>
              </div>
            </div>
        </div>
      </vue-scroll>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import taskDrawer from './taskDrawer'
import taskSearch from '@/components/project/taskSearch.vue'
import projectMember from '@/components/project/projectMember.vue'
import projectConfig from '@/components/project/projectConfig.vue'
import taskLabel from '@/components/project/taskLabel.vue'
import projectRecycle from '@/components/project/projectRecycle.vue'
import { projectDetail } from '@/api/project/list'
import { projectTaskListMould,projectTaskListSave,projectTaskListEdit,projectTaskListDel,projectTaskRecycleBatch,
  projectTaskSave,projectTaskEdit,projectTaskMouldSort,projectTaskSort,proejctTaskDone,projectTaskAssignExecutorBatch } from '@/api/project/task'
import { getProjectMember,projectMembers,projectMemberDel } from '@/api/project/member'
import { getStore } from "@/util/store.js";
import { formatTaskTime } from '@/util/date'
import { COMMON } from '@/const/common'
import moment from 'moment'
export default {
  components: {
    draggable,taskDrawer,taskSearch,projectMember,projectConfig,taskLabel,projectRecycle
  },
  props: {},
  data() {
    return {
      viewType:true,
      taskStages:[],
      showCreateTask:false,
      // 新建任务卡片对象
      task:{
        name:'',
      },
      // 新建任务名称
      createTaskName:'',
      // 搜索抽屉变量
      searchDrawer:false,
      menuDrawer:false,
      userDrawer:false,
      // 项目人员搜索
      userSearch:'',
      projectSetting:[
        {
          name:"项目设置",
          icon:'el-icon-setting',
          type:'set',
          disabled:false
        },{
          name:"标签",
          icon:'el-icon-link',
          type:'label',
          disabled:false
        }, {
          name:"查看回收站",
          icon:'el-icon-delete',
          type:'recycle',
          disabled:false
        },{
          name:"下载导入任务模板",
          icon:'el-icon-download',
          type:'',
          disabled:true
        }, {
          name:"上传文件导入任务",
          icon:'el-icon-upload2',
          type:'',
          disabled:true
        },{
          name:"导出任务",
          icon:'el-icon-tickets',
          type:'',
          disabled:true
        },{
          name:"复制项目",
          icon:'el-icon-document-copy',
          type:'copy',
          disabled:true
        },{
          name:"保存为项目模板",
          icon:'el-icon-document',
          type:'save',
          disabled:true
        }
      ],
      // 添加新成员
      addNewUserDialogVisible:false,
      /*项目设置*/
      projectModal: {
        modalStatus: false,
        modalTitle: '项目设置',
      },
      /*任务标签*/
      taskTagModal: {
        modalStatus: false,
        modalTitle: '任务标签',
      },
      /*回收站*/
      recycleModal: {
        modalStatus: false,
        modalTitle: '查看回收站',
      },
      // 编辑任务列表
      stageModal: {
        stageCode: '',
        stageIndex: 0,
        modalStatus: false,
        confirmLoading: false,
        modalTitle: '编辑列表',
      },
      projectMembers: [], //项目成员列表
      projectMembersCopy: [], //项目成员列表副本
      defaultExecutor: {},//默认执行人
      /*项目成员*/
      projectMemberModal: {
        loading: false,
        currentStageIndex: 0,
        modalStatus: false,
        modalTitle: '设置任务执行者',
      },
      stagForm: {
        name:''
      },
      rules:{
        name:[{ required: true, message: '请输入列表标题' }]
      },
      project:{},
      code:this.$route.params.taskId,
      loading:false,
      createTaskLoading:false,
      preItem:'',
      nextItem:'',
      stageSortList:[],
      taskStatusList: COMMON.TASK_STATUS,
      executeMemberList:[], //设置执行者列表
    };
  },
  watch: {
    userSearch(newVal,oldVal){
      if(!newVal){
        this.projectMembers = JSON.parse(JSON.stringify(this.projectMembersCopy))
      }
      this.projectMembers = this.projectMembers.filter(item => item.memberInfo.realName.indexOf(this.userSearch) != -1);
    },
    $route(to,from){
      if (this.code != to.params.code) {
        this.code = this.$route.params.taskId
        this.defaultExecutor = getStore({name: 'userInfo'})
        this.getProject()
        this.getProjectMembers()
        this.init()
      }
    }
  },
  created() {
    this.defaultExecutor = getStore({name: 'userInfo'})
    this.getProject()
    this.getProjectMembers()
    this.init()
  },
  mounted() {},
  computed: {},
  methods: {
    isShowCount(val,type){
      let arr = val.split("/")
      if(type==1){
        if(arr[0] == arr[1]){
          return true
        }else{
          return false
        }
      }else{
        if(arr[0]!=0&&arr[1]!==0){
          return true
        }else{
          return false
        }
      }
    },
    init(){
      this.getTaskStages()
    },
    getProjectMembers(){
      projectMembers({id:this.code}).then(res=>{
        if(res.data.code == 0){
          this.executeMemberList = res.data.data.records
          this.projectMembers = res.data.data.records
          this.projectMembersCopy = res.data.data.records
        }
      })
    },
    getProject(){
      projectDetail({id:this.code}).then(res=>{
        if(res.data.code==0){
          this.project = res.data.data
        }
      })
    },
    getTaskStages(loading = true){
      this.loading = loading
      this.taskStages = []
      projectTaskListMould({projectId:this.code,type:1}).then(res=>{
        if(res.data.code==0){
          this.taskStages = res.data.data
          this.taskStages.forEach((item,index) => {
            // const doneTasks = item.childList.filter(citem => { return citem.executeStatus==1 })
            // const unDoTaskStages = item.childList.filter(citem => { return citem.executeStatus!=1 })
            const unDoTaskStages = item.childDefaultList.unfinished_task
            const doneTasks = item.childDefaultList.finish_task
            item.tasks = [...unDoTaskStages,...doneTasks]
            item.doneTasks = doneTasks
            item.unDoTaskStages = unDoTaskStages
            item.showTaskCard = false
          });
        }
      }).finally(res=>{
        this.loading = false
      })
    },
    showTaskCard(index,val){
      this.taskStages[index].showTaskCard = val
      this.$forceUpdate()
    },
    beforeCloseMember(){
      this.projectMemberModal.modalStatus = false
    },
    editStage() {
      let stage = this.stagForm;
      if (!stage.name) {
          this.$message.warning('请输入列表名称', 2);
          return false;
      }
      projectTaskListEdit({name: stage.name, id: this.stageModal.stageCode}).then((res) => {
        if(res.data.code==0){
          this.taskStages[this.stageModal.stageIndex].projectMouldName = stage.name;
          this.stageModal.modalStatus = false;
        }
      });
    },
    beforeClose(){
      this.$refs.form.resetFields();
      this.stageModal.modalStatus = false
    },
    setExecutorMember(item){
      this.defaultExecutor = item.memberInfo
    },
    handleCommand(command){
      let actionKeys = command.split('_');
      const stageCode = actionKeys[actionKeys.length - 2];
      const stageIndex = actionKeys[actionKeys.length - 1];
      const actionKey = actionKeys[0];
      switch (actionKey) {
        case 'editStage':
          this.stageModal.stageCode = stageCode;
          this.stageModal.stageIndex = stageIndex;
          this.$nextTick(() => {
            this.stagForm = Object.assign({},{name: this.taskStages[stageIndex].projectMouldName});
            this.$refs.inputStageTitle.focus();
          });
          this.stageModal.modalStatus = true;
          break;
        case 'recycleBatch':
          this.$confirm('您确定要把列表下的所有任务移到回收站吗？','移到回收站',{
            confirmButtonText: '移到回收站',
            cancelButtonText: `再想想`,
            confirmButtonClass:'el-button--danger',
            type: 'warning'
          }).then(() => {
            this.taskStages[stageIndex].tasks = [];
            projectTaskRecycleBatch({mouldId:stageCode}).then(res=>{
              if(res.data.code==0){
                this.$message.success("已移除所有任务")
                this.taskStages[stageIndex].doneTasks = []
                this.taskStages[stageIndex].unDoTaskStages = []
              }
            })
          }).catch(() => {

          });
          break;
        case 'setEndTime':
          break;
        case 'setExecutor':
          this.projectMemberModal.currentStageIndex = stageIndex;
          this.projectMemberModal.modalStatus = true
          break;
        case 'delStage':
          if (this.taskStages[stageIndex].tasks.length > 0) {
            this.$alert('请先清空此列表上的任务，然后再删除这个列表','删除列表',{
              confirmButtonText: '确定',
              type:'warning',
              showClose:false
            });
            return false;
          }
          this.$confirm('您确定要永远删除这个列表吗？','删除列表',{
            confirmButtonText: '删除',
            cancelButtonText: `再想想`,
            confirmButtonClass:'el-button--danger',
            type: 'warning'
          }).then(() => {
            projectTaskListDel(this.taskStages[stageIndex]).then(res=>{
              if(res.data.code == 0){
                this.taskStages.splice(stageIndex,1)
              }
            })
          }).catch(() => {

          });
          break;
      }
    },
    // 调用对应的方法
    openTypeFun(item){
      if(item.disabled){
        this.$message.info("此功能尚未开发，敬请期待！")
        return
      }
      switch(item.type){
        case 'recycle':
          this.recycleModal.modalStatus = true
          break;
        case 'set':
          this.projectModal.modalStatus = true
          break;
        case 'save':
          break;
        case 'copy':
          break;
        case 'label':
          this.taskTagModal.modalStatus = true
          break;
      }
    },
    // 搜索任务改变
    taskSearchAction(value){
      console.log(value)
    },
    showDrawer(type){
      switch(type){
        case 'search':
          this.userDrawer = false
          this.menuDrawer = false
          setTimeout(() => {
            this.searchDrawer = !this.searchDrawer;
          }, 100);
          break;
        case 'user':
          this.searchDrawer = false
          this.menuDrawer = false
          setTimeout(() => {
            this.userDrawer = !this.userDrawer;
          }, 100);
          break;
        case 'menu':
          this.userDrawer = false
          this.searchDrawer = false
          setTimeout(() => {
            this.menuDrawer = !this.menuDrawer;
          }, 100);
          break;
      }
    },
    showTaskPri(pri) {
      return {
          'warning': pri == 1,
          'danger': pri == 2,
      }
    },
    taskSort(event) {
      const toStageCode = event.to.parentNode.getAttribute('id');
      let codes = [];
      this.$nextTick(()=>{
        setTimeout(() => {
          for (let i = 0, len = event.to.children.length; i < len; i++) {
            codes.push(event.to.children[i].id)
          }
          projectTaskSort({taskIds:codes,taskMouldId:toStageCode}).then(res=>{
            if(res.data.code==0){
              // 暂时不需要通过重新获取mouldList来获取新的排列
              // setTimeout(()=>{
              //   this.getTaskStages(false)
              // },0)
            }
          })
        }, 1);
        this.$forceUpdate()
      })

    },
    creteTask(){
      this.$message.closeAll()
      if (!this.createTaskName) {
        this.$message.warning('请输入列表名称');
        return false;
      }
      projectTaskListSave({name:this.createTaskName,projectId:this.code}).then(res=>{
        if(res.data.code==0){
          this.taskStages.push({
            unDoTaskStages:[],
            doneTasks:[],
            childList:[],
            tasks:[],
            projectMouldName:res.data.data.name,
            projectId:res.data.data.projectId,
            id:res.data.data.id
          })
          this.changeShowCreateTask(0)
        }
      })
    },
    createTaskItme(id,index){
      if(this.createTaskLoading){
        this.$message.warn("正在添加任务，请稍后...")
        return
      }
      this.createTaskLoading = true
      projectTaskSave({
        pid:-1,
        mouldId:id,
        projectId:this.code,
        executeMemberId:this.defaultExecutor.id,
        name:this.task.name
      }).then(res=>{
        if(res.data.code==0){
          this.$message.success("添加任务成功")
          const Obj = {
            taskName:res.data.data.name,
            id:res.data.data.id,
            projectTaskMouldId:res.data.data.mouldId,
            childCount:'0/0',
            userDto:{}
          }
          this.taskStages[index].tasks.push(Obj)
          this.taskStages[index].unDoTaskStages.push(Obj)
          this.task.name = ''
          this.showTaskCard(index,false)
        }
      }).finally(res=>{
        this.createTaskLoading = false
      })
    },
    // type 1显示，0隐藏
    changeShowCreateTask(type){
      if(type==1){
        this.showCreateTask = true
        setTimeout(()=>{
          this.$refs.createTaskInput.focus()
        },10)
      }else{
        this.showCreateTask = false
        this.createTaskName = ''
      }
    },
    taskDetail(code, stageIndex) {
      // ?from=${stageIndex}
      this.$router.push(`${this.$route.path}/detail/${code}`);
    },
    stageMove(evt) {
      this.stageSortList = []
      this.preItem = evt.draggedContext.element;
      this.nextItem = evt.relatedContext.element;
      for (let i = 0, len = evt.to.children.length-1; i < len; i++) {
        this.stageSortList.push(evt.to.children[i].getAttribute('id'));
      }
    },
    stageSort(e) {
      const domArr = document.getElementById("task-view-box").children
      for (let i = 0, len = domArr.length-1; i < len; i++) {
        this.stageSortList.push(domArr[i].getAttribute('id'));
      }
      projectTaskMouldSort(this.stageSortList).then(res=>{
        if(res.data.code == 0){
        }
      })
    },
    // 打开添加新用户弹窗
    openAddNewUser(){
      this.addNewUserDialogVisible = true
    },
    updateProject(data){
      this.project = Object.assign({},data)
    },
    changeStatus(){
      this.projectModal.modalStatus = false
    },
    taskDone(item, stageIndex, taskIndex, done) {
      console.log(item,stageIndex,taskIndex,done)
      if(done){
        if(!this.isShowCount(item.childCount,1)){
          return false
        }
        this.taskStages[stageIndex].unDoTaskStages.splice(taskIndex,1)
        this.taskStages[stageIndex].doneTasks.push(item)
      }else{
        this.taskStages[stageIndex].doneTasks.splice(taskIndex,1)
        this.taskStages[stageIndex].unDoTaskStages.push(item)
      }
      this.$forceUpdate()
      proejctTaskDone({
        taskId:item.id,
        finishStatus:done
      }).then(res=>{
        if(res.data.code==0){
          this.$message.closeAll()
          this.$message.success("修改任务状态成功")
        }
      })
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
    showTaskTime(time, timeEnd) {
      return formatTaskTime(time, timeEnd);
    },
    getStatusColor(status) {
      const statusInfo = this.taskStatusList.find(item => item.id == status);
      if (statusInfo) {
        return statusInfo.color;
      }
      return '';
    },
    findByValue(value){
      const statusInfo = this.taskStatusList.find(item => item.id == value);
       if (statusInfo) {
        return statusInfo.name;
      }
      return '';
    },
    setExecutor(member){
      let stage = this.taskStages[this.projectMemberModal.currentStageIndex];
      let taskCodes = []
      stage.childList.forEach((v)=>{
        // if(v.canRed){
          taskCodes.push(v.id)
        // }
      })
      if(taskCodes.length>0){
        projectTaskAssignExecutorBatch({executorId:member.memberId,taskIds:taskCodes}).then(res=>{
          this.projectMemberModal.modalStatus = false;
          if(res.data.code == 0 ){
            this.getTaskStages()
          }
        })
      } else {
        this.projectMemberModal.modalStatus = false;
      }
    },
    delMember(item,index){
      const h = this.$createElement;
      this.$msgbox({
        title:'',
        message: h('p', null, [
          h('span', null, `您确定要将「${item.memberInfo.realName}」从项目中移除吗？`),
          h('div', { style: 'color: teal' }, '移除后该成员将不能查看任何关于该项目的信息')
        ]),
        showClose:false,
        showCancelButton: true,
        confirmButtonText: '移除',
        cancelButtonText: '再想想',
        confirmButtonClass:'el-button--danger',
        type: 'warning'
      }).then(() => {
        projectMemberDel({
          memberName:item.memberInfo.realName,
          memberId:item.memberInfo.id,
          projectId:this.code
        }).then(res=>{
          if(res.data.code==0){
            this.executeMemberList.splice(index,1)
            this.projectMembers.splice(index,1)
            this.projectMembersCopy.splice(index,1)
          }
        })
      }).catch(() => {
      });
    }
  }
};
</script>
<style lang="scss">
.task-main-box{
  // position: inherit !important;
  overflow: hidden;
  .top-bar-right{
    position: fixed;
    top: 60px;
    right: 0px;
    display: flex;
    align-items: center;
    // justify-content: center;
    justify-content: end;
    height: 51px;
    font-size: 14px;
    .active{
      color: #2d8cf0 !important;
    }
    .top-bar-view,.top-bar-search,.top-bar-user,.top-bar-menu{
      cursor: pointer;
      color: grey;
      &:hover{
        color: #409EFF;
      }
    }
    .top-bar-menu{
      padding-right: 15px;
    }
  }
  .task-view-box{
    overflow: auto;
    padding: 10px;
    height: calc(100% - 20px);
    width: calc(100vw - 10px);
    overflow-x: auto;
    overflow-y: hidden;
    // display: flex;
    background: white;
    white-space: nowrap;
    .stage-ghost {
      background: #e5e5e5;
      div {
        display: none;
      }
    }
    .task-item-box{
      height: 100%;
      width: 295px;
      background-color: #eee;
      border-radius: 3px;
      margin-right: 10px;
      position: relative;
      display: inline-flex;
      flex-direction: column;
      .task-item-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 14px;
        cursor: move;
        div{
          .el-tooltip{
            .el-icon-more{
              cursor: pointer;
            }
          }
        }
      }
      .task-item-content{
        .task{
          transition: opacity 0.08s ease-out;
          opacity: 1;
          min-height: 5px;
          padding: 0 5px;
          position: relative;
          .task-card-item{
            padding: 0;
            background-color: #fff;
            border-radius: 3px;
            box-shadow: 0 1px 2px #0000001a;
            cursor: pointer;
            min-height: 52px;
            margin: 0 8px 8px;
            display: flex;
            overflow: hidden;
            &.task-ghost {
              border-left: 3px solid #e5e5e5 !important;
              background: #e5e5e5;
              * {
                visibility: hidden;
                //display: none;
              }
            }
            .card-check {
              margin: 14px 6px 0 6px;
            }
            .task-card-item-detail{
              padding: 10px 0px;
              flex: 1 1 auto;
              display: flex;
              flex-direction: column;
              .task-card-item-info{
                display: flex;
                flex: 1 1 auto;
                // align-items: center;
                justify-content: space-between;
                .task-card-item-name{
                  margin: 0px 12px 0 0;
                  padding: 0;
                  border: none;
                  background: none;
                  cursor: pointer;
                  word-wrap: break-word;
                  overflow: hidden;
                  transition: color 218ms ease;
                  flex: 1 1 auto;
                }
                img{
                  margin: 0 14px 0 0;
                  border-radius: 50%;
                }
              }
              .task-card-item-menu{
                font-size: 14px;
                margin: 2px 10px 0 0;
                display: flex;
                flex: 1 1 auto;
                align-items: center;
                flex-wrap: wrap;
                .tag-list-item-title{
                  margin: 2px 6px 0 0;
                  font-size: 14px;
                }
              }
            }
          }
          .task-do{
              .card-check{
                color: #a6a6a6;
                cursor: pointer;
              }
              .task-card-item-detail{
                opacity: .64;
                .task-card-item-name{
                  color: #a6a6a6;
                  text-decoration: line-through;
                }
              }
            }
        }
        .task-create-card{
          padding: 0px 8px 8px;
          .task-create-card-content{
            background-color: white;
            border-radius: 2px;
            .task-executor-set{
              cursor: pointer;
              height: 49px;
              padding: 0 10px 5px;
              box-sizing: border-box;
              // height: 10px;
              border-bottom: 1px solid #eee;
              display: flex;
              align-items: center;
              .el-dropdown-link{
                display: flex;
                align-items: center;
                .user-name{
                  padding-left:10px;
                  color:#1890ff;
                }
              }
            }
            .task-submit-set{
              margin-top: 10px;
              padding-left: 10px;
              padding-bottom: 10px;
              display: flex;
              button{
                width: 125px;
              }
            }
          }
        }
        .task-item-btn-box{
          background: #fff;
          height: auto;
          margin: 0 12px;
          border-radius: 3px;
          padding: 5px 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: #a6a6a6 !important;
          cursor: pointer;
          margin-bottom: 10px;
          i{
            margin-right: 10px;
          }
          &:hover{
            color: #3da8f5 !important;
          }
        }
      }
      .task-create{
        display: flex;
        align-items: center;
        padding: 14px 14px;
        background-color: #eee;
        border-radius: 3px;
        span{
          cursor: pointer;
          &:hover{
            color: #3da8f5 !important;
          }
        }
      }
      .task-create-input{
        padding: 8px 14px 14px;
        background-color: #eee;
        border-radius: 3px;
        .task-create-input-button{
          text-align: right;
          padding-top: 10px;
          .task-create-cancal{
            margin-right: 24px;
            font-size: 14px;
            cursor: pointer;
            color:#a6a6a6;
            &:hover{
              color: #40a9ff;
            }
          }
        }
      }
    }
    .task-create-box{
      height: auto;
      cursor: default;
    }
  }
}
</style>
<style lang="scss">
.task-drag {
  cursor: pointer;
  background: red;
}
/*紧急程度一般*/
.ui-sortable-handle:hover{
  border-left: 3px solid #a6a6a6;
}

.ui-sortable-handle.warning {
  border-left: 3px solid #ff9900;
}

.ui-sortable-handle.danger {
  border-left: 3px solid #ed3f14;
}

.ui-sortable-handle.warning:hover {
  border-left: 3px solid #ff9900;
}

.ui-sortable-handle.danger:hover {
  border-left: 3px solid #ed3f14;
}

.ui-sortable-handle {
  border-left: 3px solid #fff;
  -webkit-transition-property: border-left;
  -webkit-transition-duration: 0.5s;
  -webkit-transition-timing-function: ease;
}

</style>
<style lang="scss">
.user-search{
  padding: 15px 24px;
  .el-input__prefix{
    display: flex;
    align-items: center;
  }
}
.user-add-user{
  cursor: pointer;
  display: flex;
  align-items: center;
}
.member-list-item{
  padding: 12px 24px;
  &:hover{
    background-color: #eee;
    cursor: pointer;
  }
}
.user-avater{
  margin-right: 16px;
}
.member-user-list{
  display: flex;
  align-items: center;
  .member-user-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    .member-user-email-name{
      display: flex;
      flex-direction: column;
      justify-content: center;
      .email{
        color: rgba(0,0,0,.45);
        font-size: 14px;
        line-height: 22px;
      }
      .name{
        margin-bottom: 4px;
        color: #333;
        font-size: 14px;
        line-height: 22px;
      }
    }
    .menber-user-info-opera{
      i{
        margin-right: 3px;
      }
      &:hover{
        color: #3da8f5;
      }
    }
  }
}
.seeting-item{
  display: block;
  cursor: pointer;
  padding: 5px 15px;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #383838;
  font-weight: 600;
  height: 30px;
  display: flex;
  align-items: center;
  i{
    width: 24px;
    margin-right: 5px;
  }
  &:hover {
    background: #eeeeee;
  }
}
</style>
<style lang="scss">
.task-view-box::-webkit-scrollbar {/*滚动条整体样式*/
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
.check-member-list{
  width:234px;
  display: flex;
  align-items: center;
  padding: 10px 0px;
  justify-content: space-between;
  flex: 1 1;
}
.check-member-list>div{
  display: flex;
  align-items: center;
  flex: 1 1;
  span{
    padding-left: 10px;
  }
}
</style>
