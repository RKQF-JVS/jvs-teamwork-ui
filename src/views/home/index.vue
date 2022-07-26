<template>
  <div class="home-index">
    <!-- 头部信息 -->
    <div class="header-content">
      <div class="header-left">
        <div class="header-avatar">
          <el-avatar :size="64" :src="userInfo.headImg ? userInfo.headImg : userImg"></el-avatar>
        </div>
        <div class="header-user-info">
          <div class="user-info-title">{{helloTime}}{{ userInfo.realName }}，祝你开心每一天！</div>
          <!-- <div class="team muted" v-if="userInfo.position">{{userInfo.position}}
              <template v-if="userInfo.department"> | {{ userInfo.department }}</template>
          </div> -->
        </div>
      </div>
      <div class="header-right">
        <div class="content-item">
          <div class="item-title muted">
              任务数
          </div>
          <div class="item-text">
              <span>{{task.total}}</span>
          </div>
        </div>
        <div class="content-item">
          <div class="item-title muted">
              团队人数
          </div>
          <div class="item-text">
              <span>{{accounts.total}}</span>
          </div>
        </div>
        <div class="content-item">
          <div class="item-title muted">
              项目总数
          </div>
          <div class="item-text">
              <span>{{projectTotal}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 主体信息 -->
    <div class="page-body">
      <el-row :gutter="24">
        <el-col :span="16"  :xl="16" :lg="16" :md="24" :sm="24" :xs="24">
          <el-card class="no-padding">
            <div slot="header">
              <span>进行中的项目</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="$router.push('/project/list/my')">全部项目</el-button>
            </div>
            <cardBody :rows="6" :dataLength="projectIng.length" class="cardBody">
              <template slot="card-body">
                <el-row :gutter="0">
                  <el-col :span="6" v-for="(item,index) in projectIng" :key="index" :offset="0">
                    <projectCard :item="item"></projectCard>
                  </el-col>
                </el-row>
              </template>
            </cardBody>
          </el-card>
          <el-card class="activities-list">
            <div slot="header">
              <span>动态</span>
            </div>
            <cardBody :rows="4" :dataLength="dynamic.length">
              <template slot="card-body">
                <dynamicList :dynamic="dynamic"/>
              </template>
            </cardBody>
          </el-card>
        </el-col>
        <el-col  style="padding: 0 12px" :span="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <el-card class="padding-sm">
            <div slot="header" class="myWork">
              <span>我的任务 · 0</span>
              <el-select v-model="value" style="float: right; padding: 3px 0" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-tabs :stretch="true">
              <el-tab-pane v-for="(item,index) in tabsList" :key="index" :name="item.value">
                <span slot="label">
                  <i :class="`iconfont ${item.icon}`"></i>
                  {{item.name}}
                </span>
              </el-tab-pane>
            </el-tabs>
            <cardBody :rows="6" :dataLength="1">
              <template slot="card-body">
                <div v-loading="myWork.loading">
                  <el-empty v-if="myWork.list.length==0">

                  </el-empty>
                  <div v-else>
                    <template v-for="(item,index) in myWork.list" >
                      <div :key="index" class="myWork-item">
                        <router-link target="_blank"
                            class="task-title-wrap"
                            :to="`/project/space/task/${item.projectInfo.code}/detail/${item.code}`">
                          <el-tooltip content="优先级" placement="top">
                            <el-tag effect="dark" size="small" :color="priColor(item.pri)">{{item.priText}}</el-tag>
                          </el-tooltip>
                          <el-tooltip content="" placement="top">
                            <el-checkbox v-model="item.checked" style="margin:0px 5px;"></el-checkbox>
                          </el-tooltip>
                          <el-tooltip :content="item.name" placement="top">
                              <span>{{ item.name }}</span>
                          </el-tooltip>
                        </router-link>
                        <div>
                          <el-tooltip content="任务开始 - 截止时间" v-if="item.end_time" placement="top">
                              <span class="label m-r-sm" :class="showTimeLabel(item.end_time)">{{showTaskTime(item.begin_time, item.end_time)}}</span>
                          </el-tooltip>
                          <el-tooltip content="子任务" v-if="item.pcode" placement="top">
                              <i class="iconfont icon-adjust" style="margin-right: 10px;"></i>
                          </el-tooltip>
                          <router-link target="_blank" class="muted" :to="'/project/space/task/'">
                            <el-tooltip content="所属项目" placement="top"><span>{{ item.projectInfo.name }}</span></el-tooltip>
                          </router-link>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div style="text-align:right;">
                  <el-pagination
                    :hide-on-single-page="myWork.list.length==0"
                    small
                    layout="prev, pager, next"
                    :total="0">
                  </el-pagination>
                </div>
              </template>
            </cardBody>
          </el-card>
          <el-card class="activities-list">
            <div slot="header" >
              <span>团队 · 0</span>
            </div>
            <cardBody :rows="4" :dataLength="teams.list.length">
              <template slot="card-body">
                <div class="members">
                  <el-row>
                    <el-col :span="8" v-for="(item, index) in teams.list" :key="index">
                      <a @click="routerLink('/members/profile/' + item.membar_account_code + '?key=3')" style="display: flex;align-items: center">
                        <el-avatar size="small" :src="item.avatar"/>
                        <span class="member">{{ item.name }}</span>
                      </a>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </cardBody>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import user from '@/views/common/img/user.png'
import { showHelloTime } from '@/util/date.js'
import { getStore } from "@/util/store.js"
import cardBody from './components/cardBody.vue'
import projectCard from './components/projectCard.vue'
import dynamicList from './components/dynamicList'
let cover =  require('@/styles/cover.jpeg')
export default {
  components: {cardBody,projectCard,dynamicList},
  props: {},
  data() {
    return {
      userImg: user,
      userInfo: {},
      task:{
        total:0
      },
      accounts:{
        total:0
      },
      projectTotal:0,
      value:0,
      options:[{
        value: 0,
        label: '未完成'
      }, {
        value: 1,
        label: '已完成'
      }],
      // 进行中的项目
      projectIng:[{
        img:cover,
        name:'admin',
        description:'随便介绍',
        createTime:'2021-12-12 09:00:33',
        taskName:'测试任务'
      },{img:cover,
        name:'admin',
        description:'',
        createTime:'2021-12-12 09:00:33',
        taskName:'测试任务'},{img:require('@/styles/cover.jpeg'),
        name:'admin',
        description:'',
        createTime:'2021-12-12 09:00:33',
        taskName:'测试任务'},{img:require('@/styles/cover.jpeg'),
        name:'admin',
        description:'',
        createTime:'2021-12-12 09:00:33',
        taskName:'测试任务'},{img:require('@/styles/cover.jpeg'),
        name:'admin',
        description:'',
        createTime:'2021-12-12 09:00:33',
        taskName:'测试任务'}],
      // 我的任务
      myWork:{
        loading:true,
        list:[{
          pri:1,
          priText:'普通',
          name:'测试任务',
          pcode:12,
          projectInfo:{
            code:1,
            name:'测试任务1',
          }
        },{
          pri:1,
          priText:'普通',
          name:'测试任务测试任务测试任务测试任务测试任务测试任务测试任务测试任务215643215645645645665456',
          pcode:12,
          projectInfo:{
            code:1,
            name:'测试任务1',
          }
        }]
      },
      // 动态
      dynamic:[{
        content:'1111',
        is_comment:0,
        remark:'这里是一个标签的内容',
        memberName:'不晓得是啥子',
        taskName:'任务名称',
        createTime:'2021-12-01 09:11:12',
        projectName:'test',
        projectCode:'123456'
      },{
        content:'1111',
        is_comment:0,
        remark:'这里是一个标签的内容',
        memberName:'不晓得是啥子',
        taskName:'任务名称',
        createTime:'2021-12-01 09:11:12',
        projectName:'test',
        projectCode:'123456'
      },{
        content:'1111',
        is_comment:0,
        remark:'这里是一个标签的内容',
        memberName:'不晓得是啥子',
        taskName:'任务名称',
        createTime:'2021-12-01 09:11:12',
        projectName:'test',
        projectCode:'123456'
      },],
      // 团队
      teams:{
        total:0,
        list:[
          {
            avatar:require('@/styles/cover.jpeg'),
            name:'11111'
          },{
            avatar:require('@/styles/cover.jpeg'),
            name:'11111'
          }
        ]
      },
      // 0 我执行的，1 我参与的， 2 我创建的
      activeName: '0',
      tabsList:[{
        name:'我执行的',
        icon:'icon-menu',
        value:'0'
      },{
        name:'我参与的',
        icon:'icon-team',
        value:'1'
      },{
        name:'我创建的',
        icon:'icon-rocket',
        value:'2'
      }]
    };
  },
  watch: {},
  created() {
    if(getStore({name: 'userInfo'}) && getStore({name: 'tenantId'})) {
      this.userInfo = getStore({name: 'userInfo'})
    }else{
      this.userInfo = {}
    }
  },
  mounted() {},
  computed: {
    helloTime() {
      return showHelloTime()
    }
  },
  methods: {
    routerLink(page, replace = false) {
      if (replace) {
        this.$router.replace(page);
      } else {
        this.$router.push(page);
      }
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
    priColor(pri) {
      switch (pri) {
        case 1:
          return '#ff9900';
        case 2:
          return '#ed3f14';
        default:
          return 'green';
      }
    },
  }
};
</script>
<style lang="scss">
.home-index{
  .header-content{
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 16px 32px 16px;
    border-bottom: 1px solid #e8e8e8;
    .header-left{
      display: flex;
      align-items: center;
      .header-user-info{
        margin-left: 12px;
        line-height: 33px;
        .user-info-title {
          font-size: 20px;
        }
      }
    }
    .header-right{
      display: flex;
      .content-item {
          padding: 0 32px;
          position: relative;
          .item-title{
            font-size: 14px;
          }
          .item-text {
            font-size: 30px;
            .small {
                font-size: 20px;
            }
          }
          &:after {
            background-color: #e8e8e8;
            position: absolute;
            top: 8px;
            right: 0;
            width: 1px;
            height: 40px;
            content: "";
          }
          &:last-child {
            &:after {
                width: 0;
            }
          }
      }
    }
  }
  .activities-list {

  }
  .myWork{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-card+.el-card{
    margin-top: 24px;
  }
}
.cardBody{
  .el-row{
    .el-col{
      margin-bottom:0px !important;
    }
  }
}
.myWork-item{
  border-bottom: 1px solid #e8e8e8;display: flex;justify-content: space-between ;
  padding: 12px 0px;
  .task-title-wrap{
    /*max-width: 310px;*/
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;
    color: #1890ff;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    -webkit-transition: color .3s;
    transition: color .3s;
    font-size: 14px;
    .el-tag--dark{
      border: none;
      margin-right: 8px;
    }
  }
}
.myWork-item:last-child{
  border: none;
}
.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, .65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 6px;
      transition: all 0.3s;
      display: inline-block;
      cursor: pointer;
    }

    &:hover {
        span {
            color: #1890ff;
        }
    }
  }
}
</style>
