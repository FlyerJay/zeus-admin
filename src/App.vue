<template>
    <el-container class="layout">
        <el-header class="layout-header" v-if="$route.path.indexOf('/user') === -1">
            <transition name="logo">
                <div class="header-logo" v-show="!isCollapse">
                    <div class="title">
                        <img src="./assets/images/font-logo.png" alt="">
                    </div>
                </div>
            </transition>

            <a class="header-btn" @click="toggleMenu"><i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i></a>

            <div class="header-right">
                <a class="header-btn fl">
                    <i class="el-icon-user-solid"></i>
                    <span>{{ userInfo.externalName }} |</span>
                    <span>{{ userInfo.userName }}</span>
                </a>
                <a class="header-btn fl" @click="logout">
                    <i class="el-icon-s-tools"></i>
                    <span>退出</span>
                </a>
            </div>
        </el-header>

        <el-container v-if="$route.path.indexOf('/user') === -1">
            <el-aside class="layout-aside" width="">
                <el-menu class="side-menu" :default-active="activdMenu" :collapse="isCollapse" @select="selectMenuHandler">
                <menu-item v-for="item in menuData" :data="item" :key="item.menuCode"></menu-item>
                </el-menu>
            </el-aside>

            <el-main class="layout-main">
                <router-view></router-view>
            </el-main>
        </el-container>

        <el-container v-else>
            <router-view></router-view>
        </el-container>
    </el-container>
</template>

<script>
import MenuItem from '@/components/MenuItem'
import { mapActions, mapState } from 'vuex'

export default {
    name: 'App',

    components: {
        MenuItem
    },

    computed: {
        ...mapState('user', {
            userInfo: state => state.userInfo,
            menuData: state => state.menuData
        })
    },

    data () {
        return {
            isCollapse: false,
            activdMenu: ''
        }
    },

    watch: {
        $route (to) {
            if (to.meta.menuIndex) {
                this.activdMenu = to.meta.menuIndex
            } else {
                this.activdMenu = to.name
            }
        }
    },

    created () {
        const isLogin = this.isLogin()
        if (!isLogin) {
            this.$router.replace('/user/login')
            return
        }
        this.userInfoX()
    },

    methods: {
        ...mapActions('user', ['userInfoX']),

        toggleMenu () {
            this.isCollapse = !this.isCollapse
        },

        selectMenuHandler (index) {
            let name = index
            this.$router.push({ name: name })
        },

        logout () {
            this.$router.replace('/user/login')
        },

        isLogin () {
            return !!this.$storage.get('gcyd_token')
        }
    }
}
</script>

<style lang="scss">
$menu-width: 150px;
$menu-height: 60px;
$menu-background-color: white;

.layout {
    height: 100vh;
    background-color: $neut4;

    .layout-header {
        background-color: $menu-background-color;
        color: $menu-background-color;
        line-height: $menu-height;
        padding: 0;

        .header-logo {
            float: left;
            width: $menu-width;
            overflow: hidden;
        }

        .title {
            display: flex;
            text-align: center;
            width: $menu-width;
            font-size: 18px;
            color: $neut2;
            font-weight: bold;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 60px;

            img {
                height: 35px;
            }
        }

        @keyframes reduce {
            from {
                width: $menu-width;
            }
            to {
                width: 0;
            }
        }

        @keyframes grow {
            from {
                width: 0;
            }
            to {
                width: $menu-width;
            }
        }

        .logo-enter-active {
            animation: grow .5s ease;
        }

        .logo-leave-active {
            animation: reduce .5s ease;
        }

        .header-btn {
            display: inline-block;
            padding: 0 15px;
            height: $menu-height;
            line-height: $menu-height;
            color: $neut2;

            &:hover {
                color: $primary;
            }

            i{
                font-size: 20px;
                line-height: $menu-height;
                position: relative;
                top: 2px;
            }

            span {
                margin-left: 3px;
            }
        }

        .header-right {
            float: right;
        }
    }

    .layout-aside {
        background-color: $menu-background-color;

        .el-menu--collapse {
            width: 64px;
        }

        .el-menu {
            background-color: transparent;
            border-right: none;

            .el-menu-item, .el-submenu__title {
                color: $neut2;

                i {
                    color: $neut2;
                }

                &.is-active {
                    background-color: $primary;
                    color: $neut4;

                    i {
                        color: $neut4;
                    }
                }
                
                &:hover {
                    background-color: $primary;
                    color: $neut4;

                    i {
                        color: $neut4;
                    }
                }
            }
        }
    }

    .side-menu:not(.el-menu--collapse) {
        width: $menu-width;
        min-height: 400px;
    }

    .layout-main {
        height: calc(100vh - 75px);
        overflow: auto;
        position: relative;
        margin: 0 15px;
        margin-top: 15px;
        background-color: #fff;
        padding: 15px;
    }
}
</style>