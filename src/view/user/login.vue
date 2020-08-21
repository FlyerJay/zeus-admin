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
                <p>奎鑫 | 采销系统</p>
            </template>

            <el-form :model="form" status-icon :rules="rules" ref="form">
                <el-form-item prop="userId">
                    <el-input v-model="form.userId" @keyup.enter.native="submitForm" placeholder="请输入账号">
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" autocomplete="off" placeholder="输入登录密码">
                    </el-input>
                </el-form-item>

                <el-form-item prop="comId">
                    <el-select type="password" v-model="form.comId" autocomplete="off" placeholder="请选择公司" style="width: 100%">
                        <el-option
                            v-for="(item, index) in companyList"
                            :key="index"
                            :value="item.comId"
                            :label="item.comName"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @keyup.enter.native="submitForm" @click="submitForm" class="login-btn" :loading="isLoading">登 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 录</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 页脚 -->
        <div class="footer">
            <div class="regular">
                <div>联系电话：
                    <span>58711629</span>
                    <span>58700476</span>
                    <span>58798979</span>
                    <span>58700476</span>
                </div>

                <div>
                    <span>服务监督：13390928886</span>
                </div>

                <div>
                    <span>受理时间：8:00-18:00</span>
                </div>
            </div>

            <div class="icp">金ICP备</div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

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

    computed: {
        ...mapState('company', {
            companyList: state => state.companyList
        })
    },

    methods: {
        ...mapActions('user', ['userLoginX']),

        async submitForm () {
            try {
                const valid = await this.$refs['form'].validate()
                if (!valid) return
                this.isLoading = true
                const response = await this.userLoginX(this.form)
                this.isLoading = false
                if (response.code === 200) {
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