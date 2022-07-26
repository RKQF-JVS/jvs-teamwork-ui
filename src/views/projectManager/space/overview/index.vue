<template>
  <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false,minSize:0.1}}">
    <div class="overview-page">
      <!-- <div class="overview-item m-b">
        <div class="content-item">
          <h3 class="m-sm m-b text-center" style="font-size:18px;font-weight:500;">任务燃尽图</h3>
        </div>
      </div> -->
      <div class="overview-item">
        <div class="content-left">
          <div class="content-item log-list">
            <div class="title">
              项目信息
              <el-tooltip :mouseEnterDelay="0.5" placement="top">
                <template slot="content">
                  <span>添加信息</span>
                </template>
                <a class="pull-right muted" @click="createInfo()">
                  <i class="el-icon-circle-plus-outline"></i>
                </a>
              </el-tooltip>
            </div>
            <div class="list-content">
              <template v-if="projectInfoList.length!=0">
                <div v-for="(item,index) in projectInfoList" :key="index" class="list-content-item">
                  <div class="list-contents">
                    <el-tooltip content="123444" placement="top">
                      <span class="title cursor-pointer">123</span>
                    </el-tooltip>
                    <div class="desc muted">123123</div>
                  </div>
                  <div class="list-actions">
                    <el-tooltip content="编辑" placement="top">
                      <i class="iconfont icon-edit cursor-pointer"></i>
                    </el-tooltip>
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip content="删除" placement="top">
                      <i class="iconfont icon-delete cursor-pointer"></i>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <el-empty v-else :image-size="60"></el-empty>
            </div>
          </div>
          <div class="content-item log-list">
            <div class="title">
              项目动态
            </div>
            <div class="list-content">
              <template v-for="(item,index) in activities">
                <div class="dynamic-item" :key="index">
                  <div class="dynamic-item-avatar">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                  </div>
                  <div class="dynamic-item-title-desc">
                    <div class="dynamic-item-title ">
                      <span >{{ item.memberName }}</span>
                      <span v-if="item.is_comment == 0"><span v-html="item.remark "></span></span>&nbsp;
                      <template v-if="item.isComment == 1">发表了评论
                          <p class="comment-text">{{ item.content }}</p>
                      </template>
                      <div class="right-item muted">{{ formatTime(item.createTime) }}</div>
                    </div>
                    <div class="dynamic-item-desc">
                      {{item.projectName}}
                    </div>
                  </div>
                </div>
              </template>
              <div v-if="showLoadingMore" v-loading="loadingMore"
                :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                <el-button type="text" @click="onLoadMore">查看更多动态</el-button>
            </div>
            </div>
          </div>
        </div>
        <div class="content-right">
          <div class="content-item">
            <div class="list-content">
              <div class="default-list">
                <div v-for="(item,index) in [project]" :key="index" class="project-info-list">
                  <div style="margin-right: 16px;">
                    <el-avatar shape="square" :size="50" :src="item.cover"></el-avatar>
                  </div>
                  <div class="title-desc">
                    <span class="title">{{ item.name }}</span>
                    <div class="description muted">
                      {{item.owner_name}} 创建于
                      {{moment(item.create_time).format('YYYY年MM月DD日')}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p class="">{{project.description}}</p>
            <div class="project-date m-b-lg m-t-lg">
              <div class="muted m-b-xs">
                <el-tag type="success">项目周期</el-tag>
              </div>
              <el-date-picker
                style="width:100%;"
                v-model="projectDate"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div class="project-stats m-b-lg">
              <div class="muted m-b-xs">
                <el-tag type="success">项目统计</el-tag>
              </div>
              <div class="stats-content">
                <div class="stats-item" :key="index" v-for="(stats, index) in projectStats">
                  <div class="stats-title muted">{{stats.title}}</div>
                  <div class="stats-number">{{stats.number}}</div>
                  <el-tooltip placement="right" :mouseEnterDelay="0.3" :content="`${stats.schedule}%`">
                    <el-progress strokeColor="#1890ff" :strokeWidth="3" :showText="false" :percentage="stats.schedule"/>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div>
              <div class="muted">
                <el-tag type="success">新增任务趋势</el-tag>
              </div>

            </div>
        </div>
        </div>
      </div>
    </div>
    <el-dialog :title="infoModal.modalTitle"
      :visible.sync="infoModal.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="360px"
      top="5vh"
      :modal="true"
      :before-close="beforeClose">
      <el-form :model="infoModalForm" :rules="rules" ref="form" style="padding:20px 20px 1px 0;">
        <el-form-item label="" prop="name">
          <el-input v-model="infoModalForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input type="textarea" v-model="infoModalForm.name" placeholder="内容"></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input type="textarea" v-model="infoModalForm.name" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="action-btn pull-right">
            <el-button size="small" @click="beforeClose">取 消</el-button>
            <el-button type="primary" size="small" @click="handleSave"  class="middle-btn">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </vue-scroll>
</template>

<script>
import { relativelyTime } from '@/util/date.js'
import moment from "moment";
export default {
  components: {},
  props: {},
  data() {
    return {
      projectStats:[{
          title: '未完成',
          key: 'unDone',
          number: 0,
          schedule: 0
        },
        {
          title: '已完成',
          key: 'done',
          number: 0,
          schedule: 0
        },
        {
          title: '已逾期',
          key: 'overdue',
          number: 0,
          schedule: 0
        },
        {
          title: '待认领',
          key: 'toBeAssign',
          number: 0,
          schedule: 0
        },
        {
          title: '今日到期',
          key: 'expireToday',
          number: 0,
          schedule: 0
        },
        {
          title: '逾期完成',
          key: 'doneOverdue',
          number: 0,
          schedule: 0
        },],
      project:{
        "cover": require('@/styles/cover.jpeg'),
        "name": "demo",
        "code": "k3hgn7acf6lprqzxms54u8ye",
        "description": "",
        "access_control_type": "open",
        "white_list": null,
        "order": 0,
        "deleted": 0,
        "template_code": "",
        "schedule": 0,
        "create_time": "2022-01-25 15:33:05",
        "organization_code": "6v7be19pwman2fird04gqu53",
        "deleted_time": null,
        "private": 1,
        "prefix": null,
        "open_prefix": 0,
        "archive": 0,
        "archive_time": null,
        "open_begin_time": 1,
        "open_task_private": 0,
        "task_board_theme": "simple",
        "begin_time": "2022-01-08",
        "end_time": "2022-02-15",
        "auto_update_schedule": 0,
        "collected": 0,
        "owner_name": "18610614481",
        "owner_avatar": ""
      },
      projectDate:'',
      showLoadingMore:false,
      loadingMore:false,
      activities:[{
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
      }],
      projectInfoList:[{}],
      infoModalForm:{},
      infoModal: {
        newData: {
          code: ''
        },
        loading: false,
        modalStatus: false,
        modalTitle: '添加字段',
      },
      rules:{}
    };
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    moment,
    beforeClose(){
      this.infoModal.modalStatus = false
    },
    createInfo(){
      this.infoModal.modalStatus = true
    },
    formatTime(time) {
      return relativelyTime(time);
    },
    handleSave(){

    },
    onLoadMore(){

    }
  }
};
</script>
<style lang="scss" scoped>
.overview-page{
  padding: 24px 12px 12px;
  width: 1080px;
  margin:auto auto;
  background: initial;
  .overview-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .content-item {
    background: #fff;
    padding: 6px 18px 18px 18px;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    .title {
      font-size: 16px;
      padding: 6px 0 0 0;
    }
  }
  .content-left{
    width: 730px;
    .log-list {
      background: #fff;
      margin-bottom: 15px;

      .list-content {
        padding-top: 12px;
        .dynamic-item{
          display: flex;
          align-items: center;
          padding: 12px 0px;
          border-bottom: 1px solid #e8e8e8;
          .dynamic-item-avatar{
            margin-right: 16px;
          }
          .dynamic-item-title-desc{
            width: 100%;
            position: relative;
            .dynamic-item-title{
              margin-bottom: 4px;
              color: #333;
              font-size: 14px;
              line-height: 22px;
              .right-item{
                float: right;
                position: absolute;
                right: 0;
                top: 0;
              }
            }
            .dynamic-item-desc{
              color: rgba(0,0,0,.45);
              font-size: 14px;
              line-height: 22px;
              a {
                color: rgba(0, 0, 0, 0.45);
                display: inline-block;
                flex: 1 1 0;

                &:hover {
                  color: #1890ff;
                }
              }
            }
          }
        }
        .dynamic-item:last-child{
          border-bottom:none ;
        }
        .right-item {
          float: right;
          position: absolute;
          right: 0;
          top: 0;
        }
        .list-content-item{
          display: flex;
          flex: 1 1 auto;
          align-items: center;
          justify-content: space-between;
          .list-contents{
            font-size: 14px;
          }
          .list-actions{
            i{
              position: relative;
              display: inline-block;
              color: rgba(0,0,0,.45);
              font-size: 14px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .content-right{
    width: 325px;
    .project-date {
      .el-date-editor {
        border: none;

        &:focus {
          border: none;
        }
      }
      /deep/.el-range__icon{
        opacity: 0;
      }
    }
    .content-item{
      .list-content{
        .default-list{
          .project-info-list{
            padding: 12px 0px;
            display: flex;
            .title-desc{
              font-size: 14px;
              .description{
                margin-top: 4px;
              }
            }
          }
        }
      }
    }
    .project-stats {
      font-size: 14px;
      .stats-content {
        display: flex;
        flex-wrap: wrap;
        .stats-item {
          width: 80px;
          margin-right: 16px;
          margin-bottom: 16px;
          padding: 12px;
          box-sizing: border-box;
          .stats-title {
          }
          .stats-number {
            font-size: 32px;
          }
        }
      }
    }
  }
}
.pull-right:hover{
  color: #40a9ff;
  cursor: pointer;
}
</style>
