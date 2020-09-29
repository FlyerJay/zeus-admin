<template>
    <div class="base-freight page">
        <div class="filter clearfix">
            <el-button type="primary" @click="createFreight" size="small" icon="el-icon-plus">添加设置</el-button>
        </div>

        <div v-loading="isLoading">
            <filter-table
                :data="dataList"
                :columns="columns"
                :setting="false"
                border
                pagination
                :page-size="pagination.pageSize"
                :total="pagination.total"
                @current-change="onPageChange">
            </filter-table>
        </div>

        <el-dialog :visible.sync="createVisible" title="添加运费" width="500px" @close="closeCreateHandler">
            <el-form :model="createForm" ref="createForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="address" label="地址">
                    <el-input v-model="createForm.address" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="freight" label="运费">
                    <el-input v-model="createForm.freight" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreate">取消</el-button>
                <el-button type="primary" @click="confirmCreate" :loading="operateLoading">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="updateVisible" title="修改运费" width="500px" @close="closeUpdateHandler">
            <el-form :model="updateForm" ref="updateForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="address" label="地址">
                    <el-input v-model="updateForm.address" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="freight" label="运费">
                    <el-input v-model="updateForm.freight" placeholder="请输入"></el-input>
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
    name: 'base-supplier',

    data () {
        return {
            isLoading: false,
            operateLoading: false,
            dataList: [],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    field: 'address',
                    name: '地址'
                }, {
                    field: 'freight',
                    name: '运费（元/吨）'
                }, {
                    field: 'lastUpdateTime',
                    name: '更新时间',
                    formatter: row => this.$time(row.lastUpdateTime)
                }, {
                    field: 'operate',
                    name: '操作',
                    render: (h, { row }) => {
                        return h('div', [
                            h('el-button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.updateFreight(row)
                                    }
                                }
                            }, '修改'),
                            h('el-button', {
                                props: {
                                    type: 'danger',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.removeFreight(row)
                                    }
                                }
                            }, '删除')
                        ])
                    }
                }
            ],
            createVisible: false,
            updateVisible: false,
            createForm: {
                address: '',
                freight: ''
            },
            updateForm: {
                address: '',
                freight: '',
                freightId: ''
            },
            rules: {
                address: [
                    { required: true, message: '请输入供应商所在地', trigger: 'blur' }
                ],
                freight: [
                    { required: true, message: '请输入运费', trigger: 'blur' }
                ]
            }
        }
    },

    created () {
        this.search()
    },

    methods: {
        ...mapActions('base', ['freightListX', 'createFreightX', 'updateFreightX', 'removeFreightX']),

        search () {
            this.pagination.page = 1
            this.getFreightList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getFreightList()
        },

        async getFreightList () {
            this.isLoading = true
            const response = await this.freightListX({
                page: this.pagination.page,
                pageSize: this.pagination.pageSize
            })
            this.isLoading = false
            if (response.code === 200) {
                this.dataList = response.data.rows
                this.pagination.total = response.data.count
            }
        },

        // 增加费率设置
        createFreight () {
            this.createVisible = true
        },

        // 确认设置
        async confirmCreate () {
            try {
                const valid = await this.$refs['createForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.createFreightX(Object.assign({}, this.createForm, {
                    freight: Number(this.createForm.freight)
                }))
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                    this.createVisible = false
                    this.getFreightList()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            } catch (exp) {
                console.log(exp)
                this.operateLoading = false
            }
        },

        // 取消设置
        cancelCreate () {
            this.createVisible = false
        },

        // 关闭
        closeCreateHandler () {
            this.$refs['createForm'].resetFields()
        },

        // 修改费率设置
        updateFreight (row) {
            this.updateVisible = true
            this.$nextTick(() => {
                this.updateForm.freightId = row.freightId
                this.updateForm.address = row.address
                this.updateForm.freight = row.freight
            })
        },

        // 确认修改
        async confirmUpdate () {
            try {
                const valid = await this.$refs['updateForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.updateFreightX(Object.assign({}, this.updateForm, {
                    freight: Number(this.updateForm.freight)
                }))
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    this.updateVisible = false
                    this.getFreightList()
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

        // 取消设置
        cancelUpdate () {
            this.updateVisible = false
        },

        // 删除费率
        async removeFreight (row) {
            try {
                await this.$confirm('确认删除该条记录？', '提示')
                const response = await this.removeFreightX({
                    freightId: row.freightId
                })
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getFreightList()
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

        // 关闭
        closeUpdateHandler () {
            this.$refs['updateForm'].resetFields()
        }
    }
}
</script>
<style lang="scss">
    .base-freight {
        .el-form-item--small  {
            .el-form-item__content, .el-form-item__label {
                line-height: unset;
            }

            .el-form-item {
                margin-bottom: 0px;
            }
        }

        .el-select.open {
            .el-input {
                .el-input__inner {
                    border: 1px solid $success;
                    color: $success;
                }

                .el-input__suffix {
                    color: $success;

                    .el-input__suffix-inner {
                        color: $success;

                        .el-select__caret {
                            color: $success;
                        }
                    }
                }
            }
        }
    }
</style>