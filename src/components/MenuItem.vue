<template>
    <el-submenu v-if="data.type === 'subMenu'" :index="data.menuCode">
        <template #title>
            <i :class="data.menuIcon"></i>
            <span>{{data.menuName}}</span>
        </template>
        <menu-item v-for="item in data.subMenus" :data="item" :key="item.menuCode"></menu-item>
    </el-submenu>
    <el-menu-item v-else-if="data.type === 'item'" :index="data.menuCode">
        <i :class="data.menuIcon" v-if="data.menuIcon"></i>
        <span slot="title">{{data.menuName}}</span>
    </el-menu-item>
</template>

<script>
    export default {
        name: 'MenuItem',

        props: {
            data: {
                type: Object
            }
        },

        methods: {
            openMenu (url) {
                location.href = url
            }
        }
    }
</script>
<style lang="scss">
    
</style>