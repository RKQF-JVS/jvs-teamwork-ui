<template>
  <div class="member-menu project-member-menu" v-loading="projectMemberLoading || taskMemberLoading">
    <div class="search-content">
      <el-input v-model="keyword" placeholder="搜索">
        <i slot="prefix" class="el-icon-search"/>
      </el-input>
    </div>
    <div class="member-list" style="padding:0px;">
      <vue-scroll :ops="{bar: {background: '#cecece'}}" style="height:270px;">
         <div class="list-group" v-show="!keyword">
            <span class="title muted">参与者</span>
            <div class="member-list-item ant-list-item" :class="{'owner':item.isOwner}" @click="addToInvite(item.code,item.is_owner)" v-for="(item,index) in invitTaskList" :key="index" v-show="invitTaskList.length">
              <div class="ant-list-item-meta">
                <div class="ant-list-item-meta-avatar">
                  <el-avatar icon="el-icon-user" :size="32" :src="item.userDto.headImg"></el-avatar>
                </div>
                <div class="ant-list-item-meta-content">
                  <h4 class="ant-list-item-meta-title"><span>{{item.userDto.realName}}</span></h4>
                </div>
              </div>
              <ul class="ant-list-item-action">
                <li>
                  <span><i class="el-icon-check" v-show="showCheck(item.memberId)"></i></span>
                </li>
              </ul>
            </div>
         </div>
          <div class="list-group">
            <span class="title muted">其他成员</span>
            <div class="member-list-item ant-list-item" @click="addToInvite('all')">
              <div class="ant-list-item-meta">
                <div class="ant-list-item-meta-avatar">
                  <el-avatar icon="el-icon-user" :size="32"></el-avatar>
                </div>
                <div class="ant-list-item-meta-content">
                  <h4 class="ant-list-item-meta-title"><span>所有项目成员</span></h4>
                </div>
              </div>
              <ul class="ant-list-item-action" v-show="showCheck('all')">
                <li>
                  <span><i class="el-icon-check"></i></span>
                </li>
              </ul>
            </div>
            <div class="member-list-item ant-list-item" v-for="(item,index) in projectMemberList" :key="index" v-show="projectMemberList.length">
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
                  <span><i class="el-icon-check" v-show="showCheck(item.memberId)"></i></span>
                </li>
              </ul>
            </div>
            <div class="ant-list-empty-text" v-if="keyword && keyword.length > 1 && !projectMemberList.length">
              该成员不在项目成员列表中
            </div>
          </div>
      </vue-scroll>
    </div>
    <div class="footer">
      <el-button type="primary" @click="inviteTaskMember"  style="width:100%;">确定</el-button>
    </div>
  </div>
</template>
<script>
import { getProjectMember } from '@/api/project/member'
export default {
  components: {},
  props: {
    invitTaskList:{
      type:[Array],
      default(){
        return []
      }
    },
    projectId:{
      type:[Number,String],
      default(){
        return ''
      }
    },
    taskId:{
      type:[Number,String],
      default(){
        return ''
      }
    }
  },
  data() {
    return {
      keyword: '',
      searching: false,
      taskMemberLoading: false,
      projectMemberLoading: false,
      showInviteMember: false,
      projectMemberList: [],
      listTemp: JSON.parse(JSON.stringify(this.invitTaskList)),
      projectMemberListCopy: [],
      initAllMember: false, //初始化选择“所有项目成员”
    };
  },
  created() {
    this.init();
  },
  watch: {
    keyword() {
      this.search();
    }
  },
  mounted() {},
  computed: {},
  methods: {
    addToInvite(code, isOwner = false) {
      if (isOwner) {
        return false;
      }
      if (code == 'all') {
        this.initAllMember = true;
      }
      const index = this.listTemp.findIndex(item => item.memberId == code);
      if (index !== -1) {
        this.listTemp.splice(index, 1);
      } else {
        this.listTemp.push({memberId:code});
      }
    },
    showCheck(code) {
      if (code == 'all' && !this.initAllMember) {
        return false;
      }
      const index = this.listTemp.find(item => item.memberId == code);
      if (index) {
        return true;
      }
    },
    init(){
      if(this.projectId && this.taskId){
        getProjectMember({
          projectId:this.projectId,
          taskId:this.taskId
        }).then(res=>{
          if(res.data.code == 0){
            this.projectMemberList= res.data.data || []
            this.projectMemberListCopy = res.data.data || []
          }
        })
      }
    },
    search(){
      if(this.keyword){
        const newArray = this.projectMemberListCopy.filter(item=>{return item.memberInfo.realName.indexOf(this.keyword)!=-1})
        this.projectMemberList = JSON.parse(JSON.stringify(newArray))
      }else{
        this.projectMemberList = JSON.parse(JSON.stringify(this.projectMemberListCopy))
      }
    },
    inviteTaskMember(){
      this.$emit("inviteTaskMember",this.listTemp,this.projectMemberList)
    }
  }
};
</script>
<style lang="scss" scoped>
.member-menu .member-list .list-group .member-list-item.owner {
  cursor: not-allowed;
}
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
