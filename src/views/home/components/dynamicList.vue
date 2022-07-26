<template>
  <div class="dynamic-list-box">
    <template v-for="(item,index) in dynamic">
      <div class="dynamic-item" :key="index">
        <div class="dynamic-item-avatar">
           <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </div>
        <div class="dynamic-item-title-desc">
          <div class="dynamic-item-title">
            <span>{{ item.memberName }}</span>
            <span v-if="item.is_comment == 0">  <span v-html="item.remark "></span></span>&nbsp;
            <template v-if="item.isComment == 1">发表了评论
                <p class="comment-text">{{ item.content }}</p>
            </template>
            <router-link target="_blank"
                    :to="`/project/space/task/${item.projectCode}/detail/${item.sourceCode}`"
                    class="right-item">「 {{ item.taskName }} 」
            </router-link>
          </div>
          <div class="dynamic-item-desc">
              {{ formatTime(item.createTime) }} -
              <router-link target="_blank" :to="`/project/space/task/${item.projectCode}`" class="muted">
                  {{item.projectName}}
              </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {relativelyTime} from '@/util/date.js'
  export default {
    components: {},
    props: {
      dynamic:{
        type:Array,
        default:()=>[]
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
.dynamic-list-box{
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
          color: #1890ff;
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
}
</style>
