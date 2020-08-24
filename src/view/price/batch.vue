<template>
    <div class="base-freight page">
        <div class="filter clearfix">
           <el-button size="small" type="primary" icon="el-icon-search">批量查询</el-button>
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
                        const specArr = row.spec.split('*')
                        const height = Number(specArr[0])
                        const width = Number(specArr[1])
                        const land = Number(specArr[2])
                        const long = Number(row.long) ? Number(row.long) : 6
                        const perimeter = 2 * height + 2 * width
                        return ((perimeter / 3.14 - land) * land * long * 0.02466).toFixed(2)
                    }
                }, {
                    field: 'inventoryWeight',
                    name: '库存重量(吨)',
                    formatter: row => {
                        const specArr = row.spec.split('*')
                        const height = Number(specArr[0])
                        const width = Number(specArr[1])
                        const land = Number(specArr[2])
                        const long = Number(row.long) ? Number(row.long) : 6
                        const perimeter = 2 * height + 2 * width
                        const amount = Number(row.perAmount)
                        const inventoryAmount = Number(row.inventoryAmount)
                        return ((perimeter / 3.14 - land) * land * long * 0.02466 * amount * inventoryAmount / 1000).toFixed(2)
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
            ]
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
        ...mapActions('price', ['productListX']),

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
                this.dataList = response.data.row
                this.pagination.total = response.data.totalCount
            }
        },

        goOrder () {

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