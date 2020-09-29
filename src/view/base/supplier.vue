<template>
    <div class="base-supplier page">
        <div class="filter clearfix">
            <el-form ref="searchForm" :model="searchForm" size="small" inline>
                <el-form-item prop="supplierName" label="搜索">
                    <el-input v-model="searchForm.supplierName" placeholder="供应商名称/支持模糊搜索"></el-input>
                </el-form-item>

                <el-form-item prop="address" label="所在地">
                    <el-select v-model="searchForm.address" placeholder="全部" clearable>
                        <el-option :label="item.address" :value="item.address" v-for="(item, index) in addressList" :key="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" :loading="isLoading" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-loading="isLoading">
            <filter-table
                :data="dataList"
                :columns="columns"
                border
                pagination
                :page-size="pagination.pageSize"
                :total="pagination.total"
                @current-change="onPageChange">
            </filter-table>
        </div>

        <el-dialog :visible.sync="updateVisible" title="修改供应商信息" width="500px" @close="closeUpdateHandler">
            <el-form :model="updateForm" ref="updateForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="supplierName" label="供应商">
                    <el-input v-model="updateForm.supplierName" placeholder="请输入" disabled></el-input>
                </el-form-item>

                <el-form-item prop="address" label="地址">
                    <el-input v-model="updateForm.address" placeholder="请输入" disabled></el-input>
                </el-form-item>

                <el-form-item prop="benifit" label="优惠">
                    <el-input v-model="updateForm.benifit" placeholder="请输入"></el-input>
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
import { mapState, mapActions } from 'vuex'

export default {
    name: 'base-supplier',

    data () {
        return {
            isLoading: false,
            operateLoading: false,
            searchForm: {
                supplierName: '',
                address: ''
            },
            dataList: [],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    field: 'supplierName',
                    name: '供应商名称'
                }, {
                    field: 'address',
                    name: '地址'
                }, {
                    field: 'freight',
                    name: '运费（元/吨）'
                }, {
                    field: 'benifit',
                    name: '厂家优惠（元/吨）'
                }, {
                    field: 'valueTime',
                    name: '报价时间',
                    formatter: row => this.$time(Number(row.valueTime))
                }, {
                    field: 'inventoryTime',
                    name: '库存更新时间',
                    formatter: row => this.$time(Number(row.inventoryTime))
                }, {
                    field: 'isValide',
                    name: '启用状态',
                    render: (h, { row }) => {
                        return h('el-select', {
                            props: {
                                size: 'small',
                                value: row.isValide
                            },
                            class: row.isValide === 1 ? 'open' : '',
                            on: {
                                input: value => {
                                    row.isValide = value
                                },
                                change: value => {
                                    console.log(value)
                                    this.changeSupplierState(value, row.supplierId)
                                }
                            }
                        }, [
                            h('el-option', {
                                props: {
                                    label: '开启',
                                    value: 1
                                }
                            }),
                            h('el-option', {
                                props: {
                                    label: '关闭',
                                    value: 0
                                }
                            })
                        ])
                    }
                }, {
                    field: 'operate',
                    name: '操作',
                    render: (h, { row }) => {
                        return h('el-button', {
                            props: {
                                size: 'small',
                                type: 'warning'
                            },
                            on: {
                                click: () => {
                                    this.updateSupplier(row)
                                }
                            }
                        }, '修改')
                    }
                }
            ],
            updateVisible: false,
            updateForm: {
                supplierName: '',
                address: '',
                benifit: '',
                supplierId: ''
            },
            rules: {}
        }
    },

    computed: {
        ...mapState('base', {
            addressList: state => state.addressList
        })
    },

    created () {
        this.addressListX()
        this.search()
    },

    methods: {
        ...mapActions('base', ['addressListX', 'supplierListX', 'openSupplierX', 'closeSupplierX', 'updateSupplierX']),

        search () {
            this.pagination.page = 1
            this.getSupplierList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getSupplierList()
        },

        async getSupplierList () {
            this.isLoading = true
            const response = await this.supplierListX({
                page: this.pagination.page,
                pageSize: this.pagination.pageSize,
                address: this.searchForm.address,
                supplierName: this.searchForm.supplierName
            })
            this.isLoading = false
            if (response.code === 200) {
                this.dataList = response.data.rows
                this.pagination.total = response.data.count
            }
        },

        async changeSupplierState (value, supplierId) {
            if (value === 1) {
                await this.openSupplierX({supplierId})
            } else {
                await this.closeSupplierX({supplierId})
            }

            this.getSupplierList()
        },

        updateSupplier (row) {
            this.updateVisible = true
            this.$nextTick(() => {
                this.updateForm.supplierId = row.supplierId
                this.updateForm.benifit = row.benifit
                this.updateForm.supplierName = row.supplierName
                this.updateForm.address = row.address
            })
        },

        // 确认修改
        async confirmUpdate () {
            try {
                const valid = await this.$refs['updateForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.updateSupplierX(this.updateForm)
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    this.updateVisible = false
                    this.getSupplierList()
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

        closeUpdateHandler () {
            this.$refs['updateForm'].resetFields()
        }
    }
}
</script>
<style lang="scss">
    .base-supplier {
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