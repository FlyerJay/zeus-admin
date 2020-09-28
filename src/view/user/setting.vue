<template>
    <div class="user-setting">
        <h3>由于您还没有设置登录账号，希望您能完成下面的设置，下次登录您就可以使用设置的账号密码进行登录了，当然您依然可以通过AccessId进行登录。</h3>

        <el-form :model="form" :rules="rules" inline class="form" ref="form">
            <el-form-item prop="externalName" label="企业名称">
                <el-input v-model="form.externalName" :disabled="userInfo.accountType === 'T'" placeholder="请输入企业名称" style="width: 400px"></el-input>
            </el-form-item>

            <el-form-item prop="userName" label="登录账号">
                <el-input v-model="form.userName" placeholder="请输入登录账号" style="width: 400px"></el-input>
            </el-form-item>

            <el-form-item prop="password" label="登录密码">
                <el-input v-model="form.password" type="password" autocomplete="off" placeholder="请输入登录密码" style="width: 400px"></el-input>
            </el-form-item>
        </el-form>

        <section class="btn-group">
            <el-button size="medium" @click="skip">跳过</el-button>
            <el-button size="medium" type="primary" @click="submit">提交</el-button>
        </section>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import md5 from 'blueimp-md5'
export default {
    name: 'user-setting',

    data () {
        return {
            form: {
                externalName: '',
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                externalName: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' }
                ]
            }
        }
    },

    computed: {
        ...mapState('user', {
            userInfo: state => state.userInfo
        })
    },

    async created () {
        await this.userInfoX()
        this.form.externalName = this.userInfo.externalName
    },

    methods: {
        ...mapActions('user', ['userSettingX', 'userInfoX']),

        skip () {
            this.$router.replace('/')
        },

        async submit () {
            try {
                const valid = this.$refs['form'].validate()
                if (!valid) return
                const response = await this.userSettingX({
                    externalName: this.form.externalName,
                    userName: this.form.userName,
                    password: md5(this.form.password)
                })
                if (response.code === 200) {
                    this.$router.replace('/')
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            } catch (exp) {
                if (exp.message) {
                    this.$message({
                        type: 'error',
                        message: exp.message
                    })
                }
            }
            
        }
    }
}
</script>
<style lang="scss">
    .user-setting {
        width: 800px;
        margin: 10px auto;
        background-color: white;
        padding: 15px 60px;

        h3 {
            font-size: 14px;
            color: $neut2;
            margin-top: 60px;
        }

        .form {
            margin: 0 auto;
            margin-top: 100px;
            width: 500px;

            &.el-form--inline {
                .el-form-item {
                    margin-bottom: 40px;
                }
            }
        }

        .btn-group {
            margin-top: 100px;
            float: right;
        }
    }
</style>