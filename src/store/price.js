import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {
    },

    mutations: {
    },

    actions: {
        productListX (store, params) {
            return axios.get('/product/list', { params })
        }
    }
}