<template>
  <div class="analysis-page" id="analysis-page">
    <el-row :gutter="20">
      <el-col :span="6" :lg="6" :md="12" :sm="12" :xl="24" :xs="24" >
        <card name="项目总数" footerName="本月立项">
          <span slot="footer">
            3
          </span>
        </card>
      </el-col>
      <el-col :span="6" :lg="6" :md="12" :sm="12" :xl="24" :xs="24" >
        <card name="任务总数" footerName="今日任务"></card>
      </el-col>
      <el-col :span="6" :lg="6" :md="12" :sm="12" :xl="24" :xs="24" >
        <card name="逾期任务" footerName="逾期率"></card>
      </el-col>
      <el-col :span="6" :lg="6" :md="12" :sm="12" :xl="24" :xs="24" >
        <card name="整体进度" footerName="周同比"></card>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="24">
        <el-card class="header-no-padding-tb">
          <div slot="header" class="card-header" :class="{'header-flex':isWidth640}">
            <div class="header-right">
              <el-button type="text">今日</el-button>
              <el-button type="text">本周</el-button>
              <el-button type="text">本月</el-button>
              <el-button type="text" style="padding-right:10px;">本年</el-button>
              <el-date-picker
                style="width:260px;"
                size="small"
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div class="header-left">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="项目数" name="first"></el-tab-pane>
                <el-tab-pane label="任务数" name="second"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="card-body">
            <el-col :span="16">图表</el-col>
            <el-col :span="8">
              <div class="list-title">任务数排行榜</div>
              <div v-for="(item,index) in 7" :key="index" class="list-item">
                <span :class="{'active':index<3}">{{index+1}}</span>
                <span>xx公司1号员工</span>
                <span>{{item}}</span>
              </div>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top:15px;">
      <el-col :span="12">
        <el-card class="padding-bt-sm">
          <div slot="header" class="clearfix">
            <span>我的项目</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
          <el-pagination
            style="text-align:right;padding-top:10px;"
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>任务优先级分布</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import card from './card'
export default {
  components: {card},
  props: {},
  data() {
    return {
      activeName:'first',
      value1:'',
      screenWidth: '',
      screenHeight: ''
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.screenWidth = document.getElementById('analysis-page').clientWidth;
    this.screenHeight = document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.getElementById('analysis-page').clientWidth;
        this.screenHeight = document.body.clientHeight;
      })();
    };
  },
  computed: {
    isWidth640(){
      return this.screenWidth<640
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
};
</script>
<style lang="scss" scoped>
.analysis-page{
  padding: 20px 20px 0px;
  .header-flex{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .card-header{
    // display: flex;
    // justify-content: space-between;
    // flex: 1 1 auto;
    // flex-wrap: wrap;
    padding: 7px 0px 0px;
    .header-left{
      position: relative;
      box-sizing: border-box;
      margin-bottom: -1px;
      overflow: hidden;
      font-size: 14px;
      white-space: nowrap;
      zoom: 1;
      /deep/.el-tabs__nav-wrap::after{
        background: none !important;
      }
      /deep/.el-tabs__header{
        margin: 0 !important;
      }
    }
    .header-right{
      float: right;
      display: flex;
      flex-wrap: wrap;
    }
  }
  .card-body{
    display: flex;
    flex: 1 1 auto;
    .list-title{
      margin-bottom: 16px;
    }
    .list-item + .list-item{
      margin-top: 16px;
    }
    .list-item{
      span{
        color: rgba(0,0,0,.65);
        font-size: 14px;
        line-height: 22px;
      }
      span:first-child{
        background-color: #f5f5f5;
        border-radius: 20px;
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        margin-right: 24px;
        height: 20px;
        line-height: 20px;
        width: 20px;
        text-align: center;
      }
      span:nth-child(2n){
        letter-spacing: 2px;
      }
      span:last-child {
        float: right;
      }
      span.active{
        background-color: #314659;
        color: #fff;
      }
    }
  }
}
</style>

