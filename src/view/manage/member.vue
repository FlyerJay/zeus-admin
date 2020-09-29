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
                    <el-button type="primary" @click="createMember" icon="el-icon-plus">添加</el-button>
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

        <el-dialog :visible.sync="createVisible" title="添加成员" width="500px" @close="closeCreateHandler">
            <el-form :model="createForm" ref="createForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="memberName" label="成员姓名">
                    <el-input v-model="createForm.memberName" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="mobile" label="手机号">
                    <el-input v-model="createForm.mobile" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="roleId" label="角色">
                    <el-select v-model="createForm.roleId" placeholder="请选择" style="width: 100%">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreate">取消</el-button>
                <el-button type="primary" @click="confirmCreate" :loading="operateLoading">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="updateVisible" title="添加成员" width="500px" @close="closeUpdateHandler">
            <el-form :model="updateForm" ref="updateForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="memberName" label="成员姓名">
                    <el-input v-model="updateForm.memberName" disabled placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="mobile" label="手机号">
                    <el-input v-model="updateForm.mobile" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="roleId" label="角色">
                    <el-select v-model="updateForm.roleId" placeholder="请选择" style="width: 100%">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdate">取消</el-button>
                <el-button type="primary" @click="confirmUpdate" :loading="operateLoading">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'manage-member',

    data () {
        return {
            isLoading: false,
            operateLoading: false,
            dataList: [],
            createVisible: false,
            updateVisible: false,
            searchForm: {
                memberName: '',
                mobile: ''
            },
            createForm: {
                memberName: '',
                mobile: '',
                roleId: ''
            },
            updateForm: {
                memberName: '',
                mobile: '',
                roleId: ''
            },
            roleList: [],
            rules: {
                memberName: [
                    { required: true, message: '请输入成员姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                roleId: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ]
            },
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    field: 'memberName',
                    name: '姓名'
                }, {
                    field: 'mobile',
                    name: '手机号'
                }, {
                    field: 'roleId',
                    name: '角色',
                    formatter: row => {
                        var roleMapping = {}
                        this.roleList.forEach(item => {
                            roleMapping[item.roleId] = item.roleName
                        })
                        return roleMapping[row.roleId]
                    }
                }, {
                    field: 'createTime',
                    name: '创建时间',
                    formatter: row => this.$time(row.createTime)
                }, {
                    field: 'lastLoginTime',
                    name: '最近登录时间',
                    formatter: row => this.$time(row.lastLoginTime)
                }, {
                    field: 'operate',
                    name: '操作',
                    render: (h, { row }) => {
                        return h('div', [
                            h('el-button', {
                                props: {
                                    size: 'small',
                                    type: 'danger'
                                },
                                on: {
                                    click: () => {
                                        this.removeMember(row)
                                    }
                                }
                            }, '删除'),
                            h('el-button', {
                                props: {
                                    size: 'small',
                                    type: 'warning'
                                },
                                on: {
                                    click: () => {
                                        this.updateMember(row)
                                    }
                                }
                            }, '修改')
                        ])
                    }
                }
            ]
        }
    },

    created () {
        this.getRoleList()
        this.search()
    },

    methods: {
        ...mapActions('manage', ['memberListX', 'roleListX', 'createMemberX', 'updateMemberX', 'removeMemberX']),

        search () {
            this.pagination.page = 1
            this.getMemberList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getMemberList()
        },

        async getMemberList () {
            this.isLoading = true
            const response = await this.memberListX({
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

        async getRoleList () {
            const response = await this.roleListX()
            if (response.code === 200) {
                this.roleList = response.data
            }
        },

        createMember () {
            this.createVisible = true
        },

        async confirmCreate () {
            try {
                const valid = await this.$refs['createForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.createMemberX(this.createForm)
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    })
                    this.createVisible = false
                    this.getMemberList()
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

        updateMember (row) {
            this.updateVisible = true
            this.$nextTick(() => {
                this.updateForm.memberName = row.memberName
                this.updateForm.memberId = row.memberId
                this.updateForm.mobile = row.mobile
                this.updateForm.roleId = row.roleId
            })
        },

        async confirmUpdate () {
            try {
                const valid = await this.$refs['updateForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.updateMemberX(this.updateForm)
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    this.updateVisible = false
                    this.getMemberList()
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

        cancelUpdate () {
            this.updateVisible = false
        },

        closeCreateHandler () {
            this.$refs['createForm'].resetFields()
        },

        closeUpdateHandler () {
            this.$refs['updateForm'].resetFields()
        },

        async removeMember ({ memberId }) {
            try {
                await this.$confirm('确认删除该成团？', '提示')
                const response = await this.removeMemberX({
                    memberId
                })
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getMemberList()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            } catch (exp) {
                console.log(exp)
            }
        }
    }
}
</script>