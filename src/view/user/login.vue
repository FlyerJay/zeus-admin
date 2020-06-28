<template>
    <div class="page login">
        <!-- 背景 -->
        <div class="background"></div>

        <!-- 口号 -->
        <div class="slogan">
            做<span class="important">领先的</span>钢铁贸易商
        </div>

        <el-card shadow="hover" class="login-card">
            <template #header>
                <p>奎鑫 | 采销系统</p>
            </template>

            <el-form :model="form" status-icon :rules="rules" ref="form">
                <el-form-item prop="userId">
                    <el-input v-model="form.userId" @keyup.enter.native="submitForm" placeholder="请输入账号">
                        <template #prepend><i class="iconfont icon-account"></i></template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" autocomplete="off" placeholder="输入登录密码">
                        <template #prepend><i class="iconfont icon-lock"></i></template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="comId">
                    <el-select type="password" v-model="form.comId" autocomplete="off" placeholder="请选择公司">
                        <template #prepend><i class="iconfont icon-lock"></i></template>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @keyup.enter.native="submitForm" @click="submitForm" class="login-btn" :loading="isLoading">登 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 录</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 页脚 -->
        <div class="footer">

        </div>
    </div>
</template>
<script>
export default {
    name: 'login',

    data () {
        return {
            form: {
                userId: '',
                password: ''
            },
            rules: {
                userId: [
                    {
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入登录密码',
                        trigger: 'blur'
                    }
                ],
                comId: [
                    {
                        required: true,
                        message: '请选择公司',
                        trigger: 'blur'
                    }
                ]
            },
            isLoading: false
        }
    },

    methods: {
        async submitForm () {
            const valid = await this.$refs['form'].validate()
            if (!valid) return
            this.isLoading = true
        }
    }
}
</script>
<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.page.login {
    width: 100%;
    height: 100%;

    .background {
        position: fixed;
        z-index: -1;
        width: 100%;
        height: 100%;
        background-image: url('https://www.kxzeus.com/static/img/bg3.jpg');
        background-size: contain;
        filter: blur(5px);
    }

    .slogan {
        font-size: 30px;
        color: #fff;
        text-shadow: 1px 1px 5px #000;
        position: absolute;
        left: 50%;
        top: 20%;
        transform: translate3d(-50%,-50%,0);
        z-index: 2;

        .important {
            color: #fccc00;
            font-size: 34px;
            margin: 0 12px;
        }
    }

    .login-card {
        width: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);

        .login-btn {
            width: 100%;
            font-size: 18px;
        }

        .tips {
            color: gray;
        }
    }

    .footer {
        height: 60px;
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        color: #ddd;
        padding: 0 15%;
    }
}
</style>