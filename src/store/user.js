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
            setKey('zeus_userInfo', userInfo)
        }
    },

    actions: {
        async userLoginX ({ commit }, params) {
            const response = await axios.post('/user/login', params)
            if (response.code === 200) {
                commit('setUserInfo', response.data.userInfo)
            }
            return response
        },

        async userInfoX ({ commit, state }, force = false) {
            var userInfo = state.userInfo && state.userInfo.userName ? state.userInfo : getKey('zeus_userInfo')
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