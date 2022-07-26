<template>
  <div class="diy-card">
    <div class="diy-card-header">
      <div class="meta">
        <span class="diy-card-title">{{name}}</span>
        <span class="diy-card-action">
          <el-tooltip effect="dark" content="指标说明" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </span>
      </div>
      <div class="total">
        <span>392</span>
      </div>
    </div>
    <div class="diy-card-content">
      <slot name="content"></slot>
    </div>
    <div class="diy-card-footer">
      <div class="field">
        {{footerName}}
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      name:{
        type:String,
        default(){
          return ''
        }
      },
      footerName:{
        type:String,
        default(){
          return ''
        }
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
    methods: {}
  };
</script>
<style lang="scss" scoped>
.diy-card{
  background: white;
  padding: 20px 24px 8px;
  border-radius: 2px;
  .diy-card-header{
    .meta{
      color: rgba(0,0,0,.45);
      font-size: 14px;
      line-height: 22px;
      position: relative;
      overflow: hidden;
      width: 100%;
      .diy-card-action{
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .total{
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      color: #000;
      margin-top: 4px;
      margin-bottom: 0;
      font-size: 30px;
      line-height: 38px;
      height: 38px;
    }
  }
  .diy-card-content{

  }
  .diy-card-footer{
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px;
    font-size: 14px;
    .field[data-v-dca3f5e0] {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
  }
}
</style>
