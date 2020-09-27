<template>
    <div class="page login">
        <!-- 背景 -->
        <div class="background"></div>

        <!-- 口号 -->
        <div class="slogan">
            <!-- 做<span class="important">领先的</span>钢铁贸易商 -->
        </div>

        <el-card shadow="hover" class="login-card">
            <template #header>
                <img src="../../assets/images/font-logo.png">
            </template>

            <el-form :model="form" status-icon :rules="rules" ref="form">
                <el-form-item prop="type">
                    <el-select v-model="form.type" placeholder="请选择账号类型" style="width: 100%">
                        <el-option
                            v-for="(item, index) in typeList"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="userName">
                    <el-input v-model="form.userName" @keyup.enter.native="submitForm" :placeholder="placeholderUserName">
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" autocomplete="off" :placeholder="placeholderPassword">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @keyup.enter.native="submitForm" @click="submitForm" class="login-btn" :loading="isLoading">登 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 录</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 页脚 -->
        <div class="footer">
            <div class="regular">
                <div>
                    <span>联系电话：13390929936</span>
                </div>

                <div>
                    <span>服务监督：13390928886</span>
                </div>

                <div>
                    <span>受理时间：8:00-18:00</span>
                </div>
            </div>

            <!-- <div class="icp">金ICP备</div> -->
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import md5 from 'blueimp-md5'

export default {
    name: 'login',

    data () {
        return {
            form: {
                userName: '',
                password: '',
                type: 'user'
            },
            rules: {
                type: [
                    {
                        required: true,
                        message: '请选择账号类型',
                        trigger: 'change'
                    }
                ],
                userName: [
                    {
                        required: true,
                        message: '登录账号不能为空',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '登录密码不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            isLoading: false,
            typeList: [
                {
                    label: '员工账号',
                    value: 'user'
                }, {
                    label: '企业账号',
                    value: 'external'
                }
            ]
        }
    },

    computed: {
        placeholderUserName () {
            var placeholder = ''
            switch (this.form.type) {
                case 'user':
                    placeholder = '输入手机号'
                    break
                case 'external':
                    placeholder = '输入用户名或AccessId'
                    break
            }

            return placeholder
        },

        placeholderPassword () {
            var placeholder = ''
            switch (this.form.type) {
                case 'user':
                    placeholder = '输入密码'
                    break
                case 'external':
                    placeholder = '输入密码或AccessSecret'
                    break
            }

            return placeholder
        }
    },

    methods: {
        ...mapActions('user', ['userLoginX']),

        async submitForm () {
            try {
                const valid = await this.$refs['form'].validate()
                if (!valid) return
                this.isLoading = true
                const response = await this.userLoginX({
                    userName: this.form.userName,
                    password: this.isNeedMd5() ? md5(this.form.password) : this.form.password,
                    type: this.form.type
                })
                this.isLoading = false
                if (response.code === 200) {
                    if (response.data.userInfo.leading) {
                        switch (response.data.userInfo.leading) {
                            case 'setting':
                                this.$router.replace('/user/setting')
                                break
                        }
                        return
                    }
                    this.$router.replace('/')
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            } catch (exp) {
                this.isLoading = false
                if (exp.message) {
                    this.$message({
                        type: 'error',
                        message: exp.message
                    })
                }
            }
        },

        isNeedMd5 () {
            return this.form.password.length !== 32
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

        .el-card__header {
            img {
                height: 30px;
            }
        }

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
        color: #ddd;
        padding: 0 15%;

        .regular {
            font-size: 12px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            margin-top: 12px;

            >div {
                width: 33.33%;
                text-align: center;
            }

            span {
                margin-right: 10px;
                cursor: pointer;
                
                &:hover {
                    color: $warning;
                }
            }
        }

        .icp {
            margin-top: 5px;
            font-size: 12px;
            text-align: center;
        }
    }
}
</style>