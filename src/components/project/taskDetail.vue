<template>
  <div class="task-detail-box" v-loading="loading" ref="taskDetailBox">
    <div class="task-header" :class="{'disabled': task.recycleFlag==1}">
      <span class="head-title" v-if="task.recycleFlag==0">
        <span v-if="useOptionChain(task)['prentTask?.id'] && task.pid!=-1" style=" display: flex;align-items: center;">
            <span class="muted">属于任务：</span>
            <el-breadcrumb separator=">" class="breadcrumb text-default">
              <el-breadcrumb-item v-for="parent in [task.prentTask]" :key="parent.id">
                <a class="text-default" style="cursor: pointer;" @click="init(parent.id)">{{parent.name}}</a>
              </el-breadcrumb-item>
            </el-breadcrumb>
        </span>
        <span v-else>{{task.projectInfo.projectName}} · {{useOptionChain(task)['projectTaskMould?.name']}}</span>
      </span>
      <span class="head-title muted" v-else>
          <i class="el-icon-delete"></i>&nbsp;
          <span>任务已在回收站中，不可修改</span>
      </span>
      <span class="header-action text-right">
        <template v-if="task.recycleFlag==0">
          <el-tooltip placement="top">
            <template slot="content" >
                <span>复制任务链接</span>
            </template>
            <a class="action-item muted" v-clipboard="taskLink" @click="copyLink"><i class="el-icon-link"></i></a>
          </el-tooltip>
          <el-tooltip :mouseEnterDelay="0.5" placement="top">
            <template slot="content">
                <span>{{task.likeMine?'取消点赞':'点个赞'}}</span>
            </template>
            <a class="action-item muted" :class="{'active': task.likeMine}" @click="like(!task.likeMine)">
              <i class="iconfont icon-dianzan"/>
              <span v-show="task.thumbsUpCount">{{task.thumbsUpCount}}</span>
            </a>
          </el-tooltip>
          <el-tooltip :mouseEnterDelay="0.5" placement="top">
            <template slot="content">
              <span>打开菜单</span>
            </template>
            <el-dropdown trigger="click" :hide-on-click="false" @command="doTask" ref="menuDropDown">
              <a class="action-item muted"><i class="el-icon-more"/></a>
              <el-dropdown-menu slot="dropdown" style="color: grey;">
                <el-dropdown-item icon="iconfont icon-copy" command="copy">复制任务 *</el-dropdown-item>
                <el-dropdown-item icon="iconfont icon-cc-copy" command="move">移动任务 *</el-dropdown-item>
                <el-dropdown-item icon="el-icon-star-off" command="star">
                  <span v-if="task.collectMine">取消收藏</span>
                  <span v-else>收藏任务</span>
                </el-dropdown-item>
                <el-dropdown-item icon="iconfont icon-delete"  command="recycle">移到回收站</el-dropdown-item>
                <el-dropdown-item icon="iconfont icon-biaoqian"  command="open">以新标签页打开</el-dropdown-item>
                <el-dropdown-item :icon="`iconfont ${task.isPrivate?'icon-unlock':'icon-unlock'}`" divided  command="private">
                  <span>隐私模式</span>
                  <a class="menu-action text-primary">
                    <span v-if="task.isPrivate">已开启</span>
                    <span v-else>已关闭</span>
                  </a>
                  <div class="menu-desc muted">
                    <span v-if="task.isPrivate">仅参与者可见</span>
                    <span v-else>所有成员可见</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </template>
        <template v-else>
            <a class="action-item muted" @click="recoveryTask">
              <i class="el-icon-refresh-left"></i> <span>恢复内容</span>
            </a>
            <a class="action-item muted" @click="deleteTask">
              <i class="el-icon-delete"></i> <span>彻底删除</span>
            </a>
        </template>
        <el-tooltip placement="top">
          <template slot="content">
            <span>关闭面板</span>
          </template>
          <a class="action-item muted" @click="detailClose"><i class="el-icon-close"/></a>
        </el-tooltip>
      </span>
    </div>
    <div class="task-wrap">
      <div class="task-content">
        <div class="content-left">
          <vue-scroll :ops="scrollOps">
            <div class="task-title" :class="{'disabled': task.recycleFlag==1}">
              <el-input ref="inputTitle" auto-focus @blur="doName" v-model="task.name" v-show="showEditName"/>
              <el-tooltip :mouseEnterDelay="0.5" v-if="task.recycleFlag==0" placement="top">
                  <template slot="content">
                      <span>点击即可编辑</span>
                  </template>
                  <div class="title-text" @click="editTitle" v-show="!showEditName">
                      {{task.name}}
                  </div>
              </el-tooltip>
              <div v-else class="title-text" v-show="!showEditName">
                  {{task.name}}
              </div>
            </div>
            <div class="task-basic-attrs-view muted">
              <div class="field-list" :class="{'disabled': task.recycleFlag==1}">
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                        <i class="iconfont icon-check"/>
                        <span class="field-name">完成状态</span>
                    </div>
                    <div class="field-right">
                      <el-dropdown trigger="click" placement="bottom" :disabled="!(task.recycleFlag==0) || !!isShowCount"
                        :class="{'disabled': isShowCount,'field-dropdown':true}" @command="handleTaskAction">
                        <el-tooltip placement="top" :disabled="!isShowCount">
                          <template slot="content">
                              <span v-if="isShowCount" style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                          </template>
                          <span class="muted">
                            <el-tag v-if="task.finishStatus==1" type="warning" :disable-transitions="false" size="small" effect="plain">已完成</el-tag>
                            <span v-if="task.finishStatus==0">未完成</span>
                          </span>
                        </el-tooltip>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command='finishStatus,1'>
                            <div class="menu-item-content">
                                <el-tag type="warning" size="small" effect="plain">已完成</el-tag>
                                <i class="check muted el-icon-check" v-show="task.finishStatus==1"></i>
                            </div>
                          </el-dropdown-item>
                          <el-dropdown-item command='finishStatus,0'>
                            <div class="menu-item-content">
                                <el-tag type="info" size="small"  effect="dark">未完成</el-tag>
                                <i class="check muted el-icon-check" v-show="task.finishStatus==0"></i>
                            </div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                        <i class="iconfont icon-association"/>
                        <span class="field-name">执行状态</span>
                    </div>
                    <div class="field-right">
                      <el-dropdown trigger="click" placement="bottom" :disabled="!(task.recycleFlag==0) || task.finishStatus==1"
                        :class="{'disabled': (task.finishStatus==1),'field-dropdown':true}" @command="handleTaskAction">
                        <span v-show="task.finishStatus==0" class="muted">{{getTaskStatusName(task.executeStatus)}}</span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :key="index" v-for="(status, index) in taskStatusList" :command="`executeStatus,${status.id}`">
                            <div class="menu-item-content">
                                <span class="green">{{status.name}}</span>
                                <i class="check muted el-icon-check" v-show="task.executeStatus == status.id"></i>
                            </div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                        <i class="iconfont icon-user"/>
                        <span class="field-name">执行者</span>
                    </div>
                    <div class="field-right">
                      <el-dropdown trigger="click" ref="visibleExecMember" placement="bottom" :hide-on-click="showInviteMember" @visible-change="visibleExecMember"
                      :disabled="!(task.recycleFlag==0)" :class="{'disabled': task.finishStatus==1,'field-dropdown':true}">
                        <el-tooltip placement="top" v-if="task.recycleFlag==0">
                          <template slot="content">
                            <span style="font-size: 12px;">点击设置执行者</span>
                          </template>
                          <div class="field-flex">
                            <template v-if="task.executeMemberId">
                                <el-avatar :size="24" :src="task.executor.headImg" icon="user"/>
                                <a class="muted name">{{task.executor.realName}}</a>
                            </template>
                            <template v-if="!task.executeMemberId">
                                <el-avatar :size="24" icon="user" />
                                <a class="muted name">待认领</a>
                            </template>
                          </div>
                        </el-tooltip>
                        <div class="field-flex" v-else>
                          <template v-if="task.executor">
                              <el-avatar :size="24" :src="task.executor.headImg" icon="user"/>
                              <a class="muted name">{{task.executor.realName}}</a>
                          </template>
                          <template v-if="!task.executor">
                              <el-avatar :size="24" icon="user" />
                              <a class="muted name">待认领</a>
                          </template>
                        </div>
                        <el-dropdown-menu slot="dropdown" class="task-project-dropdown">
                          <el-dropdown-item>
                            <taskMemberMenu v-if="visibleExecMembermenu" :executor="currentExecutor" :projectCode="projectCode" :taskCode="code"
                              @changeExecutor="changeExecutor" @inviteProjectMember="showInviteMember = true,visibleProjectMemberMenu = false"></taskMemberMenu>
                            <div v-else></div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                        <i class="iconfont icon-riqi2"/>
                        <span class="field-name">时间</span>
                    </div>
                    <div class="field-right field-date">
                      <template v-if="useOptionChain(task)['projectInfo?.isOpenBeginTime']">
                        <el-tooltip content="点击设置开始时间" placement="top" v-if="task.recycleFlag==0">
                          <div class="field-flex">
                            <a class="muted name" style="margin: 0" @click="showBeginTime">
                              <template v-if="!task.setBeginTime">设置开始时间
                              </template>
                              <template v-else>{{task.begin_time_format}}
                              </template>
                              <el-date-picker
                                @change="startTimeChange"
                                ref="beginTime"
                                style="height:0px;overflow:hidden;width:0px;"
                                v-model="task.startTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="MM月dd HH:mm">
                              </el-date-picker>
                            </a>
                          </div>
                        </el-tooltip>
                        <div class="field-flex" v-else>
                          <a class="muted name" style="margin: 0" @click="showBeginTime">
                            <template v-if="!task.setBeginTime">设置开始时间</template>
                            <template v-else>{{task.begin_time_format}}</template>
                            <el-date-picker
                              @change="startTimeChange"
                              ref="beginTime"
                              style="height:0px;overflow:hidden;width:0px;"
                              v-model="task.startTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              format="MM月dd HH:mm">
                            </el-date-picker>
                          </a>
                        </div>
                        <span class="m-l-sm m-r-sm">-</span>
                      </template>
                      <el-tooltip :mouseEnterDelay="0.5" v-if="task.recycleFlag==0" placement="top">
                        <template slot="content">
                          <span>点击设置截止时间</span>
                        </template>
                        <div class="field-flex">
                          <a class="muted name" style="margin: 0" @click="showEndTime">
                            <template v-if="!task.setEndTime">设置截止时间</template>
                            <template v-else>{{task.end_time_format}}</template>
                            <el-date-picker
                              @change="endTimeChange"
                              ref="endTime"
                              style="height:0px;overflow:hidden;width:0px;"
                              v-model="task.endTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              format="MM月dd HH:mm">
                            </el-date-picker>
                          </a>
                        </div>
                      </el-tooltip>
                      <div class="field-flex" v-else>
                        <a class="muted name" style="margin: 0" @click="showEndTime">
                          <template v-if="!task.setEndTime">设置截止时间</template>
                          <template v-else>{{task.end_time_format}}</template>
                          <el-date-picker
                            @change="endTimeChange"
                            ref="endTime"
                            style="height:0px;overflow:hidden;width:0px;"
                            v-model="task.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="MM月dd HH:mm">
                          </el-date-picker>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                      <i class="iconfont icon-beizhu"/>
                      <span class="field-name">备注</span>
                    </div>
                    <div class="field-right width-block">
                      <div class="task-description" :class="{'disabled': task.deleted}"
                            v-show="!showTaskDescriptionEdit"
                            @click="showTaskDesc">
                          <div class="description-txt" v-show="task.remark"
                                v-html="task.remark"></div>
                          <span v-show="!task.remark">添加备注</span>
                      </div>
                      <div class="m-t-sm" v-if="hasMoreDesc">
                          <a v-show="!showMoreDesc"
                              @click="checkShowMoreDesc(true)">显示更多</a>
                          <a v-show="showMoreDesc"
                              @click="checkShowMoreDesc(false)">收起备注</a>
                      </div>
                      <div v-show="showTaskDescriptionEdit">
                        <editor ref="vueWangeditor"
                          id="editor"
                          :menus="editorConfig.menus"
                        ></editor>
                        <div class="action-btn pull-right">
                          <a type="text" class="cancel-text muted" @click="showTaskDescriptionEdit = false,initContent(false)">
                            取消
                          </a>
                          <el-button type="primary" size="mini" @click="doContent">保存</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                      <i class="iconfont icon-priority-copy"/>
                      <span class="field-name">优先级</span>
                    </div>
                    <div class="field-right">
                      <el-dropdown trigger="click" :disabled="!(task.recycleFlag==0)" placement="bottom-start" @command='priorCommand'>
                        <span>
                          <el-tag size="small" :effect="task.priorityLevel==0?'plain':'dark'" :type="task.priorityLevel==0?'success':task.priorityLevel==1?'warning':'danger'">
                            {{findByvalue(priorLabelList,task.priorityLevel)}}
                          </el-tag>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command='0'>
                            <div class="menu-item-content">
                              <el-tag size="small" :type="priColor(0)">普通</el-tag>
                              <i type="check" class="check muted el-icon-check" v-show="task.priorityLevel == 0"></i>
                            </div>
                          </el-dropdown-item>
                          <el-dropdown-item command='1'>
                            <div class="menu-item-content">
                              <el-tag size="small" effect="dark" :type="priColor(1)">紧急</el-tag>
                              <i type="check" class="check muted el-icon-check" v-show="task.priorityLevel == 1"></i>
                            </div>
                          </el-dropdown-item>
                          <el-dropdown-item command='2'>
                            <div class="menu-item-content">
                              <el-tag size="small" effect="dark" :type="priColor(2)">非常紧急</el-tag>
                              <i type="check" class="check muted el-icon-check" v-show="task.priorityLevel == 2"></i>
                            </div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                      <i class="iconfont icon-biaoqian"/>
                      <span class="field-name">标签</span>
                    </div>
                    <div class="field-right">
                      <div class="inline-block">
                        <el-tag size="small" v-for="(tag,index) in task.tags" :key="index" :class="`badge-item-${tag.color}-tag`">
                          {{tag.name}}
                          <i class="el-icon-close" @click="removeTag(tag,index)" style="font-size:16px;"/>
                        </el-tag>
                      </div>
                      <el-dropdown @visible-change="visibleChange" trigger="click"  :disabled="!(task.recycleFlag==0)" placement="bottom" :hide-on-click="false">
                        <el-tooltip :mouseEnterDelay="0.5" v-if="task.recycleFlag==0" placement="top">
                          <template slot="content">
                              <span>添加标签</span>
                          </template>
                          <div class="inline-block" ref="taskTagMenu">
                            <i class="member-item invite el-icon-circle-plus-outline" style="color:#349cfb;padding-left:10px;font-size:18px;"/>
                          </div>
                        </el-tooltip>
                        <el-dropdown-menu slot="dropdown" class="task-project-dropdown">
                          <el-dropdown-item>
                            <taskTagMenu v-if="visibleTaskTagMenu" @changetTaskTag="changetTaskTag" :tags="taskTags" :projectCode="projectCode" :taskCode="code"></taskTagMenu>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                      <div class="field-left">
                        <i class="iconfont icon-menu"/>
                        <span class="field-name">子任务 <span v-show="childTaskList.length"> · {{childTaskDoneNum}}/{{childTaskList.length}}</span></span>
                        <!-- <span class="field-name">子任务 <span v-show="childTaskList.length"> · {{task.taskCount && task.taskCount.split("/")[0]}}/{{childTaskList.length}}</span></span> -->
                      </div>
                      <div class="field-right width-block">
                      </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                      <div class="block-field width-block">
                        <div class="task-child">
                          <div class="task-list" v-show="childTaskList.length">
                            <div v-for="done in [0,1]" :key="done">
                              <div v-for="(childTask, index) in childTaskList" :key="childTask.code">
                                <div class="list-item task" v-if="childTask.finishStatus == done" >
                                  <el-tooltip placement="top" :disabled="!(task.finishStatus || !childTask.childrenStatus)">
                                  <!-- <el-tooltip placement="top" :disabled="!(childTask.parentDone || childTask.hasUnDone)">finishStatus -->
                                    <template slot="content">
                                      <!-- <span v-if="childTask.parentDone" style="font-size: 12px;">父任务已完成，无法重做子任务</span> -->
                                      <span v-if="task.finishStatus" style="font-size: 12px;">父任务已完成，无法重做子任务</span>
                                      <span v-else-if="!childTask.childrenStatus" style="font-size: 12px;">子任务尚未全部完成，无法完成父任务</span>
                                    </template>
                                    <div class="check-box-wrapper task-item"
                                      @click.stop="()=>{if(task.recycleFlag==1 || task.finishStatus || !childTask.childrenStatus) return false;taskDone(childTask.id,!childTask.finishStatus,index,'child')}">
                                      <i :class="{'disabled': task.recycleFlag==1 || task.finishStatus || !childTask.childrenStatus,'iconfont icon-check':childTask.finishStatus,'iconfont icon-kongcheck':!childTask.finishStatus}"
                                        class="check-box" :style="{fontSize:'16px'}"/>
                                    </div>
                                  </el-tooltip>
                                  <el-dropdown trigger="click" :hide-on-click="showInviteMember"  :disabled="!(task.recycleFlag==0)"
                                    @visible-change="(val)=>{changeChildTaskShow(val,index)}" :key="index" :id="childTask.id" :ref="`childrenTask${index}`">
                                    <el-tooltip :mouseEnterDelay="0.5" placement="top">
                                        <template slot="content">
                                            <span v-if="childTask.executor">{{childTask.executor.realName}}</span>
                                            <span v-else>待认领</span>
                                        </template>
                                        <el-avatar v-if="childTask.executor" class="task-item"   :class="{'disabled': task.recycleFlag==1}"
                                          size="small"  :src="childTask.executor.headImg"
                                        ></el-avatar>
                                        <el-avatar v-else class="task-item el-icon-user" :class="{'disabled': task.recycleFlag==1}"
                                          size="small"
                                        ></el-avatar>
                                    </el-tooltip>
                                    <el-dropdown-menu slot="dropdown" class="task-project-dropdown">
                                      <el-dropdown-item>
                                        <taskMemberMenu v-if="childTask.taskMemberShow" :projectCode="projectCode" :refs="`childrenTask${index}`" :executor="childTask.executor"
                                          @changeExecutor="childTaskMemberDrop" :taskCode="childTask.id"  @inviteProjectMember="showInviteMember = true,visibleProjectMemberMenu = false"></taskMemberMenu>
                                      </el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                  <div class="task-item task-title" @click.stop="init(childTask.id)">
                                    <div class="title-text" :class="{'done': childTask.finishStatus}" >
                                      {{childTask.name}}
                                    </div>
                                  </div>
                                  <a class="muted" @click.stop="init(childTask.id)">
                                    <i class="task-item el-icon-arrow-right"/>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="task-list" v-show="showChildTask">
                            <div class="add-task">
                                <div class="list-item task">
                                  <span class="task-item check-box"></span>
                                  <el-dropdown trigger="click" :hide-on-click="showInviteMember" :disabled="!!task.deleted"
                                    ref="childTaskAdd" @visible-change="visibleChangeChildTaskAdd">
                                    <el-tooltip :mouseEnterDelay="0.5" placement="top">
                                      <template slot="content">
                                          <span v-if="childExecutor.realName">{{childExecutor.realName}}</span>
                                          <span v-else>待认领</span>
                                      </template>
                                      <div class="field-flex">
                                          <template v-if="childExecutor.headImg">
                                            <el-avatar class="task-item" :src="childExecutor.headImg" icon="user" size="small"/>
                                          </template>
                                          <template v-if="!childExecutor.headImg">
                                            <el-avatar class="task-item el-icon-user" icon="user" size="small"/>
                                          </template>
                                      </div>
                                    </el-tooltip>
                                    <el-dropdown-menu slot="dropdown" class="task-project-dropdown">
                                      <el-dropdown-item>
                                        <taskMemberMenu v-if="visibleChildTaskAdd" :executor="childExecutor" refs="childTaskAdd" :projectCode="projectCode" :taskCode="code"
                                        @changeExecutor="changeChildExecutor" @inviteProjectMember="showInviteMember = true,visibleProjectMemberMenu = false" :isCommit="false"></taskMemberMenu>
                                      </el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                  <div class="task-item task-input">
                                    <el-input v-model="childTaskName" @keyup.native.enter="createTask"/>
                                  </div>
                                </div>
                                <div class="action-btn text-right">
                                  <a type="text" class="cancel-text muted" @click="showChildTask = false">取消</a>
                                  <el-button type="primary" size="mini" htmlType='submit' class="middle-btn" @click="createTask">保存</el-button>
                                </div>
                            </div>
                          </div>
                          <el-tooltip placement="top" :disabled="!task.finishStatus">
                            <template slot="content">
                                <span v-if="task.finishStatus" style="font-size: 12px;">父任务已完成，无法添加新的子任务</span>
                            </template>
                            <a class="add-handler"
                                :class="{'disabled': task.finishStatus}"
                                v-show="!showChildTask"
                                @click="()=>{if (task.recycleFlag==1 || task.finishStatus) return false; showChildTask = true}">
                                <i class="el-icon-plus" style="margin-right: 6px;"/>
                                添加子任务
                            </a>
                          </el-tooltip>
                        </div>
                      </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left" style="width: 100%">
                      <i class="iconfont icon-time"/>
                      <span class="field-name">工时
                          <span v-if="workTimeList.length"> · 实际工时 {{workTimeTotal}} 小时，工时记录 {{workTimeList.length}} 条，预估工时 {{task.initWorkingHours}} 小时
                            <a class="muted m-l-sm" @click="doPlainWorkTime">
                              <i class="task-item el-icon-edit" type="edit"/>
                            </a>
                          </span>
                          <span v-else>
                            <span v-if="task.initWorkingHours"> · 预估工时 {{task.initWorkingHours}} 小时</span>
                            <el-tooltip placement="top">
                              <template slot="content">
                                  <span>设置预估工时</span>
                              </template>
                              <a class="muted m-l-sm" @click="doPlainWorkTime">
                                  <i class="task-item el-icon-edit" type="edit"/>
                              </a>
                            </el-tooltip>
                          </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="block-field width-block">
                      <div class="task-child">
                        <div class="task-list" v-show="workTimeList.length">
                          <div v-for="(workTime, index) in workTimeList" :key="workTime.code">
                            <div class="list-item task m-l-xs">
                              <div class="task-item task-title hover-none">
                                <div class="title-text">
                                  <el-tooltip :mouseEnterDelay="0.5" placement="top">
                                    <template slot="content">
                                        <span v-if="workTime.member">{{workTime.member.name}}</span>
                                        <span v-else>待认领</span>
                                    </template>
                                    <el-avatar class="task-item el-icon-user" size="small" icon="user" :src="useOptionChain(workTime)['member?.avatar']"></el-avatar>
                                  </el-tooltip>
                                  <div style="flex:1;">
                                    <div>
                                      {{useOptionChain(workTime)['member?.name']}}
                                      {{moment(workTime.startTime).format('MM月DD日 HH:mm')}}开始 工时为
                                      {{workTime.timeConsuming}} 小时
                                    </div>
                                    <div class="muted" v-show="workTime.workContent" style="margin-top: 10px;">
                                      {{workTime.workContent}}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a class="muted" @click="doWorkTime(workTime,index)">
                                <i class="task-item el-icon-edit-outline" type="edit"/>
                              </a>
                              <a class="muted" @click="deleteWorkTime(workTime, index)">
                                <i class="task-item el-icon-delete" type="delete"/>
                              </a>
                            </div>
                          </div>
                        </div>
                        <el-tooltip placement="top" :disabled="true">
                          <a class="add-handler" @click="doWorkTime(false)">
                            <i class="el-icon-plus" style="margin-right: 6px;"/>
                            添加工时
                          </a>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="field-left">
                        <i class="iconfont icon-fujian"/>
                        <span class="field-name">关联文件</span>
                    </div>
                    <div class="field-right width-block">
                    </div>
                  </div>
                </div>
                <div class="component-mount">
                  <div class="field">
                    <div class="block-field width-block">
                      <div class="task-child">
                        <el-upload
                          class="upload-demo"
                          :headers="headers"
                          :action="uploadAction"
                          :before-upload="beforeUpload"
                          :on-success="handleSuccess"
                          :show-file-list="false">
                          <a class="add-handler" id="upload-file">
                            <i class="el-icon-plus" style="margin-right: 6px;"/>上传文件
                          </a>
                        </el-upload>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="component-mount" v-show="taskSourceList.length > 0">
                  <div class="field">
                    <div class="block-field width-block">
                      <div class="file-list">
                      <div class="m-xs m-t-none">关联的文件</div>
                      <div class="list-item" :key="index" v-for="(item, index) in taskSourceList">
                          <div class="title muted" style="display: flex;align-items: center;">
                            <!-- :src="item.fileUrl" -->
                            <el-avatar size="small" icon="el-icon-link" style="margin-right:10px;"/>
                            <a class="muted" target="_blank" :href="item.fileUrl">{{ item.originName }}</a>
                          </div>
                          <div class="actions-box">
                            <el-dropdown trigger="click" @command="fileCommand">
                              <i class="el-icon-more" style="cursor: pointer;"></i>
                              <el-dropdown-menu slot="dropdown" class="auto-dropdown">
                                <el-dropdown-item :command="`copy,${index}`">
                                  <i class="el-icon-copy-document"></i><span>复制链接</span>
                                </el-dropdown-item>
                                <el-dropdown-item :command="`cancal,${index}`">
                                  <i class="el-icon-delete-solid"></i><span>取消关联</span>
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-scroll>
        </div>
        <div class="content-right">
          <div class="header">
            <div class="title">
                参与者 · {{taskMemberList.length}}
            </div>
            <div class="member-list">
                <el-tooltip :mouseEnterDelay="0.5" v-for="member in taskMemberList" :key="member.code">
                  <template slot="content">
                    <span>{{member.userDto.realName}} <span v-if="member.isOwner"> · 创建者</span></span>
                  </template>
                  <el-avatar size="small" :src="member.userDto.headImg" :class="{'el-icon-user':!member.userDto.headImg}" style="margin-right:6px;" />
                  <!-- 跳到团队成员中 -->
                  <!-- @click="routerLink('/members/profile/' + member.membar_account_code + '?key=3')" -->
                </el-tooltip>
                <el-dropdown trigger="click" :hide-on-click="inviteTaskMemberFlag" ref="inviteTaskDrop" @visible-change="invitTaskVisibleChange">
                  <el-tooltip :mouseEnterDelay="0.5" placement="top">
                    <template slot="content">
                        <span>点击添加参与者</span>
                    </template>
                    <i class="member-item invite el-icon-circle-plus-outline" style="font-size: 24px;"/>
                  </el-tooltip>
                  <el-dropdown-menu slot="dropdown" class="task-project-dropdown">
                    <el-dropdown-item>
                      <project-member-menu v-if="invitTaskVisible" :invitTaskList="taskMemberList" :projectId="projectCode" :taskId="code"
                        @inviteTaskMember="inviteTaskMember"></project-member-menu>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </div>
          </div>
          <div class="log-wrap">
            <div class="header">
              <el-dropdown trigger="click" @command="handleIsCommand">
                <span class="el-dropdown-link">
                  <a class="text-default">
                    {{taskLogType=='all'?'所有动态':taskLogType=='0'?'仅评论':'仅动态'}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </a>
                </span>
                <el-dropdown-menu slot="dropdown" class="auto-dropdown">
                  <el-dropdown-item command="all">
                    <div class="menu-item-content" >
                      <span>所有动态</span>
                      <i :class="{'el-icon-check':taskLogType=='all'}" style="margin:0px 0px 0px 15px;"></i>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="0">
                    <div class="menu-item-content">
                      <span>仅评论</span>
                      <i :class="{'el-icon-check':taskLogType=='0'}" style="margin:0px 0px 0px 15px;"></i>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command='1'>
                    <div class="menu-item-content">
                      <span>仅动态</span>
                      <i :class="{'el-icon-check':taskLogType=='1'}" style="margin:0px 0px 0px 15px;"></i>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <vue-scroll style="height:58vh;" :ops="{bar: {background: '#cecece'}}" class="right-scroll">
              <div class="log-list muted">
                <a class="show-more muted" v-show="checkShowMoreLog" @click="getMoreTaskLog">
                  <i class="el-icon-more"/>
                  显示较早的 {{taskLogTotal - taskLogList.length}} 条动态
                </a>
                <div :class="{'log-comment': log.isComment,'list-item': !log.isComment}"
                  v-for="log in taskLogList" :key="log.id">
                  <template v-if="!log.isComment">
                    <i class="log-item el-icon-user" :class="log.icon"/>
                    <div class="log-item log-txt">
                      <div>{{useOptionChain(log)['memberInfo?.realName']}} <span v-html="log.remark"></span></div>
                      <div v-if="log.content" class="log-content" v-html="log.content"></div>
                    </div>
                  </template>
                  <template v-if="log.isComment">
                    <div class="log-txt text-default" style="width:100%; display: flex;justify-content: space-between">
                        <div style="display: flex;align-items: center">
                            <el-avatar :size="24" :src="log.memberInfo.headImg" class="m-r-sm" style="margin-left: -5px"/>
                            <div>{{useOptionChain(log)['memberInfo?.realName']}}</div>
                        </div>
                        <el-tooltip :mouseEnterDelay="0.5">
                            <template slot="content">
                                <span>{{moment(log.createTime).format('yyyy-MM-DD HH:mm:ss')}}</span>
                            </template>
                            <span class="muted">{{log.createTime | formatLogTime}}</span>
                        </el-tooltip>
                    </div>
                    <div class="log-txt text-default" style="padding: 0 0 0 30px;">
                        <div class="m-t-xs" v-html="checkLink(log.remark)" ></div>
                    </div>
                  </template>
                  <el-tooltip v-if="!log.isComment" :mouseEnterDelay="0.5" placement="top">
                    <template slot="content">
                        <span>{{moment(log.createTime).format('yyyy-MM-DD HH:mm:ss')}}</span>
                    </template>
                    <span>{{log.createTime | formatLogTime}}</span>
                  </el-tooltip>
                </div>
              </div>
            </vue-scroll>
          </div>
          <div class="footer" id="footer">
            <!-- arrowPointAtCenter :getPopupContainer="getPopup" -->
            <el-popover placement="top" v-model="showMentions" trigger="manual" style="flex:1 1;margin-right: 24px;">
              <div class="mentions-content" style="width: 200px;">
                <div class="mentions-wrapper" v-for="member in taskMemberList" :key="member.id" @click="selectMentionMember(member)">
                  <el-avatar :src="member.avatar" icon="el-icon-user" :size="28"/>
                  <span class="muted name m-l-xs">{{member.name}}</span>
                </div>
              </div>
              <el-input @focus="commenting = true" @blur="commenting = false" ref="commentText" type="textarea" placeholder="@提及任务成员，Ctrl+Enter发表评论"
                v-model="comment" slot="reference" :autosize="{ minRows: 1,maxRows:1}"></el-input>
            </el-popover>
            <el-button class="middle-btn" size="small" type="primary" @click="createComment" style="height: 32px;">评论</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 预估工时 -->
    <el-dialog
      :title="plainWorkTime.modalTitle"
      :visible.sync="plainWorkTime.modalStatus"
      width="520px"
      append-to-body
      custom-class="work-time-dialog"
      :before-close="plainWorkTimeClose">
      <el-form ref="plainWorkTimeForm" :rules="rules" :model="plainWorkTime.form">
        <el-form-item prop="work_time">
          <el-input v-model="plainWorkTime.form.work_time" placeholder="请输入数字">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="plainWorkTimeClose">取 消</el-button>
        <el-button type="primary" @click="workTimePlainHandleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 登记工时记录 -->
    <el-dialog
      :title="workTimeDo.modalTitle"
      :visible.sync="workTimeDo.modalStatus"
      width="520px"
      append-to-body
      custom-class="work-time-dialog"
      :before-close="workTimeDoClose">
      <el-form ref="workTimeDoForm" :rules="rules" :model="workTimeDo.form">
        <div>
          <div style="font-size: 15px;">登记任务</div>
          <div>{{task.name}}</div>
          <el-divider class="m-t-xs m-b-md"></el-divider>
        </div>
        <div class="work-time-stats">
          <div class="work-time-item">
            <div class="muted title">预估工时</div>
            <span class="work-time-num">{{task.initWorkingHours}}</span>
            <span>小时</span>
          </div>
          <div class="work-time-item">
            <div class="muted title">剩余工时</div>
            <span class="work-time-num">
                <template v-if="task.initWorkingHours - workTimeTotal < 0">0</template>
                <template v-else>{{task.initWorkingHours - workTimeTotal}}</template>
            </span>
            <span>小时</span>
          </div>
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="begin_time">
              <el-date-picker
                v-model="workTimeDo.form.begin_time"
                type="datetime"
                format="yyyy年MM月DD日 HH:mm"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消耗时间" prop="num">
              <el-input v-model="workTimeDo.form.num" placeholder="请输入数字">
                <template slot="append">小时</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作内容" prop="content">
               <el-input type="textarea" v-model="workTimeDo.form.content" placeholder="在这期间做了什么" :autosize="{minRows:4}">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workTimeDoClose">取 消</el-button>
        <el-button type="primary" @click="workTimeHandleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 邀请新成员 -->
    <projectMember v-model="showInviteMember" v-if="showInviteMember"></projectMember>
    <!-- 复制任务 -->
    <el-dialog
      :title="copyTask.modalTitle"
      :visible.sync="copyTask.modalStatus"
      width="520px"
      append-to-body
      custom-class="work-time-dialog"
      :before-close="copyTaskClose">
      <el-form :model="copyTaskForm" ref="copyTaskForm" :rules="rules">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="copyTaskForm.name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="目标项目" prop="projectId">
              <el-select v-model="copyTaskForm.projectId" placeholder="请选择目标项目" style="width:100%;" @change="projectIdChange" popper-class="popper-class">
                <el-option v-for="(item,index) in projectOptions" :key="index"
                :label="item.projectName" :value="item.id" style="width:230px;"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标列表" prop="mouldId">
              <el-select v-model="copyTaskForm.mouldId" placeholder="请选择目标列表" style="width:100%;" popper-class="popper-class">
                <el-option v-for="(item,index) in mouldIdOptions" :key="index"
                  :label="item.projectMouldName" :value="item.id" style="width:230px;"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div slot="label" style="width:480px;text-align:left;">
            复制内容
          </div>
          <el-checkbox v-model="copyTaskForm.copyExecutor">执行者</el-checkbox>
          <el-checkbox v-model="copyTaskForm.copyChild">子任务</el-checkbox>
          <el-checkbox v-model="copyTaskForm.copyMember">参与者</el-checkbox>
          <el-checkbox v-model="copyTaskForm.copyWorkTime">工时</el-checkbox>
          <div class="form-explain">如果当前选择的执行者与参与者没有被添加到目标项目中，复制过程中可能被丢失</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyTaskClose">取 消</el-button>
        <el-button type="primary" :loading="copyTask.confirmLoading" @click="copyTaskHandleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 移动任务 -->
    <el-dialog
      :title="moveTask.modalTitle"
      :visible.sync="moveTask.modalStatus"
      width="520px"
      append-to-body
      custom-class="work-time-dialog"
      :before-close="moveTaskClose">
      <el-form :model="moveTaskForm" ref="moveTaskForm" :rules="rules">
        <el-row :gutter="20">
          <el-col :span=12>
            <el-form-item label="目标项目" prop="projectId">
              <el-select v-model="moveTaskForm.projectId" placeholder="请选择目标项目" style="width:100%;" popper-class="popper-class" @change="projectIdChange">
                <el-option v-for="(item,index) in projectOptions" :key="index"
                :label="item.projectName" :value="item.id" style="width:230px;"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label="目标列表" prop="mouldId">
              <el-select v-model="moveTaskForm.mouldId" placeholder="请选择目标列表" style="width:100%;" popper-class="popper-class">
                <el-option v-for="(item,index) in mouldIdOptions" :key="index"
                  :label="item.projectMouldName" :value="item.id" style="width:230px;"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <div class="muted m-t-sm">跨项目移动时，部分参与者信息不会保留</div>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveTaskClose">取 消</el-button>
        <el-button type="primary" :loading="moveTask.confirmLoading" @click="moveTaskHandleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {COMMON} from '@/const/common'
import projectDate from './projectDate.vue'
import editor from '@/components/editor'
import moment from 'moment'
import { relativelyTime,relativelyTaskTime } from '@/util/date'
import projectMember from './projectMember.vue'
import taskMemberMenu from './taskMemberMenu.vue'
import ProjectMemberMenu from './projectMemberMenu.vue'
import taskTagMenu from './taskTagMenu.vue'
import { projectTaskDetail,projectLogList,projectTaskLike,projectTaskEdit,projectTaskRecycle,projectTaskRecovery,projectTaskSave,projectTaskDel,
  projectTaskCollect,projectTaskSetPrivate,projectTaskComment,projectTaskSaveWorkTime,projectTaskEditWorkTime,proejctTaskDone,projectTaskWorkTimeDel,
  projectTaskCopy,projectTaskMove,projectTaskListMould } from '@/api/project/task'
import { projectInfoListAll } from '@/api/project/list'
import { projectTaskUploadFile,projectTaskFileList,projectTaskCancelRelation } from '@/api/project/file'
import { projectTaskMember,projectTaskSetMember } from '@/api/project/member'
import { findByvalue } from "@/util/util";
import { projectTaskSetTag } from '@/api/project/tag'
export default {
  components: {
    projectDate,editor,projectMember,taskMemberMenu,
    ProjectMemberMenu,taskTagMenu
  },
  props: {
    taskCode:{
      type:String,
      default:''
    },
    projectCode:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      moment:moment,
      loading:false,
      taskMemberList: [],
      code:this.taskCode,
      task:{
        projectInfo:{},
        projectTaskMould:{},
        name:'',
        statusText:'',
        endTime:'',
        startTime:'',
        pri:0,
        priText:'',
        recycleFlag:0
      },
      showEditName:false,
      taskStatusList: COMMON.TASK_STATUS,
      priorLabelList: COMMON.PRIOR_LIST,
        /*备注*/
      showTaskDescriptionEdit: false,
      visibleTaskTagMenu:false,
      showMoreDesc: false,
      hasMoreDesc: false,
      editorConfig: {
        uploadImgServer: '/mgr/document/upload/jvs-public',
        uploadImgHeaders: {
            Authorization: 'Bearer ' + this.$store.getters.access_token
        },
        menus: [
          'head',	// 标题
          'bold',	// 粗体
          'italic',	// 斜体
          'justify',	// 居中
          'image',	// 图片
          'link',	// 链接
          'list',	// 无序列表
          'quote',	// 引用
          'table',	// 表格
          '|'
        ],
      },
      /*子任务*/
      childTaskList: [],
      showChildTask: false,
      childTaskName: '',
      childExecutor: {},
      visibleChildTaskMemberMenu: false,
      visibleProjectMemberMenu: false,
      showInviteChildTaskMember: false,
      // workTimeTotal: 0,
      workTimeDo: {
        form: {
          num:0,
          begin_time:'',
          content:''
        },
        info: null,
        modalTitle: '登记工时记录',
        modalStatus: false,
        confirmLoading: false,
      },
      plainWorkTime: {
        form: {
          work_time:0
        },
        modalTitle: '设置预估工时',
        modalStatus: false,
        confirmLoading: false,
      },
      copyTask: {
        form: {
          work_time:0
        },
        modalTitle: '复制任务',
        modalStatus: false,
        confirmLoading: false,
      },
      moveTask: {
        modalTitle: '移动任务',
        modalStatus: false,
        confirmLoading: false,
      },
      moveTaskForm:{
        mouldId:'',
        projectId:''
      },
      copyTaskForm:{
        name:'',
        projectId:'',
        mouldId:'',
        copyWorkTime:0,
        copyMember:0,
        copyExecutor:0,
        copyChild:0,
      },
      workTimeList: [],
      /*资源*/
      taskSourceList: [],
      // 任务日志状态
      taskLogType:'all',
      showMoreTaskLog: 0,
      hasMoreTaskLog: false,
      hideShowMore: false,
      taskLogTotal: 0,
      taskLogList: [],
      taskLogListCopy:[],
      comment:'',
      showMentions:false,
      commenting:false,
      rules:{
        work_time:[ { required: true, message: '请输入预估工时', trigger: 'change' }],
        begin_time:[{ required: true, message: '请选择日期', trigger: 'change' }],
        num:[{ required: true, message: '请输入消耗时间', trigger: 'change' }],
        name:[{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        mouldId:[{ required: true, message: '请选择目标列表', trigger: 'change' }],
        projectId:[{ required: true, message: '请选择目标项目', trigger: 'change' }]
      },
      showInviteMember:false,
      inviteTaskMemberFlag:false,
      taskTagMenuShow:true,
      currentExecutor:{},
      visibleExecMembermenu:false,
      taskTags:[],
      mouldId:'',
      visibleChildTaskAdd:false,
      headers:{
        'Authorization':'Bearer ' + this.$store.getters.access_token
      },
      uploadAction:'/mgr/teamwork/fileUpload/uploadProjectFile',
      invitTaskVisible:false,
      projectOptions:[],
      mouldIdOptions:[],
      actionType:''
    };
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {
    document.onkeydown = (event) => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (13 == e.keyCode && e.ctrlKey) {
        //处理的部分
        this.createComment();
      }
      // todo 暂时不要
      // if ('@' == e.key && this.commenting) {
      //   this.showMentions = true;
      // }else{
      //   this.showMentions = false;
      // }
    };
  },
  filters: {
    formatLogTime(value) {
      return relativelyTime(value)
    }
  },
  computed: {
    isShowCount(val){
      if(this.task.taskCount){
        let arr = this.task.taskCount.split("/")
        return Number(arr[0]) < Number(arr[1])
      }else {
        return true
      }
    },
    /*工时*/
    workTimeTotal(){
      let sumCount = 0
      this.workTimeList.forEach(item=>{
        sumCount += item.timeConsuming
      })
      return sumCount
    },
    checkShowMoreLog() {
      if (!this.hideShowMore) {
        if (this.taskLogTotal > 20) {
          return true;
        }
      }
      return false;
    },
    childTaskDoneNum() {
      const list = this.childTaskList.filter(item => item.finishStatus == 1);
      return list.length;
    },
    taskLink() {
      return window.location.href;
    },
    scrollOps() {
      return {
        rail: {
          background: '#e5e5e5',
          opacity: 1
        },
        bar: {
          background: '#cecece',
          keepShow: true
        }
      }
    }
  },
  methods: {
    findByvalue,
    getTaskStatusName(val){
      let label = ''
      this.taskStatusList.forEach((item)=>{
        if(item.id == val){
          label = item.name
        }
      })
      return label
    },
    init(code = null, loading = true){
      if(code){
        this.code = code
      }
      this.clearMemberMenu()
      this.getProjectLogList()
      this.getTask(loading)
      this.getTaskFile()
      this.getProjectInviteMember()
    },
    getProjectInviteMember(){
      projectTaskMember({taskId:this.code}).then(res=>{
        if(res.data.code ==0 ){
          this.taskMemberList = res.data.data
        }
      })
    },
    getTaskFile(){
      projectTaskFileList({taskId:this.code}).then(res=>{
        if(res.data.code == 0 ){
          this.taskSourceList = JSON.parse(JSON.stringify(res.data.data))
        }
      })
    },
    getTask(loading = true){
      this.loading = loading
      projectTaskDetail({taskId:this.code}).then(res=>{
        if(res.data.code == 0){
          this.task = Object.assign({},this.task,res.data.data)
          this.currentExecutor = res.data.data.executor || {}
          this.taskTags = JSON.parse(JSON.stringify(res.data.data.tags || []))
          this.childTaskList = JSON.parse(JSON.stringify(res.data.data.tasks || []))
          this.mouldId = res.data.data.mouldId
          this.task.initWorkingHours = this.task.initWorkingHours || 0
          this.workTimeList = JSON.parse(JSON.stringify(res.data.data.projectTaskWorkTimeRecords || []))
          if(!this.task.startTime){
            this.task.setBeginTime = false;
            this.task.startTime = ''
            // this.task.startTime = moment(moment().format('YYYY-MM-DD') + ' 18:00');
          }else{
            this.task.setBeginTime = true;
            this.task.startTime = moment(this.task.startTime);
          }
          this.task.begin_time_format = relativelyTaskTime(this.task.startTime, true);
          if(!this.task.endTime){
            this.task.setEndTime = false;
            this.task.endTime = ''
            // this.task.endTime = moment(moment().format('YYYY-MM-DD') + ' 18:00');
          }else{
            this.task.setEndTime = true;
            this.task.endTime = moment(this.task.endTime);
          }
          this.task.end_time_format = relativelyTaskTime(this.task.endTime, true);
          this.$forceUpdate
        }
      }).finally(res=>{
        this.loading = false
      })
    },
    getProjectLogList(){
      projectLogList({taskId:this.code,isSize:!this.hideShowMore}).then(res=>{
        if(res.data.code == 0){
          this.taskLogList = (res.data.data.data).reverse()
          this.taskLogListCopy = JSON.parse(JSON.stringify(this.taskLogList))
          this.taskLogTotal = res.data.data.total || 0
        }
      })
    },
    like(like) {
      like = Number(like);
      // doLike(this.code, like);
      if(!this.task.likeMine){
        this.task.likeMine = 0
      }
      if (like) {
        this.task.thumbsUpCount++;
      } else {
        this.task.thumbsUpCount--;
      }
      this.task.likeMine = like;
      projectTaskLike({
        like:like,
        taskId:this.code
      }).then(res=>{
        if(res.data.code == 0){
          this.$message.success(like?"点赞成功":"取消点赞")
        }
      })
      this.$forceUpdate()
    },
    doTask(action) {
      let app = this;
      const actionKey = action;
      switch (actionKey) {
          case 'recycle':
            this.$confirm('您确定要把该任务移到回收站吗？', '移到回收站', {
              confirmButtonText: '确定',
              cancelButtonText: '再想想',
              confirmButtonClass:'el-button--danger',
              type: 'warning'
            }).then(() => {
              projectTaskRecycle({taskId:this.code}).then(res=>{
                if(res.data.code==0){
                  this.$message.success("移除到回收站成功")
                  this.task.recycleFlag = 1
                }
              })
            }).catch(() => {

            });

            break;
          case 'star':
            projectTaskCollect({
              taskId:this.code,
              collect:this.task.collectMine?0:1
            }).then(res=>{
              if(res.data.code==0){
                this.task.collectMine ? this.task.collectMine = 0 : this.task.collectMine = 1;
              }
            })
            return true;
          case 'open':
            var url = window.location.href;
            if (url.indexOf('?') !== -1) {
                url += '&full-screen=true';
            }else{
                url += '?full-screen=true';
            }
            window.open(url);
            break;
          case 'private':
            projectTaskSetPrivate(this.task).then(res=>{
              if(res.data.code == 0){
                this.task.isPrivate = Number(!this.task.isPrivate)
              }
            })
            return true;
          case 'copy':
            this.copyTask.modalStatus = true
            this.$refs.menuDropDown.hide()
            this.actionType = 'copy'
            this.changVal()
            return true;
          case 'move':
            this.moveTask.modalStatus = true
            this.$refs.menuDropDown.hide()
            this.actionType = 'move'
            this.changVal()
            return true;
      }
      // this.visibleTaskMenu = false;
    },
    changVal(){
      this.$nextTick(()=>{
        if(this.actionType=='move'){
          this.moveTaskForm = Object.assign({},{
            projectId:this.task.projectId,
            mouldId:this.task.mouldId,
          })
        }else{
          this.copyTaskForm = Object.assign({},{
            name:this.task.name,
            projectId:this.task.projectId,
            mouldId:this.task.mouldId,
            copyChild:true,
            copyExecutor:true,
            copyMember:true,
            copyWorkTime:true
          })
        }
        this.projectIdChange(false)
        projectInfoListAll().then(res=>{
          if(res.data.code == 0){
            this.projectOptions = res.data.data
          }
        })
      })
    },
    visibleChange(bool){
      this.visibleTaskTagMenu = bool
    },
    inviteTaskMember(list,projectMemberList){
      let isAll = false
      let memberIds = []
      for(let i =0;i<list.length;i++){
        if(list[i].memberId=='all'){
          isAll = true
        }else{
          memberIds.push(list[i].memberId)
        }
      }
      if(isAll){
        projectMemberList.forEach(item=>{
          memberIds.push(item.memberId)
        })
      }
      let newMemberIsd = new Set(memberIds)
      projectTaskSetMember({
        isAll:isAll,
        memberIds:newMemberIsd,
        taskId:this.code
      }).then(res=>{
        if(res.data.code==0){
          this.getProjectInviteMember()
          this.inviteTaskMemberFlag = true
          setTimeout(()=>{
            this.inviteTaskMemberFlag = false
          },1)
        }
      })
    },
    clearMemberMenu() {
      this.visibleTaskTagMenu = false;
      this.visibleTaskMemberMenu = false;
      this.visibleProjectMemberMenu = false;
    },
    workTimeDoClose(){
      this.$refs['workTimeDoForm'].resetFields()
      this.workTimeDo.modalStatus = false
    },
    workTimeHandleSubmit(){
      this.$refs['workTimeDoForm'].validate((valid) => {
        if (valid) {
          if(this.workTimeDo.type=='add'){
            projectTaskSaveWorkTime({
              taskId:this.code,
              timeConsuming:this.workTimeDo.form.num,
              startTime:moment(this.workTimeDo.form.begin_time).format('yyyy-MM-DD HH:mm:ss'),
              workContent:this.workTimeDo.form.content
            }).then(res=>{
              if(res.data.code ==0 ){
                this.workTimeDoClose()
              }
            })
          }else{
            projectTaskEditWorkTime({
              id:this.workTimeDo.info.id,
              taskId:this.code,
              timeConsuming:this.workTimeDo.form.num,
              startTime:moment(this.workTimeDo.form.begin_time).format('yyyy-MM-DD HH:mm:ss'),
              workContent:this.workTimeDo.form.content
            }).then(res=>{
              if(res.data.code == 0){
                this.workTimeList.splice(this.workTimeDo.index,1,res.data.data)
                this.workTimeDoClose()
              }
            })
          }
        }
      });
    },
    workTimePlainHandleSubmit() {
      this.$refs['plainWorkTimeForm'].validate((valid) => {
        if (valid) {
          projectTaskEdit({
            id:this.code,
            initWorkingHours:this.plainWorkTime.form.work_time
          }).then(res=>{
            if(res.data.code == 0){
              this.task.initWorkingHours = this.plainWorkTime.form.work_time
              this.plainWorkTime.modalStatus = false;
              this.getProjectLogList()
            }
          })
        }
      });
    },
    plainWorkTimeClose(){
      this.$refs['plainWorkTimeForm'].resetFields()
      this.plainWorkTime.modalStatus = false
    },
    checkLink(text) {
      let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
      if(!reg.exec(text)){
          return text
      }else{
          text = text.replace(reg, "<a target='_blank' href='$1$2'>$1$2</a>");
      }
      return text;
    },
    getMoreTaskLog() {
      this.showMoreTaskLog = 1;
      this.hideShowMore = true;
      this.getProjectLogList();
    },
    selectMentionMember(member) {
      this.showMentions = false;
      this.comment += member.name + ' ';
      this.$nextTick(() => {
        this.$refs.commentText.focus();
      });
    },
    createComment() {
      let comment = this.comment.trim();
      if (!comment) {
          return false;
      }
      comment += ' ';
      const regx = /(@[^@]+) /g;
      const res = comment.match(regx);
      if (res) {
        res.forEach((v) => {
          let str = v.substring(1, v.length - 1);
          if (this.mentionsList.findIndex(item => item == str) === -1) {
            this.mentionsList.push(str);
          }
        });
      }
      projectTaskComment({
        taskId:this.code,
        comment:comment,
        mentions:this.mentionsList
      }).then(res=>{
        if(res.data.code == 0){
          this.comment = '';
          this.mentionsList = null;
          this.getProjectLogList()
        }
      })
    },
    deleteWorkTime(workTime, index) {
      let app = this;
      this.$confirm('确定要删除工时记录吗？', '删除工时记录', {
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        confirmButtonClass:'el-button--danger',
        type: 'warning'
      }).then(() => {
        projectTaskWorkTimeDel(workTime).then(res=>{
          if(res.data.code==0){
            this.workTimeList.splice(index,1)
          }
        })
      }).catch(() => {

      });
    },
    doWorkTime(workTime = false,index) {
      let app = this;
      this.workTimeDo.modalStatus = true;
      if (workTime) {
          this.workTimeDo.info = workTime;
          this.workTimeDo.type = "edit"
          this.workTimeDo.index = index
          this.$nextTick(function () {
            this.workTimeDo.form = Object.assign({},{
              num: workTime.timeConsuming,
              begin_time: moment(workTime.begin_time),
              content: workTime.workContent,
            })
          })
      } else {
          this.workTimeDo.type = "add"
          this.workTimeDo.info = null;
      }
    },
    doPlainWorkTime() {
      this.plainWorkTime.modalStatus = true;
      this.$nextTick(function () {
        this.plainWorkTime.form = Object.assign({},{
          work_time: this.task.initWorkingHours,
        })
      })
    },
    taskDone(taskCode, done, index, type = 'self') {
      done ? done = 1 : done = 0;
      proejctTaskDone({
        taskId:taskCode,
        finishStatus:done
      }).then(res=>{
        if(res.data.code == 0){
          this.childTaskList[index].finishStatus = done
          this.getProjectLogList()
        }
      })
    },
    handleTaskAction(val){
      const arr = val.split(",")
      this.task[arr[0]] = arr[1]
      let newObj = {}
      newObj.id = this.code
      newObj[arr[0]] = arr[1]
      if([arr[0]]=='finishStatus'){
        proejctTaskDone({
          taskId:this.code,
          finishStatus:arr[1]
        }).then(res=>{
          if(res.data.code==0){
            this.getProjectLogList()
          }
        })
      }else{
        this.editTask(newObj)
      }
    },
    createTask() {
      this.$message.closeAll()
      if(!this.childTaskName){
        this.$message.info("请填写任务标题")
        return
      }
      projectTaskSave({
        pid:this.code,
        mouldId:this.mouldId,
        projectId:this.projectCode,
        executeMemberId:this.childExecutor.id,
        name:this.childTaskName
      }).then(res=>{
        if(res.data.code == 0 ){
          this.childTaskName = ''
          let oldChildTaskList = JSON.parse(JSON.stringify(this.childTaskList))
          oldChildTaskList.push(Object.assign({},{finishStatus:0,childrenStatus:true},res.data.data))
          this.childTaskList = JSON.parse(JSON.stringify(oldChildTaskList))
          this.getProjectLogList()
        }
      })
    },
    removeTag(tag, index) {
      projectTaskSetTag({
        taskId:this.code,
        tagId:tag.id
      }).then(res=>{
        if(res.data.code == 0 ){
          this.taskTags.splice(index,1)
          this.task.tags.splice(index,1)
        }
      })
    },
    priColor(pri) {
      switch (pri) {
        case 1:
          return 'warning';
        case 2:
          return 'danger';
        default:
          return 'success';
      }
    },
    doContent() {
      let content = this.$refs.vueWangeditor.getHtml();
      const obj = {
          id: this.code,
          remark: content
      };
      let that = this
      this.editTask(obj,function(){
        that.task.remark = content
        that.showTaskDescriptionEdit = false;
        that.$nextTick(() => {
            that.checkShowMoreDesc(false, true);
        });
        that.getTaskLog();
      })
    },
    editTask(obj,callback){
      projectTaskEdit(obj).then(res=>{
        if(res.data.code == 0 ){
          if(callback){
            callback()
          }
        }
      })
    },
    showTaskDesc() {
      if (this.task.recycleFlag==1) {
          return false;
      }
      this.showTaskDescriptionEdit = true;
      this.initContent(this.task.remark)
    },
    initContent(value) {
      if (value) {
          this.$refs.vueWangeditor.setHtml(value)
      } else {
          this.$refs.vueWangeditor.setHtml('')
      }
      this.$nextTick(() => {
          this.checkShowMoreDesc(false, true);
      });
    },
    checkShowMoreDesc(show = false, init = false) {
      let dom = $(".description-txt");
      if (!init) {
          if (show) {
              this.showMoreDesc = true;
              dom.css("max-height", () => {
                  return '100%';
              });
          } else {
              this.showMoreDesc = false;
              dom.css("max-height", () => {
                  return '300px';
              });
          }
      }
      if (init) {
          const height = dom.height();
          if (height >= 300) {
              this.hasMoreDesc = true;
              return true;
          } else {
              this.hasMoreDesc = false;
              return false;
          }
      }
      return false;
    },
    showEndTime(){
      if(this.task.recycleFlag==1){
        return
      }
      this.$refs.endTime.focus()
    },
    showBeginTime(){
      if(this.task.recycleFlag==1){
        return
      }
      this.$refs.beginTime.focus()
    },
    doName() {
      this.showEditName = false;
      if (!this.task.name.trim() || this.task.name == this.taskName) {
        this.task.name = this.taskName;
        return false;
      }
      this.editTask({
        name:this.task.name,
        id:this.code
      })
      // this.editTask({name: this.task.name});
    },
    editTitle() {
      this.showEditName = true;
      this.$nextTick(() => {
          this.$refs.inputTitle.focus();
      });
    },
    copyLink() {
      this.$notify({
          title: '复制链接成功',
          message: '你可以在其他标签页粘贴并快速打开任务页面',
          position: 'bottom-left',
          type: 'success'
      });
    },
    detailClose(){
      this.$emit('handleClose')
    },
    handleIsCommand(val){
      this.taskLogType = val
      switch(val){
        case 'all':
          this.taskLogList = JSON.parse(JSON.stringify(this.taskLogListCopy))
          break;
        case '1':
          this.taskLogList = this.taskLogListCopy.filter(item=>{return item.isComment==0})
          break;
        case '0':
          this.taskLogList = this.taskLogListCopy.filter(item=>{return item.isComment!=0})
          break;
      }
    },
    recoveryTask(){
      projectTaskRecovery({taskId:this.code}).then(res=>{
        if(res.data.code==0){
          this.$message.success("任务已恢复")
          this.task.recycleFlag = 0
        }
      })
    },
    deleteTask(){
      projectTaskDel({taskId:this.code}).then(res=>{
        if(res.data.code == 0 ){
          if(this.task.pid!=-1){
            this.init(this.task.pid)
          }else{
            this.detailClose()
          }
        }
      })
    },
    startTimeChange(val){
      if(!val){
        this.task.setBeginTime = false;
      }else{
        this.task.setBeginTime = true;
      }
      this.task.begin_time_format = relativelyTaskTime(val, true);
      this.editTask({id:this.code,startTime:moment(val).format('yyyy-MM-DD HH:mm:ss')})
      this.$forceUpdate()
    },
    endTimeChange(val){
      if(!val){
        this.task.setEndTime = false;
      }else{
        this.task.setEndTime = true;
      }
      this.task.end_time_format = relativelyTaskTime(val, true);
      this.editTask({id:this.code,endTime:moment(val).format('yyyy-MM-DD HH:mm:ss')})
      this.$forceUpdate()
    },
    visibleExecMember(val){
      this.visibleExecMembermenu = val
    },
    changeExecutor(item){
      if(item){
        this.task.executeMemberId=item.id
        this.task.executor = JSON.parse(JSON.stringify(item))
        this.currentExecutor = item
      }else{
        this.task.executeMemberId=''
        this.task.executor = JSON.parse(JSON.stringify({}))
        this.currentExecutor = {}
      }
      this.$refs.visibleExecMember.hide()
    },
    changeChildExecutor(item,ref=''){
      if(item){
        this.childExecutor = JSON.parse(JSON.stringify(item))
      }else{
        this.childExecutor = JSON.parse(JSON.stringify({}))
      }
      this.$forceUpdate()
      this.$refs[ref].hide()
    },
    priorCommand(val){
      let that = this
      this.editTask({id:this.code,priorityLevel:val},function(){
        that.task.priorityLevel = val
      })
    },
    moveTaskClose(){
      this.moveTask.confirmLoading = false
      this.$refs['moveTaskForm'].resetFields();
      this.moveTask.modalStatus = false
    },
    moveTaskHandleSubmit(){
      this.$refs['moveTaskForm'].validate((valid) => {
        if (valid) {
          this.moveTask.confirmLoading = true
          projectTaskMove({taskId:this.code,...this.moveTaskForm}).then(res=>{
            if(res.data.code==0){
              this.moveTaskClose()
              this.init()
            }
          })
        }
      });
    },
    copyTaskClose(){
      this.copyTask.confirmLoading = false
      this.$refs['copyTaskForm'].resetFields();
      this.copyTask.modalStatus = false
    },
    copyTaskHandleSubmit(){
      this.$refs['copyTaskForm'].validate((valid) => {
        if (valid) {
          this.copyTask.confirmLoading = true
          let newObj = JSON.parse(JSON.stringify(this.copyTaskForm))
          for(let key in newObj){
            if(newObj[key]  === true){
              newObj[key] = 1
            }else if(newObj[key]  === false){
              newObj[key] = 0
            }
          }
          projectTaskCopy({taskId:this.code,...newObj}).then(res=>{
            if(res.data.code == 0){
              this.copyTaskClose()
            }
          })
        }
      });
    },
    changetTaskTag(item,type){
      console.log(item,type);
      this.$nextTick(()=>{
        if(type=='index'){
          this.taskTags.splice(item,1)
          this.task.tags.splice(item,1)
        }else if(type=='edit'){
          const index = this.taskTags.findIndex(items => items.id == item.id)
          this.taskTags.splice(index,1,item)
          this.task.tags.splice(index,1,item)
        }else{
          this.taskTags.push(item)
          this.task.tags.push(item)
        }
      })
    },
    visibleChangeChildTaskAdd(bool){
      this.visibleChildTaskAdd = bool
    },
    changeChildTaskShow(val,index){
      this.childTaskList[index].taskMemberShow = val
      this.$forceUpdate()
    },
    childTaskMemberDrop(item,ref){
      const copyRefs = ref
      this.childTaskList[copyRefs.replace('childrenTask','')].executor = JSON.parse(JSON.stringify(item))
      this.$refs[ref][0].hide()
    },
    handleSuccess(response, file, fileList) {
      if(response.code == 0 ){
        projectTaskUploadFile(Object.assign({},this.task,{baseFile:response.data})).then(res=>{
          if(res.data.code == 0){
            this.taskSourceList.push(res.data.data)
          }
        })
      }
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error('文件大小不能超过20MB!')
      }
      return isLt2M
    },
    fileCommand(val){
      let arr = val.split(',')
      if(arr[0]=='cancal'){
        projectTaskCancelRelation(this.taskSourceList[arr[1]]).then(res=>{
          if(res.data.code==0){
            this.taskSourceList.splice(arr[1],1)
          }
        })
      }else if(arr[0]=='copy'){
        this.$copyText(this.taskSourceList[arr[1]].fileUrl).then(res=>{
          if(res.code==0){
            this.$message.success("复制链接成功")
          }
        })
      }
    },
    invitTaskVisibleChange(bool){
      this.invitTaskVisible = bool
    },
    projectIdChange(val){
      if(val){
        this.copyTaskForm.mouldId = ''
        this.moveTaskForm.mouldId = ''
      }
      projectTaskListMould({type:1,projectId:this.action=='copy'?this.copyTaskForm.projectId:this.moveTaskForm.projectId}).then(res=>{
        if(res.data.code==0){
          this.mouldIdOptions = res.data.data
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.el-avatar--small{
  width:24px;
  height: 24px;
  line-height: 24px;
}
a{
  cursor: pointer;
  &:hover{
    color:#1890ff;
  }
}
.el-dropdown-menu {
  width: 240px;
}
.auto-dropdown{
  width:auto !important;
}
.menu-item-content{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-dropdown-menu__item{
  padding: 8px 16px;
  position: relative;
}
.field-flex {
  display: flex;
  justify-content: flex-start;
}
.task-detail-box{
  .task-header {
    padding: 20px 0;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    vertical-align: middle;
    margin-left: -20px;
    .head-title {
      padding: 0 20px 0 20px;
      flex: 1 1;

      .breadcrumb {
        display: inline;

        a {
          color: inherit;

          &:hover {
          color: #40a9ff;
          }

        }
      }
    }

    .header-action {
      font-size: 16px;
      padding: 0 20px;
      display: flex;
      max-height: 24px;

      .action-item {
        margin-left: 10px;
        padding: 4px;
        transition: 218ms;
        transition-property: background, color;
        border-radius: 4px;
        align-items: center;
        display: flex;
        text-align: center;
        justify-content: center;
        min-width: 32px;
        cursor: pointer;
        span {
          margin-left: 6px;
          font-size: 14px;
        }

        &.active {
          color: #3da8f5;
        }

        &:hover {
          background: #ecf6fe;
          color: #3da8f5;
          border-radius: 4px;
        }
      }
    }

    &.disabled {
      background: #f5f5f5;
    }
  }
  .task-wrap {
    height: calc(100vh - 18vh);
    .task-content {
      display: flex;
      justify-content: flex-start;
      height: 100%;
      .content-left {
        border-right: 1px solid #e5e5e5;
        min-width: 560px;
        width: 930px;
        max-width: 930px;
        .task-title {
          margin: 10px 40px 20px 20px;
          cursor: text;

          &.disabled {
            cursor: not-allowed;

            &:hover {
              background: inherit;
            }

            .el-input, .title-text {
              &:hover, &:focus {
                  background: inherit;
              }
            }
          }

          &:hover {
            background: #f5f5f5;
          }
          &.hover-none{
            background: initial;
          }

          .title-text {
            line-height: 24px;
          }
          /deep/.el-input__inner{
            height: 40px;
          }
          /deep/.el-input__inner, .title-text {
            font-size: 20px;
            padding: 8px;
            border: none !important;
            border-radius: 4px;
            &:hover, &:focus {
              background: #f5f5f5;
              box-shadow: none !important;
              border-right-width: 0 !important;
              border: none !important;
              border-radius: 4px;
            }
          }
        }
        .task-basic-attrs-view {
          .field-list {
            padding: 0 40px 0 32px;
            &.disabled {
              .field-right, a {
                  cursor: not-allowed !important;
              }
            }

            .component-mount {
              .field {
                display: flex;
                justify-content: flex-start;
                margin: 12px 0;
                min-height: 36px;

                .field-left {
                  align-self: flex-start;
                  width: 132px;
                  height: 36px;
                  padding-right: 12px;
                }

                .field-right {
                  cursor: pointer;
                  max-width: calc(100% - 142px);

                  .inline-block {
                    display: inline-block;
                    .el-tag{
                      margin-right:10px;
                      margin-top: 5px;
                      margin-bottom: 5px;
                    }
                    .el-tag:last-child{
                      margin-right:0px;
                    }
                  }

                  &.field-date {
                      display: flex;
                  }

                  &.width-block {
                    width: 100%;

                    .w-e-text {
                        cursor: text;
                    }
                  }

                  .name {
                    margin: 0 8px;
                    display: flex;
                    flex-direction: column;
                  }
                }

                .block-field {
                  width: 100%;
                  border: 1px solid #e5e5e5;
                  border-radius: 4px;
                  padding: 2px 0;
                  margin-bottom: 12px;
                  display: flex;
                  justify-content: flex-start;
                  flex-direction: row;
                  .list-item{
                    padding: 6px 0px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    // &:hover {
                    //   background: #f5f5f5;
                    // }
                    // &.hover-none{
                    //   background: initial;
                    // }
                  }
                }

                .task-child {
                  width: 100%;

                  .task-list {
                    padding: 8px 0;

                    .list-item {
                      padding: 4px 12px 4px 5px;
                      display: flex;
                      align-items: center;
                      /*justify-content: space-between;*/

                      .task-title, .task-input {
                          flex: 1 1;
                          margin: 0;
                      }

                      .title-text {
                        color: #333;
                        line-height: 14px;
                        display: flex;
                        // align-items: center;
                        &.done {
                          color: #a6a6a6;
                        }
                      }
                      .title-text {
                          font-size: 14px;

                          &:hover, &:focus {
                          }
                      }

                      .check-box-wrapper {
                        margin-top: 0;
                      }

                      .task-item {
                        cursor: pointer;
                        margin-right: 12px;
                        padding: 0px;
                        &.disabled {
                          cursor: not-allowed;
                        }

                        &.check-box {
                          .anticon-check {
                            visibility: visible;
                            top: 14px;
                            left: 18px;
                          }
                        }

                      }
                    }

                    .action-btn {
                      padding: 2px 12px 2px 16px;
                    }
                  }

                  .add-handler {
                    /*margin-bottom: 8px;*/
                    padding-left: 16px;
                    padding-right: 12px;
                    display: flex;
                    align-items: center;
                    height: 36px;
                  }
                }

                .file-list {
                  width: 100%;
                  padding: 8px;

                  // .ant-list-item {
                  //   padding: 10px 12px;
                  //   border-bottom: none;
                  //   border-radius: 4px;
                  //   margin-bottom: 2px;

                  //   &:hover {
                  //     background-color: #f5f5f5;
                  //   }

                  //   .ant-list-item-meta-title {
                  //     margin-bottom: 0;
                  //     line-height: 24px;
                  //   }
                  // }
                }
              }

              .field-name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-left: 8px;
              }

              .task-description {
                &:hover {
                  background: #f5f5f5;
                  border-radius: 4px;
                }

                &.disabled {
                  &:hover {
                    background: inherit;
                  }
                }

                padding: 8px;
                margin: -8px;

                .description-txt {
                  max-height: 300px;
                  overflow: hidden;
                  /deep/p{
                    margin:0;
                  }
                }

                p {
                  margin: 0;
                }
              }
            }
          }
        }
      }
      .content-right{
        width: 410px;
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100vh - 18vh);
        .header {
          padding: 15px 20px 20px 20px;
          .member-list {
            padding-top: 12px;
            display: flex;
            justify-content: flex-start;
            .member-item {
              margin-right: 10px;
              cursor: pointer;

              &.invite {
                cursor: pointer;
              }
            }
          }
        }
        .log-wrap {
          border-top: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 10px;
          .header {
            width: 100%;
          }
          .log-list {
            /*font-size: 12px;*/
            padding: 0 20px 0 20px;

            .show-more {
              display: block;
              margin-bottom: 20px;
            }

            .log-comment {
              max-width: 405px;
              align-items: end;
              margin-bottom: 15px;
            }

            .list-item {
              display: flex;
              justify-content: flex-start;
              align-items: baseline;
              vertical-align: middle;
              width: 100%;
              .log-item {
                margin-right: 12px;
                margin-bottom: 24px;

                .anticon {
                  font-size: 14px;
                }

                .log-content {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  border-left: 5px solid #ccc;
                  padding-left: 12px;
                  margin-top: 6px;
                }
              }

              .log-txt {
                flex: 1 1;
              }
            }
          }
        }
        .footer {
          padding: 18px 18px 18px 18px;
          display: flex;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.popper-class{
  .el-select-dropdown__empty{
    width: 230px;
  }
}
</style>
