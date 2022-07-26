<template>
  <div class="system-page">
    <pageHeader :list="menuList" title="系统公告"></pageHeader>
    <div class="page-content">
      <el-card class="box-card">
        <div class="search-column">
          <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="关键字:">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="日期:">
              <el-date-picker
                v-model="formInline.region"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜 索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions">
          <el-button icon="el-icon-check" size="small">批量标记已读</el-button>
          <el-button icon="el-icon-delete" size="small">批量删除</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="公告标题"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="80">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import pageHeader from '../pageHeader'
export default {
  components: {pageHeader},
  props: {},
  data() {
    return {
      menuList:[
        {
          name:'项目管理'
        }
        ,{
          name:'消息提醒'
        }
        ,{
          name:'系统公告'
        }
      ],
      tableData:[],
      formInline: {
        user: '',
        region: ''
      }
    };
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    onSubmit(){

    },
    handleSelectionChange(val) {
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
