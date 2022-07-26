<template>
  <div class="member-menu" :class="{'creating': creating,'editing': editing}" v-loading="listLoading">
    <div class="search-content">
      <el-input v-model="keyword" :placeholder="(creating || editing) ? '标签名称': '搜索标签'">
          <i slot="prefix" class="el-icon-search" v-if="!creating && !editing"/>
          <i slot="prefix" class="el-icon-price-tag" v-else/>
      </el-input>
    </div>
    <div class="member-list tag-list">
      <template v-if="!creating && !editing">
        <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false}}" style="height:250px;">
          <div class="list-group" v-show="list.length">
            <div class="tag-list-item" v-for="(item,index) in list" :key="index"  @click="setTag(item)">
              <div class="tag-list-item-title">
                <div class="badge-item-dot" :class="`badge-item-${item.color}`">
                </div>
                {{item.name}}
              </div>
              <div class="tag-list-item-action">
                <a class="tag-edit muted">
                  <i class="el-icon-edit"  @click.stop="editTag(item,index)"></i>
                </a>
                <i class="m-l-sm el-icon-check" v-show="showCheck(item)"></i>
              </div>
            </div>
          </div>
        </vue-scroll>
      </template>
      <template v-if="creating || editing">
        <div class="tag-badge">
          <span class="badge-item" v-for="badge in badgeList" :key="badge" @click="currentBadge = badge">
            <div class="badge-item-dot" :class="`badge-item-${badge}`">
              <i class="el-icon-check" v-show="currentBadge == badge"/>
            </div>
          </span>
        </div>
      </template>
    </div>
    <div class="footer">
      <template v-if="creating">
        <el-button type="default" @click="creating = false,keyword = ''" style="width:50%;">取消</el-button>
        <el-button type="primary" :disabled="!keyword" @click="createTag" style="width:50%;">创建</el-button>
      </template>
      <template v-else-if="editing">
        <div class="del-tag-box" v-show="delTagShow">
         <div class="del-tag-model" @click="cancelTag"></div>
         <div class="del-tag-content">
            <div style="padding: 0px 0 12px">
              <i class="el-icon-warning" style="color:#e6a23c;"></i>
              <span>确认删除标签？</span>
            </div>
            <div>
              <jvs-button @click="cancelTag">取消</jvs-button>
              <jvs-button type="primary" @click="deleteTag">确认</jvs-button>
            </div>
         </div>
        </div>
        <el-button type="danger" style="width:50%;" @click="delTag">删除</el-button>
        <el-button type="primary" :disabled="!keyword" @click="saveTag" style="width:50%;margin-left:10px;">完成</el-button>
      </template>
      <template v-else>
        <el-button type="primary" block @click="creating = true,activeCreating = true" style="width:100%;">新建标签
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { projectTaskTagList,projectTaskSaveTag,projectTaskSetTag,projectTaskEditTag,projectTaskDelTag } from '@/api/project/tag'
export default {
  components: {},
  props: {
    projectCode:{
      type:[String,Number],
      default:''
    },
    taskCode:{
      type:[String,Number],
      default:''
    },
    tags:{
      type:[Array],
      default(){
        return []
      }
    }
  },
  data() {
    return {
      keyword: '',
      editing: false, //编辑标签状态
      creating: false, //创建标签状态
      activeCreating: false,//是否手动发起的创建（搜索结果为空时，也会发起创建，但不属于手动发起）
      searching: false,
      listLoading: false,
      showInviteMember: false,
      delTagShow:false,
      list: [],
      listTemp: [],
      badgeList: ['blue', 'red', 'orange', 'green', 'brown', 'purple'],
      currentBadge: 'blue',
      currentTag: {
        tag: null,
        index: -1,
      },
    };
  },
  created() {
    this.init();
  },
  watch: {
    keyword() {
      if(this.keyword){
        this.search();
      }
    }
  },
  mounted() {},
  computed: {},
  methods: {
    search(){
      this.keyword = this.keyword.trim();
      if (!this.keyword) {
        this.list = JSON.parse(JSON.stringify(this.listTemp));
        if (!this.activeCreating) {//如果不是手动发起的创建，则返回搜索结果
            this.creating = false;
        }
      }
      this.searching = true;
      this.list = this.list.filter(item => item.name.indexOf(this.keyword) != -1);
      if (!this.list.length && !this.editing) {
          this.creating = true;
      }
    },
    init(){
      if(this.projectCode){
        projectTaskTagList({projectId:this.projectCode}).then(res=>{
          if(res.data.code == 0){
            this.list = res.data.data;
            this.listTemp = res.data.data;
          }
        })
      }
    },
    async saveTag() {
      let that = this
       let res = await projectTaskEditTag(Object.assign({},that.currentTag.tag,{
        name:that.keyword,
        color:that.currentBadge
      }))
      if(res.data.code==0){
        let newObjList = JSON.parse(JSON.stringify(this.listTemp))
        newObjList[that.currentTag.index].name = that.keyword
        newObjList[that.currentTag.index].color = that.currentBadge
        this.listTemp = JSON.parse(JSON.stringify(newObjList))
        this.list = JSON.parse(JSON.stringify(newObjList))
        that.currentTag.tag.name = that.keyword;
        that.currentTag.tag.color = that.currentBadge;
        that.clearCreating();
        that.$nextTick(()=>{
          if(that.showCheck(that.currentTag.tag)){
            that.$emit('changetTaskTag',that.currentTag.tag,'edit')
          }
        })
      }

    },
    clearCreating() {
      this.editing = false;
      this.creating = false;
      this.activeCreating = false;
      this.keyword = '';
    },
    setTag(tag) {
      this.setTaskCheckTag(tag,this.showCheck(tag)?'del':'save')
    },
    checkTaskChange(tag) {
      const index = this.tags.findIndex(item => item.id == tag.id)
      if (index !== -1) {
        this.$emit('changetTaskTag',index,'index')
      } else {
        this.$emit('changetTaskTag',tag,'item')
      }
    },
    editTag(tag, index) {
      this.editing = true;
      this.keyword = tag.name;
      this.currentBadge = tag.color;
      this.currentTag.tag = tag;
      this.currentTag.index = index;
    },
    showCheck(tag) {
      const index = this.tags.findIndex(item => item.id == tag.id)
      if (index !== -1) {
        return true;
      }
    },
    async createTag(){
      let res = await projectTaskSaveTag({
        name:this.keyword,
        projectId:this.projectCode,
        color:this.currentBadge
      })
      if(res.data.code==0){
        const tag = res.data.data;
        let newObjList = JSON.parse(JSON.stringify(this.listTemp))
        newObjList.push(tag)
        this.listTemp = JSON.parse(JSON.stringify(newObjList))
        this.list  =  JSON.parse(JSON.stringify(newObjList))
        this.setTaskCheckTag(tag)
        this.clearCreating()
      }
    },
    setTaskCheckTag(tag,type = 'save'){
      projectTaskSetTag({
        taskId:this.taskCode,
        tagId:tag.id
      }).then(res=>{
        if(res.data.code == 0 ){
          this.checkTaskChange(tag);
        }
      })
    },
    delTag(){
      this.delTagShow = true
    },
    cancelTag(){
      this.delTagShow = false
    },
    deleteTag(){
      projectTaskDelTag(this.list[this.currentTag.index]).then(res=>{
        if(res.data.code==0){
          // this.setTaskCheckTag(this.list[this.currentTag.index],'del')
          this.list.splice(this.currentTag.index, 1);
          this.listTemp.splice(this.currentTag.index, 1);
          this.clearCreating();
        }
      })
    }
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
.member-menu {
  background: #fff;
  padding: 12px 0;
  // height: 375px;
  border-radius: 4px;
}
.tag-list {
  padding: 0 !important;
  .tag-title {
    display: flex;
    align-items: center;

    .ant-badge-status-dot {
      width: 7px;
      height: 7px;
    }
  }

  .tag-badge {
    display: flex;
    justify-content: space-between;
    margin: 6px 12px 12px 12px;

    .badge-item {
      position: relative;

      .badge-item-dot {
        width: 25px;
        height: 25px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
      }
      i {
        position: absolute;
        color: #fff;
        margin-right: 0px;
      }
      .anticon {
        position: absolute;
        left: 5px;
        top: 5px;
        color: #fff;
      }
    }
  }

  .tag-edit {
    visibility: hidden;
  }

  .member-list-item {
    &:hover {
      .tag-edit {
          visibility: visible;
      }
    }
  }
  .list-group{
    .tag-list-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      cursor: pointer;
      border-bottom: none;
      color: #333;
      font-size: 14px;
      &:hover{
        background-color: #f5f5f5;
        .tag-edit {
          visibility: visible;
        }
      }
      .tag-list-item-action{
        display: flex;
        align-items: center;
        margin-left: 48px;
      }
    }

  }
}
.del-tag-box{
  .del-tag-model{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }
 .del-tag-content{
    bottom: 71px;
    position: absolute;
    background: white;
    padding: 12px;
    border-radius: 5px;
    color: #333;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
 }
}
</style>
