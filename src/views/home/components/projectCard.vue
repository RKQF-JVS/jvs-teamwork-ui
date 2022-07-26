<template>
  <div class="project-card-box">
    <el-card class="project-card" shadow="hover" :body-style="{padding: '20px' }">
      <div class="project-header">
        <div class="project-img">
          <img :src="item.img" alt="" >
        </div>
        <div class="project-title">
          <router-link :to="'/project/index'">
            <i class="el-icon-star-on"></i>{{item.taskName}}
          </router-link>
        </div>
        <div class="project-desc">
          <span v-if="item.description">{{ item.description }}</span>
          <span v-else>暂无介绍</span>
        </div>
        <div class="project-line">
          <el-divider></el-divider>
        </div>
      </div>
      <div class="project-info">
          <a href="/#/">{{ item.name }}</a>
          <span class="datetime">{{ formatTime(item.createTime) }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import {relativelyTime} from '@/util/date.js'
  export default {
    components: {},
    props: {
      item:{
        type:Object,
        default:()=>{return {}}
      }
    },
    data() {
      return {
      };
    },
    watch: {},
    created() {},
    mounted() {},
    computed: {},
    methods: {
      formatTime(time) {
        return relativelyTime(time);
      },
    }
  };
</script>
<style lang="scss" scoped>
.project-card-box{
  .project-card{
    border-radius: 0px  !important;
    cursor: pointer;
    .project-header{
      .project-img{
        height: 128px;
        img{
          width: 100%;
          height: 100%;
          display: block!important;
          object-fit: cover!important;
        }
      }
      .project-title{
        a{
          color: rgba(0,0,0,.85);
          line-height: 24px;
          height: 24px;
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
          i{
            color: orange;
          }
        }
        a:hover{
          color: #409EFF;
          i{
            color: orange;
          }
        }
      }
      .project-desc{
        font-size: 14px;
        color: rgba(0,0,0,.45);
        height: 22px;
        line-height: 22px;
        overflow: hidden;
      }
      .project-line{
        .el-divider--horizontal{
          margin: 12px 0px !important;
        }
      }
    }
    .project-info{
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
          color: rgba(0, 0, 0, 0.45);
          display: inline-block;
          flex: 1 1 0;

          &:hover {
              color: #1890ff;
          }
      }

      .datetime {
          color: rgba(0, 0, 0, 0.25);
          flex: 0 0 auto;
          float: right;
      }
    }
  }
}
</style>
