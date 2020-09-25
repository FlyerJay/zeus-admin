import axios from '../assets/js/axios'
import { setKey, getKey } from '../assets/js/utils'

export default {
    namespaced: true,

    state: {
        userInfo: {}
    },

    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            setKey('gcyd_userInfo', userInfo)
        },

        setUserToken(state, token) {
            setKey('gcyd_token', token)
        }
    },

    actions: {
        async userLoginX ({ commit }, params) {
            const response = await axios.post('/user/login', params)
            if (response.code === 200) {
                commit('setUserInfo', response.data.userInfo)
                commit('setUserToken', response.data.token)
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
            return userInfo
        }
    }
}