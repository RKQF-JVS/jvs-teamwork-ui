<template>
    <div class="invite-from-box">
        <el-card class="box-card">
            <div slot="header">
                来自 18610614481 的邀请
            </div>
            <div class="header" style="font-size: 18px;">
                <span>
                    18610614481 邀请你<span>加入项目「我的项目」</span>
                </span>
            </div>
            <div class="member-info">
                <el-avatar size="medium" src=""></el-avatar>
                <div class="info">
                    <p>18610614481</p>
                    <p class="muted">54552390@qq.com</p>
                </div>
            </div>
            <el-button style="width:100%;" type="primary">
                加入项目
            </el-button>
        </el-card>
    </div>
</template>
<script>
export default {
    components: {},
    props: {},
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
.invite-from-box{
    width:600px;
    margin: 50px auto;
    .member-info{
        margin: 36px 0;
        display: flex;
        align-items: center;
        font-size: 14px;
        .info{
            margin-left: 12px;
            p{
                margin: 0;
            }
        }
    }
}
</style>