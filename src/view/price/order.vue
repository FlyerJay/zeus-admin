<template>
    <div class="price-cart">
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
            columns: [
                {
                    field: 'orderNo',
                    name: '订单号'
                }, {
                    field: 'createTime',
                    name: '下单时间',
                    formatter: row => this.$time(row.createTime)
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
                        }, row.validate ? '未审核' : '已审核')
                    }
                }, {
                    field: 'operate',
                    name: '操作'
                }
            ]
        }
    },

    methods: {
        ...mapActions('price', ['cartListX']),

        search () {
            this.pagination.page = 1
            this.getCartList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getCartList()
        },

        async getCartList () {
            if (!this.searchForm.searchData) {
                return this.$message({
                    type: 'error',
                    message: '查询内容不可为空'
                })
            }
            try {
                this.isLoading = true
                const response = await this.cartListX({
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize
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
        }
    }
}
</script>