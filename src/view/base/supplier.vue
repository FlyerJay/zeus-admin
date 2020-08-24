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
                    <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
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
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'base-supplier',

    data () {
        return {
            isLoading: false,
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
        ...mapActions('base', ['addressListX', 'supplierListX', 'openSupplierX', 'closeSupplierX']),

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
                this.dataList = response.data.row
                this.pagination.total = response.data.totalCount
            }
        },

        async changeSupplierState (value, supplierId) {
            if (value === 1) {
                this.openSupplierX({supplierId})
            } else {
                this.closeSupplierX({supplierId})
            }
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