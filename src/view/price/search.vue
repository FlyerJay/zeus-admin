<template>
    <div class="base-freight page">
        <div class="filter clearfix">
            <el-form ref="searchForm" :model="searchForm" size="small" inline>
                <el-form-item prop="spec" label="规格">
                    <el-input v-model="searchForm.spec" placeholder="支持关键词/模糊查询"></el-input>
                </el-form-item>

                <el-form-item label="类别" prop="type">
                    <el-select v-model="searchForm.type" clearable>
                        <el-option value="黑管">黑管</el-option>
                        <el-option value="热镀锌">热镀锌</el-option>
                        <el-option value="镀锌带">镀锌带</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="供应商名称" prop="supplierName">
                    <el-input v-model="searchForm.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
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

        <el-dialog :visible.sync="orderVisible" title="下单信息" width="500px" @close="closeOrderHandler">
            <el-form :model="orderForm" ref="orderForm" label-position="left" :rules="rules" label-width="80px">
                <el-form-item prop="chartAmount" label="数量">
                    <el-input v-model="orderForm.chartAmount" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="comment" label="备注">
                    <el-input v-model="orderForm.comment" placeholder="请输入" type="textarea" rows="3"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelOrder">取消</el-button>
                <el-button type="primary" @click="confirmOrder" :loading="operateLoading">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { computeWeight } from '../../assets/js/utils'

export default {
    name: 'base-supplier',

    data () {
        return {
            isLoading: false,
            operateLoading: false,
            dataList: [],
            searchForm: {
                spec: '',
                type: '',
                supplierName: '',

            },
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    field: 'spec',
                    name: '规格'
                }, {
                    field: 'long',
                    name: '长度',
                    formatter: () => 6
                }, {
                    field: 'lastUpdateTime',
                    name: '最近更新时间'
                }, {
                    field: 'type',
                    name: '类别'
                }, {
                    field: 'supplierName',
                    name: '供应商'
                }, {
                    field: 'daPrice',
                    name: '到岸单价'
                }, {
                    field: 'purePrice',
                    name: '开单价'
                }, {
                    field: 'inventoryAmount',
                    name: '库存'
                }, {
                    field: 'perAmount',
                    name: '包装'
                }, {
                    field: 'perWeight',
                    name: '单支重量(kg)',
                    formatter: row => {                        
                        return computeWeight(row.spec, row.long).toFixed(2)
                    }
                }, {
                    field: 'inventoryWeight',
                    name: '库存重量(吨)',
                    formatter: row => {
                        const amount = Number(row.perAmount)
                        const inventoryAmount = Number(row.inventoryAmount)
                        const realAmt = amount * inventoryAmount
                        return (computeWeight(row.spec, row.long, realAmt) / 1000).toFixed(2)
                    }
                }, {
                    field: 'freight',
                    name: '运费'
                }, {
                    field: 'value',
                    name: '出厂价'
                }, {
                    field: 'benifit',
                    name: '厂家优惠'
                }, {
                    field: 'operate',
                    name: '操作',
                    render: (h, { row }) => {
                        return h('div', [
                            h('el-button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.goOrder(row)
                                    }
                                }
                            }, '下单')
                        ])
                    }
                }
            ],
            orderVisible: false,
            orderForm: {
                supplierInventoryId: '',
                chartAmount: '',
                comment: ''
            },
            rules: {
                chartAmount: [
                    { required: true, message: '请输入下单数量', trigger: 'blur' }
                ]
            }
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
        ...mapActions('base', ['addressListX']),
        ...mapActions('price', ['productListX', 'addToCartX']),

        search () {
            this.pagination.page = 1
            this.getProductList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getProductList()
        },

        async getProductList () {
            this.isLoading = true
            const response = await this.productListX({
                page: this.pagination.page,
                pageSize: this.pagination.pageSize,
                spec: this.searchForm.spec,
                type: this.searchForm.type,
                address: this.searchForm.address,
                supplierName: this.searchForm.supplierName
            })
            this.isLoading = false
            if (response.code === 200) {
                this.dataList = response.data.rows
                this.pagination.total = response.data.count
            }
        },

        goOrder (row) {
            this.orderVisible = true
            this.$nextTick(() => {
                this.orderForm.supplierInventoryId = row.supplierInventoryId
            })
        },

        // 确认修改
        async confirmOrder () {
            try {
                const valid = await this.$refs['orderForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.addToCartX(this.orderForm)
                this.operateLoading = false
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '加入购物车成功'
                    })
                    this.orderVisible = false
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
        cancelOrder () {
            this.orderVisible = false
        },

        closeOrderHandler () {
            this.$refs['orderForm'].resetFields()
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