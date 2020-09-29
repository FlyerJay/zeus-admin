<template>
    <div class="manage-member page">
        <div class="clearfix">
            <el-form ref="searchForm" :model="searchForm" size="small" inline>
                <el-form-item prop="roleName" label="角色名称">
                    <el-input v-model="searchForm.roleName" placeholder="支持关键词/模糊查询"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="search" :loading="isLoading" icon="el-icon-search">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="createRole" icon="el-icon-plus">添加</el-button>
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

        <el-dialog :visible.sync="createVisible" title="添加角色" width="500px" @close="closeCreateHandler">
            <el-form :model="createForm" ref="createForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="roleName" label="角色名称">
                    <el-input v-model="createForm.roleName" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="permissions" label="角色权限">
                    <el-cascader collapse-tags clearable v-model="createForm.permissions" :options="menu" :props="permissionProps" placeholder="请选择" style="width: 100%">
                    </el-cascader>
                </el-form-item>

                <el-form-item prop="remark" label="备注">
                    <el-input v-model="createForm.remark" type="textarea" :rows="3" placeholder="角色权限备注" style="width: 100%">
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreate">取消</el-button>
                <el-button type="primary" @click="confirmCreate" :loading="operateLoading">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="updateVisible" title="添加角色" width="500px" @close="closeCreateHandler">
            <el-form :model="updateForm" ref="updateForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="roleName" label="角色名称">
                    <el-input v-model="updateForm.roleName" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="permissions" label="角色权限">
                    <el-cascader collapse-tags clearable v-model="updateForm.permissions" :options="menu" :props="permissionProps" placeholder="请选择" style="width: 100%">
                    </el-cascader>
                </el-form-item>

                <el-form-item prop="remark" label="备注">
                    <el-input v-model="updateForm.remark" type="textarea" :rows="3" placeholder="角色权限备注" style="width: 100%">
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdate">取消</el-button>
                <el-button type="primary" @click="confirmUpdate" :loading="operateLoading">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="detailVisible" title="权限详情" width="500px">
            <el-tree
                ref="tree"
                :data="permissionTree"
                :props="{ label: 'menuName', children: 'subMenus' }"
                node-key="menuCode"
                show-checkbox
                default-expand-all>
            </el-tree>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import menu from '../../assets/json/menu.json'

const menuArr = Object.keys(menu).filter(key => key !== 'platform').map(key => menu[key])

export default {
    name: 'manage-member',

    data () {
        return {
            isLoading: false,
            operateLoading: false,
            dataList: [],
            createVisible: false,
            updateVisible: false,
            detailVisible: false,
            searchForm: {
                roleName: '',
                permissions: []
            },
            createForm: {
                roleName: '',
                remark: '',
                permissions: ''
            },
            updateForm: {
                roleName: '',
                remark: '',
                permissions: '',
                roleId: ''
            },
            rules: {
                roleName: [
                    { required: true, message: '请填写角色名称', trigger: 'blur' }
                ],
                permissions: [
                    { required: true, message: '请选择角色权限', trigger: 'change' }
                ]
            },
            menu: menuArr,
            permissionTree: [],
            permissionProps: {
                multiple: true,
                value: 'menuCode',
                label: 'menuName',
                children: 'subMenus'
            },
            selectedPermisiions: [],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    field: 'roleName',
                    name: '角色名称',
                }, {
                    field: 'remark',
                    name: '备注',
                }, {
                    field: 'permissions',
                    name: '权限详情',
                    render: (h, { row }) => {
                        return h('el-button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.viewPermissions(row)
                                }
                            }
                        }, '查看权限')
                    }
                }, {
                    field: 'createTime',
                    name: '创建时间',
                    formatter: row => this.$time(row.createTime)
                }, {
                    field: 'operate',
                    name: '操作',
                    render: (h, { row }) => {
                        return h('div', [
                            h('el-button', {
                                props: {
                                    size: 'mini',
                                    type: 'danger'
                                },
                                on: {
                                    click: () => {
                                        this.removeRole(row)
                                    }
                                }
                            }, '删除'),
                            h('el-button', {
                                props: {
                                    size: 'mini',
                                    type: 'warning'
                                },
                                on: {
                                    click: () => {
                                        this.updateRole(row)
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
        this.search()
        this.permissionTree = this.deepcopy(this.menu)
        this.deepTree(this.permissionTree, 'subMenus', node => {
            node.disabled = true
            if (node.subMenus && node.subMenus.length > 0) {
                node.subMenus.forEach(item => {
                    item.parent = node
                })
            }
        })
    },

    methods: {
        ...mapActions('manage', ['roleListPageX', 'createRoleX', 'updateRoleX', 'removeRoleX']),

        search () {
            this.pagination.page = 1
            this.getRoleList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getRoleList()
        },

        async getRoleList () {
            this.isLoading = true
            const response = await this.roleListPageX({
                page: this.pagination.page,
                pageSize: this.pagination.pageSize,
                roleName: this.searchForm.roleName
            })
            this.isLoading = false
            if (response.code === 200) {
                this.dataList = response.data.rows
                this.pagination.total = response.data.count
            }
        },

        createRole () {
            this.createVisible = true
        },

        async confirmCreate () {
            console.log(this.createForm.permissions)
            try {
                const valid = await this.$refs['createForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.createRoleX({
                    roleName: this.createForm.roleName,
                    remark: this.createForm.remark,
                    permissions: JSON.stringify(this.createForm.permissions)
                })
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    })
                    this.createVisible = false
                    this.getRoleList()
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

        updateRole (row) {
            this.updateVisible = true
            this.$nextTick(() => {
                this.updateForm.roleName = row.roleName
                this.updateForm.remark = row.remark
                this.updateForm.permissions = JSON.parse(row.permissions)
                this.updateForm.roleId = row.roleId
            })
        },

        async confirmUpdate () {
            try {
                const valid = await this.$refs['updateForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.updateRoleX({
                    roleName: this.updateForm.roleName,
                    remark: this.updateForm.remark,
                    permissions: JSON.stringify(this.updateForm.permissions),
                    roleId: this.updateForm.roleId
                })
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    this.updateVisible = false
                    this.getRoleList()
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

        closeUpdateHandler () {
            this.$refs['updateForm'].resetFields()
        },

        viewPermissions (row) {
            this.selectedPermisiions = JSON.parse(row.permissions)
            this.detailVisible = true
            this.$nextTick(() => {
                this.$refs['tree'].setCheckedKeys(this.selectedPermisiions.map(item => item[item.length - 1]))
            })
        },

        async removeRole ({ roleId }) {
            try {
                await this.$confirm('确认删除该成团？', '提示')
                const response = await this.removeRoleX({
                    roleId
                })
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getRoleList()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            } catch (exp) {
                console.log(exp)
            }
        },

        deepcopy (obj) {
            return JSON.parse(JSON.stringify(obj))
        },

        deepTree (nodes, children = 'children', cb) {
            for (let i = 0, len = nodes.length; i < len; i++) {
                cb(nodes[i])
                if (nodes[i][children] && nodes[i][children].length !== 0) {
                    this.deepTree(nodes[i][children], children, cb)
                }
            }
        }
    }
}
</script>