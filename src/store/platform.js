import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {

    },

    mutations: {
        
    },

    actions: {
        accountListX (store, params) {
            return axios.get('/external/list', { params })
        },

        createAccountX (store, params) {
            return axios.post('/external/create', params )
        }
    }
}