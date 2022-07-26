<template>
  <vue-scroll :ops="{bar: {background: '#cecece',onlyShowBarOnScroll:false,minSize:0.1}}">
    <div class="features-page">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="createFeatures">创建版本库</el-button>
    </div>
    <el-dialog :title="projectFeatures.modalTitle"
      :visible.sync="projectFeatures.modalStatus"
      custom-class="project-dialog"
      :close-on-click-modal	="false"
      width="360px"
      top="5vh"
      :modal="true"
      :before-close="beforeClose">
      <el-form :model="infoModalForm" :rules="rules" ref="form" style="padding:20px 20px 1px 0;">
        <el-form-item label="" prop="name">
          <el-input v-model="infoModalForm.name" placeholder="版本库名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input type="textarea" v-model="infoModalForm.name" placeholder="版本库简介"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="action-btn pull-right">
            <el-button size="small" @click="beforeClose">取 消</el-button>
            <el-button type="primary" size="small" @click="handleSave"  class="middle-btn">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </vue-scroll>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      projectFeatures:{
        modalTitle:'创建版本库',
        modalStatus:false
      },
      infoModalForm:{},
      rules:{}
    };
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    beforeClose(){
      this.projectFeatures.modalStatus = false
    },
    handleSave(){

    },
    createFeatures(){
      this.projectFeatures.modalStatus = true
    }
  }
};
</script>
<style lang="scss" scoped>
.features-page{
  padding: 24px 12px 12px;
  width: 1080px;
  margin:auto auto;
  background: initial;
}
</style>
