<template>
  <div>
    <el-dialog
      title="完善信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <jvs-form ref="phoneForm" :option="phoneOption" :formData="phoneForm" @submit="bindPhoneHandle">
        <template slot="codeForm">
          <div style="display:flex;align-items:center;">
            <el-input size="mini" v-model="phoneForm.code"></el-input>
            <jvs-button size="mini" style="margin-left: 10px;" :disabled="timeCountor != 300" @click="getPhoneCode">{{timeCountor != 300 ? (timeCountor +'s后重试') : '获取验证码'}}</jvs-button>
          </div>
        </template>
      </jvs-form>
    </el-dialog>
  </div>
</template>

<script>
import { bindPhone, sendPhoneCode } from '@/api/newDesign'
import {isMobile} from '@/util/validate'
import store from '@/store'
  export default {
    components: {},
    props: {},
    data() {
      var validatePhoneReg = (rule, value, callback) => {
        if(isMobile(value)) {
          callback();
        }else{
          callback(new Error('请输入正确的手机号'));
        }
      };
      return {
        dialogVisible:false,
        phoneForm: {},
        phoneOption: {
          cancal: false,
          submitLoading: false,
          column: [
            {
              label: '姓名',
              prop: 'name',
              rules: [
                { required: true, message: '请输入姓名', trigger: 'blur' },
              ]
            },
            {
              label: '手机号',
              prop: 'phone',
              rules: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: validatePhoneReg, trigger: 'blur'}
              ]
            },
            {
              label: '验证码',
              prop: 'code',
              formSlot: true,
              rules: [
                { required: true, message: '请输入验证码', trigger: 'blur' }
              ]
            }
          ]
        },
        timeCountor: 300,
        timer: null
      };
    },
    watch: {},
    created() {},
    mounted() {},
    computed: {},
    methods: {
      // 获取手机验证码
      getPhoneCode () {
        this.$refs.phoneForm.$refs.ruleForm.validateField('phone', (msg) => {
          if(msg == '') {
            if(this.timer) {
              clearInterval(this.timer)
              this.timeCountor = 300
            }
            let _this = this
            this.timer = setInterval(() => {
              _this.timeCountor -= 1
              if(_this.timeCountor == 0) {
                clearInterval(_this.timer)
                _this.timeCountor = 300
              }
            }, 1000);
            sendPhoneCode(this.phoneForm.phone).then(res => {}).catch(err => {
              if(this.timer) {
                clearInterval(this.timer)
              }
              this.timeCountor = 300
            })
          }
        })
      },
      // 登录成功写入数据
      setUserInfoData (data) {
        this.$store.commit("SET_USER_INFO", data.userDto);
      },
      // 绑定手机
      bindPhoneHandle (form) {
        this.phoneOption.submitLoading = true
        bindPhone(form).then(res => {
          if(res.data.code == 0) {
            store.dispatch('RefreshToken', store.getters.tenantId).then(res => {
              if (res) {
                this.setUserInfoData(res)
                location.reload()
                this.$message.success('绑定手机成功')
                this.phoneOption.submitLoading = false
                this.dialogVisible = false
                if(this.timer) {
                  clearInterval(this.timer)
                  this.timeCountor = 300
                }
              }
              // console.log(res)
            }).catch(e => {
            })
          }else{
            this.phoneOption.submitLoading = false
          }
        }).catch(e => {
          this.phoneOption.submitLoading = false
        })
      },
      init(){
        this.dialogVisible = true
      },
      handleClose() {
        this.dialogVisible = false
      },
    }
  };
</script>
<style lang="scss" scoped>

</style>
