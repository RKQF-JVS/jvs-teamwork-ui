<template>
  <el-dialog
    title="邀请新成员"
    :visible.sync="actionInfo.modalStatus"
    width="500px"
    custom-class="add-new-user"
    append-to-body
    :close-on-click-modal="false"
    :before-close="addNewUserClose">
    <div class="add-new-user-type">
      <span>账号邀请</span>
      <!-- <span  class="link-invite" @click="linkInfo.modalStatus = true">通过链接邀请</span> -->
    </div>
    <el-input v-model="addNewUserSearch" placeholder="输入昵称或邮箱查找"  class="user-search" style="padding:0px;margin-bottom: 15px;">
      <template slot="prefix">
        <i class="el-icon-search"></i>
      </template>
    </el-input>
    <div class="user-list-box" v-loading="loading">
      <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false,minSize:0.1}}">
        <div class="user-list-item" v-for="(item,index) in list" :key="index">
          <el-avatar :src="item.avatar" icon="el-icon-plus" class="user-avater" :size="32"></el-avatar>
          <div class="user-list-info">
            <div class="user-list-email-name">
              <span class="name">{{item.name}}</span>
              <!-- <span class="email">5455223901@qq.com</span> -->
            </div>
            <div class="user-list-operate">
              <jvs-button icon="el-icon-user" v-if="!item.isJoin" @click="invite(item)">邀请</jvs-button>
              <span v-if="item.isJoin"><i class="el-icon-user"></i>已加入</span>
            </div>
          </div>
        </div>
        <div class="text-center" v-if="showMore">
          <el-button type="text" @click="loadMore" :loading="loadMoreLoading">加载更多</el-button>
        </div>
      </vue-scroll>
    </div>
    <el-dialog :title="linkInfo.modalTitle" :visible.sync="linkInfo.modalStatus"
      width="600px"
      custom-class="add-new-user copy-link"
      append-to-body
      :close-on-click-modal="false"
      :before-close="copyLinkClose">
        <p>链接有效日期：{{linkInfo.overTime}}</p>
        <el-input placeholder="请输入内容" v-model="linkInfo.link" readonly>
            <el-button class="copy-button" slot="append" @click="copy" :data-clipboard-text="linkInfo.link">复制链接</el-button>
        </el-input>
    </el-dialog>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import Clipboard from 'clipboard'
import { projecMemberForInList,projectMemberInvite } from '@/api/project/member'
export default {
  components: {},
  props: {
    value:{
      type:Boolean,
      default(){
        return false
      }
    },
    projectId:{
      type:[String,Number],
      default(){
        return ''
      }
    }
  },
  data() {
    return {
      actionInfo: {
        modalStatus: this.value,
        confirmLoading: false,
        modalTitle: '邀请新成员',
      },
      linkInfo: {
        modalStatus: false,
        confirmLoading: false,
        modalTitle: '邀请成员',
        link: window.location.origin + '/#/invite_from_link/tqrnks7ilc5mb0v3ugd94xzw',
        overTime: '',
      },
      addNewUserSearch:'',
      loading:false,
      list:[],
      page:{
        current:1,
        pageSize:20,
        total:0
      },
      loadMoreLoading:false
    };
  },
  watch: {
    value(value) {
      this.actionInfo.modalStatus = value;
    },
    addNewUserSearch() {
      this.search();
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  computed: {
    showMore(){
      return this.page.current*this.page.pageSize<this.page.total
    }
  },
  methods: {
    init(reset = true){
      if(!this.loadMoreLoading){
        this.loading = true
      }
      if(reset){
        this.list = []
      }
      projecMemberForInList({id:this.projectId,current:this.page.current,size:this.page.pageSize,memberNickEmail:this.addNewUserSearch}).then(res=>{
        if(res.data.code == 0){
          this.list.push(...res.data.data.records)
          this.page.total = res.data.data.total
        }
      }).finally(res=>{
        this.loading = false
        this.loadMoreLoading = false
      })
    },
    copy(){
      var clipboard = new Clipboard('.copy-button')
      clipboard.on('success', e => {
          this.$message.closeAll()
          this.$message.success('复制成功')
      })
      clipboard.on('error', e =>{
        // 不支持复制
        console.log('该浏览器不支持复制')
        // 释放内存
        // clipboard.destory()
      })
    },
    copyLinkClose(){
      this.linkInfo.modalStatus = false
    },
    search: _.debounce(
      function () {
        this.page = {
          current:1,
          pageSize:20,
          total:0
        }
        this.init()
      }, 500
    ),
    addNewUserClose(){
      this.actionInfo.modalStatus = false;
      this.$emit('input', this.actionInfo.modalStatus);
      this.$emit("changeMember")
    },
    invite(item) {
      projectMemberInvite({projectId:this.projectId,memberName:item.name,memberId:item.memberId}).then((res) => {
        if (res.data.code == 0) {
          item.isJoin = true;
          // this.$emit("changeMember")
        }
      })
    },
    loadMore(){
      this.page.current++
      this.loadMoreLoading = true
      this.init(false)
    }
  }
};
</script>
<style lang="scss">
.add-new-user{
  .el-dialog__header::before{
    display: none !important;
  }
  .el-dialog__header::after{
    width: calc(100% - 0px) !important;
    left: 0px;
  }
  .el-dialog__body{
    padding: 24px;
    padding-top: 0;
    padding-right: 12px;
    padding-bottom: 24px;
    min-height: 40vh;
  }
  .add-new-user-type{
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    .link-invite{
      color: #1890ff;
      text-decoration: none;
      background-color: transparent;
      outline: none;
      cursor: pointer;
    }
  }
  .user-list-box{
    // padding-right: 12px;
    height: 500px;
    // overflow-y: auto;
    // overflow-x: hidden;
    .user-list-item{
      display: flex;
      // align-items: center;
      border-bottom: 1px solid #e8e8e8;
      padding: 12px 0;
      .user-list-info{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        .user-list-email-name{
          display: flex;
          flex-direction: column;
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
        .user-list-operate{
          cursor: pointer;
          padding-right: 8px;
          button{
            color: #333;
            background-color: #fff;
            border-color: #d9d9d9;
            border-style: dashed;
            &:hover{
              color: #40a9ff;
              background-color: #fff;
              border-color: #40a9ff;
            }
          }
        }
      }
      &:last-child{
        border-bottom: none;
      }
    }
  }
}
.copy-link{
  .el-dialog__body{
    padding: 24px;
    padding-top: 0;
    padding-right: 12px;
    padding-bottom: 24px;
    min-height: auto;
  }
  .el-input-group__append{
    cursor: pointer;
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgba(0,0,0,0.12)
  }
}
</style>
