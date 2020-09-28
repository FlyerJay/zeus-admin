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

        createRoleX (store, params) {
            return axios.post('/role/create', params)
        }
    }
}