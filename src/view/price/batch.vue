<template>
    <div class="price-batch page">
        <el-form :inline="false" :model="searchForm" class="demo-form-inline">
            <el-form-item>
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="规格，类型，数量，以空格（空格可以是多个）分割，例：100*100*2.50(*6) (黑管) (10)，加了括号的地方表示可以省略。另，类型和数量可以调换位置，如：100*100*2.5*6 10 黑管，每行只能有一条数据。"
                    v-model="searchForm.searchData">
                </el-input>
            </el-form-item>
        </el-form>

        <div class="filter clearfix">
           <el-button size="small" type="primary" icon="el-icon-search" @click="search">批量查询</el-button>
        </div>

        <div v-loading="isLoading">
            <filter-table
                :data="dataList"
                :columns="columns"
                border>
            </filter-table>
        </div>

        <el-dialog :visible.sync="detailVisible" title="方案详情" width="1000px">
            <filter-table
                :data="caseDetail"
                :columns="detailColumns"
                border>
            </filter-table>


        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'price-batch',

    data () {
        return {
            isLoading: false,
            operateLoading: false,
            dataList: [],
            searchForm: {
                searchData: ''
            },
            columns: [
                {
                    field: 'name',
                    name: '解决方案'
                }, {
                    field: 'supplierName',
                    name: '供应商'
                }, {
                    field: 'price',
                    name: '总价格'
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
                                        this.viewCaseDetail(row)
                                    }
                                }
                            }, '查看详情')
                        ])
                    }
                }
            ],
            detailVisible: false,
            caseDetail: [],
            detailColumns: [
                {
                    field: 'selection',
                    type: 'selection'
                }, {
                    field: 'spec',
                    name: '规格'
                }, {
                    field: 'long',
                    name: '长度'
                }, {
                    field: 'amount',
                    name: '需求数量'
                }, {
                    field: 'type',
                    name: '类型'
                }, {
                    field: 'supplierName',
                    name: '供应商'
                }, {
                    field: 'inventoryAmount',
                    name: '库存数量'
                }, {
                    field: 'weight',
                    name: '需求重量',
                    formatter: row => Number(row.weight).toFixed(2) + '吨'
                }, {
                    field: 'daPrice',
                    name: '到岸单价'
                }, {
                    field: 'totalPrice',
                    name: '到岸总价'
                }
            ]
        }
    },

    methods: {
        ...mapActions('price', ['batchListX']),

        search () {
            this.getBatchList()
        },

        async getBatchList () {
            if (!this.searchForm.searchData) {
                return this.$message({
                    type: 'error',
                    message: '查询内容不可为空'
                })
            }
            try {
                this.isLoading = true
                const response = await this.batchListX({
                    searchData: this.searchForm.searchData
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

        // 查看方案详情
        viewCaseDetail (row) {
            this.caseDetail = row.list
            this.detailVisible = true
        },

        goOrder () {

        }
    }
}
</script>
<style lang="scss">
    .price-batch {
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