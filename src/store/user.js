import axios from '../assets/js/axios'
import { setKey, getKey, deepCopy } from '../assets/js/utils'
import menu from '../assets/json/menu'

export default {
    namespaced: true,

    state: {
        userInfo: {},

        menuData: []
    },

    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            setKey('gcyd_userInfo', userInfo)
        },

        setUserToken(state, token) {
            setKey('gcyd_token', token)
        },

        setMenu(state, user) {
            const menuData = []
            // 系统管理员账号
            if (user.type === 'external') {
                if (user.accountType === 'A') {
                    menuData.push(menu.platform)
                } else {
                    menuData.push(menu.manage)
                }
            } else if (user.type === 'member') {
                var permissions = {}
                user.permissions.forEach(per => {
                    if (permissions[per[0]] instanceof Array) {
                        permissions[per[0]].push(per[1])
                    } else {
                        permissions[per[0]] = []
                        permissions[per[0]].push(per[1])
                    }
                })
                Object.keys(permissions).forEach(key => {
                    var menus = deepCopy(menu[key])
                    var subMenus = []
                    permissions[key].forEach(subKey => {
                        const subMenu = menus.subMenus.filter(subMenus => subMenus.menuCode === subKey)[0]
                        subMenus.push(subMenu)
                    })
                    menus.subMenus = subMenus
                    menuData.push(menus)
                })
            }
            state.menuData = menuData
        }
    },

    actions: {
        async userLoginX ({ commit }, params) {
            const response = await axios.post('/user/login', params)
            if (response.code === 200) {
                commit('setUserInfo', response.data.userInfo)
                commit('setUserToken', response.data.token)
                commit('setMenu', response.data.userInfo)
            }
            return response
        },

        async userSettingX ({ commit }, params) {
            const response = await axios.post('/user/setting', params)
            if (response.code === 200) {
                commit('setUserInfo', response.data.userInfo)
                commit('setUserToken', response.data.token)
            }
            return response
        },

        async userInfoX ({ commit, state }, force = false) {
            var userInfo = state.userInfo && state.userInfo.userName ? state.userInfo : getKey('gcyd_userInfo')
            if (!userInfo || force) {
                const response = await axios.get('/user')
                if (response.code === 200) {
                    userInfo = response.data
                }
            }
            commit('setUserInfo', userInfo)
            commit('setMenu', userInfo)
            return userInfo
        }
    }
}