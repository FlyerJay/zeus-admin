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
                @current-change="onPageChange"
                @selection-change="selectionChange">
                <template slot="append" v-if="dataList.length !== 0">
                    <div class="custom-summary">
                        <template v-if="checkedAmount">
                            <span>已选商品(含运费)：{{ checkedAmount | currency }}</span>
                            <span>(吨位：{{ checkedWeight | currency }})</span>
                        </template>
                        <span v-else>请选择</span>

                        <el-button :disabled="checkedAmount === 0" type="primary" style="margin-left: 20px" size="mini" icon="el-icon-check" @click="submitOrder">提交</el-button>
                    </div>
                </template>
            </filter-table>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { computeWeight } from '../../assets/js/utils'

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
                    type: 'selection'
                }, {
                    field: 'spec',
                    name: '规格'
                }, {
                    field: 'long',
                    name: '长度'
                }, {
                    field: 'supplierName',
                    name: '供应商'
                }, {
                    field: 'chartAmount',
                    name: '数量'
                }, {
                    field: 'perAmount',
                    name: '包装'
                }, {
                    field: 'chartWeight',
                    name: '吨位',
                    formatter: row => {
                        if (!row.spec) {
                            row.chartWeight = 0
                            return ''
                        }
                        const per = Number(row.perAmount)
                        const amount = Number(row.chartAmount)
                        
                        row.chartWeight = (computeWeight(row.spec, row.long, amount * per) / 1000).toFixed(2)
                        return row.chartWeight
                    }
                }, {
                    field: 'purePrice',
                    name: '开单价',
                    formatter: row => {
                        row.purePrice = (row.value - row.benifit).toFixed(2)
                        return (row.value - row.benifit).toFixed(0)
                    }
                }, {
                    field: 'daPrice',
                    name: '到岸价',
                    formatter: row => {
                        const freight = Number(row.freight) - Number(row.benifit ? row.benifit : 0)
                        row.daPrice = (row.value + freight).toFixed(2)
                        return (row.value + freight).toFixed(0)
                    }
                }, {
                    field: 'chartAdjust',
                    name: '采购议价'
                }, {
                    field: 'totalAdjust',
                    name: '议价总额',
                    formatter: row => {
                        const adjust = Number(row.chartAdjust ? row.chartAdjust : 0) * row.chartWeight
                        row.totalAdjust = adjust.toFixed(2)
                        return adjust.toFixed(2)
                    }
                }, {
                    field: 'totalPrice',
                    name: '金额',
                    formatter: row => {
                        const price = Number(row.purePrice)
                        const adjust = Number(row.chartAdjust ? row.chartAdjust : 0) * row.chartWeight
                        const totoalPice = price ? price * row.chartWeight - adjust : 0
                        row.totalPrice = totoalPice.toFixed(2)
                        return totoalPice.toFixed(2)
                    }
                }, {
                    field: 'userId',
                    name: '用户Id'
                }, {
                    field: 'comment',
                    name: '备注'
                }
            ],
            checkedData: []
        }
    },

    created () {
        this.search()
    },

    computed: {
        checkedAmount () {
            return this.checkedData.reduce((a, b) => a + (Number(b.totalPrice) || 0), 0)
        },

        checkedWeight () {
            const total = this.checkedData.reduce((a, b) => {
                const per = Number(b.perAmount)
                const amount = Number(b.chartAmount)
                const weight = computeWeight(b.spec, b.long, per * amount) / 1000
                return a + weight
            }, 0)
            return Number(total.toFixed(2))
        }
    },

    methods: {
        ...mapActions('price', ['cartListX', 'createOrderX']),

        search () {
            this.pagination.page = 1
            this.getCartList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getCartList()
        },

        async getCartList () {
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
        },

        selectionChange (selection) {
            this.checkedData = selection
        },

        async submitOrder () {
            try {
                await this.$confirm('确认提交所选的货物？', '提示')
                const response = await this.createOrderX({
                    supplierInventoryIds: this.checkedData,
                    orderWeight: this.checkedWeight,
                    orderPrice: this.checkedAmount,
                    orderAdjust: 0
                })
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    })
                    this.getCartList()
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
<style lang="scss">
    .price-cart {
        .custom-summary {
            height: 46px;
            line-height: 46px;
            padding: 0 15px;
            background-color: $neut4;
        }
    }
</style>