<template>
  <div class="task-top-bar">
    <div class="top-bar-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index' }">
          <i class="el-icon-s-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-dropdown trigger="click" :hide-on-click="false" v-if="!hideOnClick">
            <el-tooltip effect="dark" :content="getValue" placement="top">
              <span class="el-dropdown-link" style="cursor: pointer;">
                {{getValue}}<i class="el-icon-arrow-down"></i>
              </span>
             </el-tooltip>
            <el-dropdown-menu slot="dropdown" class="task-project-dropdown">
              <el-dropdown-item command="search">
                <div class="dorp-down-search">
                  <el-input v-model="selectVal" placeholder="搜索">
                    <i slot="prefix" class="el-icon-search" style="display: flex;align-items: center;height: 100%;"></i>
                  </el-input>
                </div>
                <div class="dorp-down-item">
                  <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false}}">
                    <div class="project-dorp-item" v-for="(item,index) in options" :key="index" @click="handleCommand(item)">
                      <div class="project-dorp-info">
                        <el-avatar size="medium" :src="item.projectCoverUrl"></el-avatar>
                        <span>{{item.projectName}}</span>
                      </div>
                      <i class="iconfont icon-check1" v-show="item.id == taskId"></i>
                    </div>
                    <el-empty :image-size="50" v-if="options.length==0"></el-empty>
                  </vue-scroll>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-tooltip effect="dark" :content="`${!project.collectStatus?'加入收藏':'取消收藏'}`" placement="top">
        <i :class="{'iconfont icon-collection-fill':true,'collection-fill-icon':project.collectStatus}" @click="doAction()"></i>
      </el-tooltip>
    </div>
    <div class="top-bar-center">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <template v-for="(item,index) in navBarList">
          <el-menu-item :index="index+''"  :key="index" v-if="!item.display">{{item.name}}</el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="top-bar-right">
      <slot name="top-right"></slot>
    </div>
  </div>
</template>

<script>
import { projectDetail,projectCollection,projectInfoListAll }  from '@/api/project/list'
export default {
  components: {},
  props: {},
  data() {
    return {
      options: [],
      optionsCopy:[],
      value: this.$route.params.taskId,
      selectVal:'',
      taskId:'',
      project:{},
      navBarList:[{
        name:'任务',
        path:'/project/space/task'
      },{
        name:'文件',
        path:'/project/space/files'
      },{
        name:'概览',
        path:'/project/space/overview'
      },{
        name:'版本',
        path:'/project/space/features'
      },{
        name:'甘特图',
        path:'/project/space/gantt',
        display:true
      }],
      hideOnClick:false
    };
  },
  watch: {
    selectVal(){
      if(this.selectVal){
        this.options = this.optionsCopy.filter(item=>{return item.projectName.indexOf(this.selectVal)!=-1})
      }else{
        this.options = JSON.parse(JSON.stringify(this.optionsCopy))
      }
    },
    $route(){
      if(this.taskId!=this.$route.params.taskId){
        this.taskId = this.$route.params.taskId
        this.getProject()
      }
    }
  },
  created() {
    this.taskId = this.$route.params.taskId
    this.getProject()
    this.getProjectInfoAll()
  },
  mounted() {
  },
  computed: {
    getValue(){
      let label = ''
      this.optionsCopy.forEach((item,index)=>{
        if(item.id == this.taskId){
          label = item.projectName
        }
      })
      return label
    },
    activeIndex(){
      const path = this.$route.path
      let activeIndex = '0'
      this.navBarList.forEach((item,index)=>{
        if(path.indexOf(item.path)!=-1){
          activeIndex = index
        }
      })
      return activeIndex+''
    },
  },
  methods: {
    handleCommand(val){
      this.hideOnClick = true
      this.$nextTick(()=>{
        this.hideOnClick = false
      })
      if(this.taskId!=val.id){
        this.$router.replace('/project/space/task/'+val.id)
      }
    },
    getProjectInfoAll(){
      projectInfoListAll().then(res=>{
        if(res.data.code==0){
          this.options = res.data.data
          this.optionsCopy = res.data.data
        }
      })
    },
    doAction(){
      const type = this.project.collectStatus ? 'cancel' : 'collect';
      projectCollection({projectId:this.project.id,type:type}).then(res=>{
        this.$set(this.project,'collectStatus',!this.project.collectStatus)
        this.$message.success(`${type=='collect'?'加入收藏成功':'取消收藏成功'}`)
      })
    },
    getProject(){
      projectDetail({id:this.taskId}).then(res=>{
        if(res.data.code==0){
          this.project = Object.assign({},this.project,res.data.data)
        }
      })
    },
    handleSelect(key, keyPath){
      this.$router.push(this.navBarList[key].path+`/${this.taskId}`)
    }
  }
};
</script>
<style lang="scss" scoped>
.task-top-bar{
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom:1px solid #d9d9d9;
  .top-bar-left{
    display: flex;
    align-items: center;
    padding-left: 10px;
    .dorp-down{
      cursor: pointer;
      position: relative;
      width: 100%;
      overflow: hidden;
      color: rgb(51, 51, 51);
      .dorp-down-select{
        opacity: 0;
        position: absolute;
        top: 0px;
        left: 0px;
        transform: translateY(-50%);
      }
      i{
        color:rgb(51, 51, 51);
      }
    }
    i{
      cursor: pointer;
      padding-left: 5px;
    }
  }
  .top-bar-center{
    height: 50px;
    .el-menu--horizontal>.el-menu-item{
      height: 50px;
      line-height: 50px;
    }
  }
}
:global{
  .dorp-down-search{
    z-index: 9;
    padding: 10px;
    position: sticky;
    top: 0px;
    background-color: white;
  }
  .dorp-down-item{
    z-index: 9;
    position: sticky;
    top: 0px;
    background-color: white;
    height: 250px;
    overflow-y: auto;
  }
  .project-dorp-item{
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    padding: 5px 10px;
    cursor: pointer;
    color: black;
    &:hover{
      background: #f5f5f5;
    }
  }
  .project-dorp-info{
    display: flex;
    align-items: center;
    flex: 1;
    span{
      padding-left: 5px;
    }
  }
}
</style>
