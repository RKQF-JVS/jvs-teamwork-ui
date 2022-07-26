<template>
  <div class="task-search">
    <el-form ref="form" :model="taskSearchForm" label-width="80px" size="small" class="task-serach-form">
      <el-form-item label="标题">
        <el-input size="small" v-model="taskSearchForm.title" placeholder="搜索项目内任务"></el-input>
      </el-form-item>
      <el-form-item label="执行者">
        <el-select
          size="small"
          v-model="taskSearchForm.execut"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请选择"
          :remote-method="remoteMethod"
          :loading="executLoading"
          style="width:100%;">
          <el-option
            v-for="item in executOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
       </el-form-item>
      <el-form-item label="创建者">
        <el-select
          size="small"
          v-model="taskSearchForm.creator"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请选择"
          :remote-method="remoteMethod"
          :loading="creatorLoading"
          style="width:100%;">
          <el-option
            v-for="item in creatorOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参与者">
         <el-select
          v-model="taskSearchForm.participator"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请选择"
          :remote-method="remoteMethod"
          :loading="participatorLoading"
          style="width:100%;">
          <el-option
            v-for="item in participatorOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否完成">
         <el-select v-model="taskSearchForm.isFinish"  style="width:100%;">
           <el-option v-for="item in FinishOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="优先级">
         <el-select
            v-model="taskSearchForm.priority"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请选择"
            :remote-method="remoteMethod"
            :loading="priorityLoading"
            style="width:100%;">
            <el-option
              v-for="item in priorityOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="执行状态">
        <el-select
          v-model="taskSearchForm.state"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请选择"
          :remote-method="remoteMethod"
          :loading="stateLoading"
          style="width:100%;">
            <el-option
              v-for="item in stateOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="截止日期">
        <el-date-picker
          style="width:100%;"
          v-model="taskSearchForm.dueDate"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          style="width:100%;"
          v-model="taskSearchForm.createDate"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="完成日期">
        <el-date-picker
          style="width:100%;"
          v-model="taskSearchForm.finishedDate"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          style="width:100%;"
          v-model="taskSearchForm.startDate"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="task-search-footer">
      <jvs-button type="primary">搜索</jvs-button>
      <jvs-button>重置</jvs-button>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {},
    data() {
      return {
        formLoading:false,
        taskSearchForm:{
          title:'',
          execut:[],
          priority:[],
          isFinish:''
        },
        // 执行者
        executOption:[],
        executLoading:false,
        // 创建者
        creatorOption:[],
        creatorLoading:false,
        // 参与者
        participatorOption:[],
        participatorLoading:false,
        FinishOption:[
          {
            label:'全部',
            value:''
          },{
            label:'是',
            value:'1'
          },{
            label:'否',
            value:'0'
          }
        ],
        // 优先级
        priorityOption:[],
        priorityLoading:false,
        // 执行状态
        stateOption:[],
        stateLoading:false
      };
    },
    watch: {},
    created() {},
    mounted() {},
    computed: {},
    methods: {
      init(){

      },
      remoteMethod(){

      }
    }
  };
</script>
<style lang="scss" scoped>
.task-search{
  position: relative;
  height: calc(100% - 30px);
  padding: 15px 0px;
  .task-serach-form{
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 40px);
    padding: 0px 15px;
    .el-form-item{
      /deep/.el-date-editor{
        .el-icon-date{
          display: none !important;
        }
      }
    }
  }
  .task-search-footer{
    text-align: center;
    button{
      width: 135px;
      height: 40px;
      letter-spacing: 2px;
      font-size: 14px;
    }
  }
}
</style>
