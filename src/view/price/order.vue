<template>
    <div class="price-cart">
        <div class="filter clearfix">
            <el-form ref="searchForm" :model="searchForm" size="small" inline>
                <el-form-item prop="orderNo" label="规格">
                    <el-input v-model="searchForm.orderNo" placeholder="支持关键词/模糊查询"></el-input>
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

        <el-dialog :visible.sync="detailVisible" title="订单详情" width="1200px">
            <filter-table
                :data="orderDetail"
                :columns="detailColumns"
                :setting="false"
                border>
            </filter-table>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'price-cart',

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
            searchForm: {
                orderNo: ''
            },
            columns: [
                {
                    field: 'orderNo',
                    name: '订单号',
                    width: 200
                }, {
                    field: 'createTime',
                    name: '下单时间',
                    formatter: row => this.$time(row.createTime),
                    width: 200
                }, {
                    field: 'supplierName',
                    name: '供应商'
                }, {
                    field: 'orderWeight',
                    name: '总吨位'
                }, {
                    field: 'orderPrice',
                    name: '总价'
                }, {
                    field: 'orderAdjust',
                    name: '下浮总额'
                }, {
                    field: 'userId',
                    name: '下单人'
                }, {
                    field: 'validate',
                    name: '状态',
                    render: (h, { row }) => {
                        return h('el-tag', {
                            props: {
                                type: row.validate === 0 ? 'info' : 'success',
                                size: 'small'
                            }
                        }, row.validate === 0 ? '未审核' : '已审核')
                    }
                }, {
                    field: 'operate',
                    name: '操作',
                    render: (h, { row }) => {
                        return h('div', [
                            h('el-button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.detailLoading
                                },
                                on: {
                                    click: () => {
                                        this.viewOrderDetail(row)
                                    }
                                }
                            }, '查看')
                        ])
                    }
                }
            ],
            detailVisible: false,
            orderDetail: [],
            detailColumns: [
                {
                    field: 'spec',
                    name: '规格'
                }, {
                    field: 'type',
                    name: '类型'
                }, {
                    field: 'supplierName',
                    name: '供应商'
                }, {
                    field: 'orderAmount',
                    name: '数量'
                }, {
                    field: 'unitPrice',
                    name: '单价'
                }, {
                    field: 'daPrice',
                    name: '到岸价'
                }, {
                    field: 'minPrice',
                    name: '最低价'
                }, {
                    field: 'minSupplier',
                    name: '最低价供应商'
                }, {
                    field: 'minInventory',
                    name: '最低价库存'
                }, {
                    field: 'orderDcrease',
                    name: '总下浮'
                }, {
                    field: 'dcreaseUnit',
                    name: '单位下浮'
                }, {
                    field: 'comment',
                    name: '备注'
                }
            ],
            detailLoading: false
        }
    },

    created () {
        this.search()
    },

    methods: {
        ...mapActions('price', ['orderListX', 'orderDetailX']),

        search () {
            this.pagination.page = 1
            this.getOrderList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getOrderList()
        },

        async getOrderList () {
            try {
                this.isLoading = true
                const response = await this.orderListX({
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize,
                    orderNo: this.searchForm.orderNo
                })
                this.isLoading = false
                if (response.code === 200) {
                    this.dataList = response.data.row
                    this.pagination.total = response.data.totalCount
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            } catch (exp) {
                this.isLoading = false
            }
        },

        async viewOrderDetail (row) {
            this.detailVisible = true
            this.detailLoading = true
            const response = await this.orderDetailX({
                orderNo: row.orderNo
            })
            this.detailLoading = false
            if (response.code === 200) {
                this.orderDetail = response.data.row
            }
        }
    }
}
</script>