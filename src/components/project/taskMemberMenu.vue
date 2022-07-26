<template>
    <div class="member-menu" v-loading="listLoading || doListLoading">
        <div class="search-content">
          <el-input v-model="keyword" placeholder="搜索">
            <i slot="prefix" class="el-icon-search"/>
          </el-input>
        </div>
        <div class="member-list">
            <vue-scroll :ops="{bar: {background: '#cecece'}}" style="height:270px;">
              <div class="list-group" v-show="!keyword">
                <span class="title muted">执行者</span>
                <div class="member-list-item ant-list-item" v-if="!doList.length && !doListLoading" @click="assignTask(null)">
                  <div class="ant-list-item-meta">
                    <div class="ant-list-item-meta-avatar">
                      <el-avatar icon="el-icon-user" :size="32"></el-avatar>
                    </div>
                    <div class="ant-list-item-meta-content">
                      <h4 class="ant-list-item-meta-title"><span>待认领</span></h4>
                    </div>
                  </div>
                  <ul class="ant-list-item-action">
                    <li>
                      <span><i class="el-icon-check"></i></span>
                    </li>
                  </ul>
                </div>
                <div class="member-list-item ant-list-item" v-for="(item,index) in doList" :key="index" v-show="doList.length">
                  <div class="ant-list-item-meta">
                    <div class="ant-list-item-meta-avatar">
                      <el-avatar icon="el-icon-user" :size="32" :src="item.headImg"></el-avatar>
                    </div>
                    <div class="ant-list-item-meta-content">
                      <h4 class="ant-list-item-meta-title"><span>{{item.realName}}</span></h4>
                    </div>
                  </div>
                  <ul class="ant-list-item-action">
                    <li>
                      <span><i class="el-icon-check" v-show="showCheck(item)"></i></span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="list-group">
                <span class="title muted">其他成员</span>
                <div class="member-list-item ant-list-item" v-if="doList.length" @click="assignTask(null)">
                  <div class="ant-list-item-meta">
                    <div class="ant-list-item-meta-avatar">
                      <el-avatar icon="el-icon-user" :size="32"></el-avatar>
                    </div>
                    <div class="ant-list-item-meta-content">
                      <h4 class="ant-list-item-meta-title"><span>待认领</span></h4>
                    </div>
                  </div>
                </div>
                <div class="member-list-item ant-list-item" v-for="(item,index) in list" :key="index" v-show="list.length" @click="assignTask(item.memberInfo)">
                  <div class="ant-list-item-meta">
                    <div class="ant-list-item-meta-avatar">
                      <el-avatar icon="el-icon-user" :size="32" :src="item.memberInfo.headImg"></el-avatar>
                    </div>
                    <div class="ant-list-item-meta-content">
                      <h4 class="ant-list-item-meta-title"><span>{{item.memberInfo.realName}}</span></h4>
                    </div>
                  </div>
                  <ul class="ant-list-item-action">
                    <li>
                      <span><i class="el-icon-check" v-show="false"></i></span>
                    </li>
                  </ul>
                </div>
                <div class="ant-list-empty-text" v-if="keyword && keyword.length > 1 && !list.length">
                  该成员不在任务成员列表中，你可以邀请他进来
                </div>
              </div>
            </vue-scroll>
        </div>
        <div class="footer">
            <el-button type="primary" block @click="inviteProjectMember" style="width:100%;">邀请新成员</el-button>
        </div>
    </div>
</template>
<script>
import { getProjectMember,projectAssignExecutor } from '@/api/project/member'
export default {
  components: {},
  props: {
    projectCode: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    taskCode: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    isCommit: {//选择后是否提交
      type: [Boolean],
      default() {
        return true
      }
    },
    executor:{
      type:[Object],
      default(){
        return {}
      }
    },
    refs:{
      type:[String],
      default(){
        return ''
      }
    }
  },
  data() {
    return {
      keyword: '',
      searching: false,
      doListLoading: false,
      listLoading: false,
      showInviteMember: false,
      doList: [],
      list: [
      ],
      listTemp: [],
    };
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  computed: {},
  methods: {
    init(){
      if(this.projectCode){
        this.listLoading = true
        getProjectMember({projectId:this.projectCode,userId:this?.executor?.id}).then(res=>{
          if(res.data.code == 0) {
            this.list = res.data.data;
            this.listTemp = res.data.data;
          }
        }).finally(res=>{
          this.listLoading = false
        })
      }
      if(this?.executor?.id){
        this.doList.push(this.executor)
      }
    },
    inviteProjectMember() {
      this.$emit('inviteProjectMember')
    },
    assignTask(item){
      if(this.isCommit){
        projectAssignExecutor({taskId:this.taskCode,executorId:item?.id}).then(res=>{
          if(res.data.code==0){
            this.$emit("changeExecutor",item,this.refs)
          }
        })
      }else{
        this.$emit("changeExecutor",item,this.refs)
      }
    },
    showCheck(item) {
      if(item.id==this?.executor?.id){
        return true;
      }
      // if (item.is_executor) {
      //   return true;
      // }
    },
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-input{
  display: flex;
  align-items: center;
}
/deep/.el-input__prefix{
  top: auto;
  height: auto;
}
.ant-list-empty-text {
  padding: 16px;
  color: rgba(0,0,0,.25);
  font-size: 14px;
  text-align: center;
}
.member-menu{
  background: white;
  /deep/i{
    margin-right: 0px !important;
  }
}
.member-list{
  padding: 0px !important;
}
.member-menu .member-list .list-group .member-list-item {
  padding:12px;
  cursor: pointer;
  border-bottom: none;
}
.ant-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}
.ant-list-item-meta {
  display: flex;
  flex: 1;
  align-items: flex-start;
  font-size: 0;
  .ant-list-item-meta-avatar{
    display: flex;
    align-items: center;
    margin-right: 16px;
  }
}
</style>
