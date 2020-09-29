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
                pageSize: 12,
                total: 0
            },
            columns: [
                {
                    field: 'spec',
                    name: '规格'
                }, {
                    field: 'lastUpdateTime',
                    name: '最近更新时间',
                    formatter: row => this.$date(row.lastUpdateTime)
                }, {
                    field: 'type',
                    name: '类别'
                }, {
                    field: 'supplierName',
                    name: '供应商'
                }, {
                    field: 'address',
                    name: '地址'
                }, {
                    field: 'value',
                    name: '出厂价（元/吨）'
                }
            ],
            updateVisible: false,
            updateForm: {
                value: '',
                supplierValueId: ''
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
        ...mapActions('base', ['addressListX', 'priceListX']),

        search () {
            this.pagination.page = 1
            this.getPriceList()
        },

        onPageChange (page) {
            this.pagination.page = page
            this.getPriceList()
        },

        async getPriceList () {
            this.isLoading = true
            const response = await this.priceListX({
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

        updatePrice (row) {
            this.updateVisible = true
            this.$nextTick(() => {
                this.updateForm.supplierValueId = row.supplierValueId
                this.updateForm.value = row.value
            })
        },

        // 确认修改
        async confirmUpdate () {
            try {
                const valid = await this.$refs['updateForm'].validate()
                if (!valid) return
                this.operateLoading = true
                const response = await this.updateFreightX(this.updateForm)
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