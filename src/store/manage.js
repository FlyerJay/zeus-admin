import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {

    },

    mutations: {
        
    },

    actions: {
        roleListPageX (store, params) {
            return axios.get('/role/list/page', { params })
        },

        roleListX (store, params) {
            return axios.get('/role/list', { params })
        },

        createRoleX (store, params) {
            return axios.post('/role/create', params)
        },

        memberListX (store, params) {
            return axios.get('/member/list', { params })
        },

        createMemberX (store, params) {
            return axios.post('/member/create', params)
        },

        updateMemberX (store, params) {
            return axios.post('/member/update', params)
        },

        removeMemberX (store, params) {
            return axios.post('/member/remove', params)
        }
    }
}