<template>
  <div class="organization-page">
    <pageHeader :list="menuList" title="我的组织"></pageHeader>
    <div class="organization-body">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="组织名称">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="rowClick(scope.row,'edit')">编辑</el-button>
            <el-button type="text" @click="rowClick(scope.row,'quit')">退出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        layout="total, prev, pager, next"
        style="text-align:right;margin-top:10px;"
        :total="page.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="actionInfo.modalTitle"
      :visible.sync="actionInfo.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="800px"
      top="8vh"
      :destroy-on-close="true"
      :before-close="beforeClose"
      :modal="true">
      <el-form ref="form" :rules="rules" :model="form" style="padding:20px 20px 1px 0;" label-width="80px">
        <el-form-item label="组织名称" prop="name">
          <el-input v-model="form.name" placeholder="组织名称"></el-input>
          <div class="form-explain">必填，请填写组织名称</div>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="详细地址"></el-input>
          <div class="form-explain">详细地址</div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleSubmit" v-loading="actionInfo.confirmLoading">保存</el-button>
          <el-button size="small" @click="beforeClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pageHeader from '../pageHeader'
export default {
  components: {
    pageHeader
  },
  props: {},
  data() {
    return {
      menuList:[
        {
          name:'项目管理'
        }
        ,{
          name:'项目列表'
        }
        ,{
          name:'我的组织'
        }
      ],
      tableLoading:false,
      tableData:[],
      page:{
        currentPage:1,
        total:0,
        pageSize:10
      },
      newData:{
        code:''
      },
      actionInfo: {
        modalStatus: false,
        confirmLoading: false,
        modalTitle: '编辑组织',
        okText: '保存',
        cancelText: '放弃',
      },
      form:{
        name:'',
        address:''
      },
      rules:{
        name:[{ required: true, message: '组织名称' }]
      }
    };
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  computed: {},
  methods: {
    handleSubmit(){
      this.$refs.form.validate((valid)=>{
        if (valid) {
          alert('submit!');
        }
      })
    },
    beforeClose(){
      this.actionInfo.modalStatus = false
    },
    init(){

    },
    rowClick(record, action) {
      this.newData = {code: ''};
      if (action == 'add' || action == 'edit' || action == 'new') {
          // setTimeout(function () {
          //     app.form && app.form.resetFields();
          // }, 0);
          this.actionInfo.modalStatus = true;
          this.actionInfo.modalTitle = '添加组织';
          if (action == 'edit') {
              //modal没显示之前不会实例化modal子元素，延迟处理
              setTimeout(function () {
                  this.actionInfo.modalTitle = '编辑组织';
                  // app.form.setFieldsValue({
                  //     name: record.name,
                  //     areas: [record.province.toString(), record.city.toString(), record.area.toString()],
                  //     address: record.address,
                  // });
                  this.newData = record;
              }, 0);
          }
      }else if (action == 'quit') {
        this.$confirm(`取消归档「${this.currentProject.name}」后就可以正常使用了`, '确定要退出此组织', {
          confirmButtonText: '退出',
          cancelButtonText: '再想想',
          confirmButtonClass:'el-button--danger',
          type: 'warning'
        }).then(() => {

        }).catch(() => {

        });
      }
  },
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
  }
};
</script>
<style lang="scss" scoped>
.organization-body{
  margin: 24px;
  padding: 24px 24px 12px 24px;
  background: #fff;
}
</style>
