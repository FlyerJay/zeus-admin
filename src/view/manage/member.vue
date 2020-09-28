<template>
    <div class="manage-member page">
        <div class="clearfix">
            <el-form ref="searchForm" :model="searchForm" size="small" inline>
                <el-form-item prop="memberName" label="成员名称">
                    <el-input v-model="searchForm.memberName" placeholder="支持关键词/模糊查询"></el-input>
                </el-form-item>

                <el-form-item prop="mobile" label="手机号">
                    <el-input v-model="searchForm.mobile" placeholder="支持关键词/模糊查询"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="search" :loading="isLoading" icon="el-icon-search">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="createAccount" icon="el-icon-plus">添加</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-loading="isLoading">
            <filter-table
                :data="dataList"
                :columns="columns"
                border
                pagination
                :setting="false"
                :page-size="pagination.pageSize"
                :total="pagination.total"
                @current-change="onPageChange">
            </filter-table>
        </div>

        <el-dialog :visible.sync="createVisible" title="添加账号" width="500px" @close="closeCreateHandler">
            <el-form :model="createForm" ref="createForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="externalName" label="企业名称">
                    <el-input v-model="createForm.externalName" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="accountType" label="账号类型">
                    <el-select v-model="createForm.accountType" placeholder="请选择" style="width: 100%">
                        <el-option v-for="item in accountTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreate">取消</el-button>
                <el-button type="primary" @click="confirmCreate" :loading="operateLoading">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { copyToClipbord } from '../../assets/js/utils'

export default {
    name: 'manage-member',

    data () {
        return {
            isLoading: false,
            operateLoading: false,
            dataList: [],
            createVisible: false,
            searchForm: {
                memberName: '',
                userName: ''
            },
            createForm: {
                externalName: '',
                accountType: ''
            },
            rules: {
                accountType: [
                    { required: true, message: '请选择账号类型', trigger: 'change' }
                ]
            },
            accountTypes: [
                {
                    label: '临时账号',
                    value: 'T'
                }, {
                    label: '正式账号',
                    value: 'S'
                }
            ],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    field: 'internalId',
                    name: '编号',
                    width: 80
                }, {
                    field: 'externalName',
                    name: '企业名称',
                    width: 160
                }, {
                    field: 'accessId',
                    name: '令牌'
                }, {
                    field: 'accessSecret',
                    name: '令牌密钥'
                }, {
                    field: 'userName',
                    name: '登录账号',
                    width: 120
                }, {
                    field: 'createTime',
                    name: '创建时间',
                    width: 180,
                    formatter: row => this.$time(row.createTime)
                }, {
                    field: 'accountType',
                    name: '账号类型',
                    width: 150,
                    render: (h, { row }) => {
                        const mapping = {
                            A: '管理账号',
                            T: '临时账号',
                            S: '正式账号'
                        }
                        const typeMapping = {
                            A: 'warning',
                            T: 'info',
                            S: 'success'
                        }
                        return h('el-tag', {
                            props: {
                                type: typeMapping[row.accountType]
                            }
                        }, mapping[row.accountType])
                    }
                }, {
                    field: 'operate',
                    name: '操作',
                    width: 200,
                    render: (h, { row }) => {
                        return h('el-button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.copyAccess(row)
                                }
                            }
                        }, '复制令牌')
                    }
                }
            ]
        }
    },

    created () {
        this.search()
    },

    methods: {
        ...mapActions('platform', ['accountListX', 'createAccountX']),

        search () {
            this.pagination.page = 1
            this.getAccountList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getAccountList()
        },

        async getAccountList () {
            this.isLoading = true
            const response = await this.accountListX({
                page: this.pagination.page,
                pageSize: this.pagination.pageSize,
                externalName: this.searchForm.externalName
            })
            this.isLoading = false
            if (response.code === 200) {
                this.dataList = response.data.rows
                this.pagination.total = response.data.count
            }
        },

        createAccount () {
            this.createVisible = true
        },

        async confirmCreate () {
            try {
                const valid = await this.$refs['createForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.createAccountX(this.createForm)
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    })
                    this.createVisible = false
                    this.getAccountList()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            } catch (exp) {
                this.operateLoading = false
            }
        },

        cancelCreate () {
            this.createVisible = false
        },

        closeCreateHandler () {
            this.$refs['createForm'].resetFields()
        },

        copyAccess (row) {
            copyToClipbord(`accessId: ${row.accessId} 
            accessSecret: ${row.accessSecret}`)
            this.$message({
                type: 'success',
                message: '已复制到剪贴板'
            })
        }
    }
}
</script>