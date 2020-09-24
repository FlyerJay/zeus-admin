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
        },

        batchListX (store, params) {
            return axios.post('/batch/batch', params)
        },

        cartListX (store, params) {
            return axios.get('/chart/list', { params })
        },

        addToCartX (store, params) {
            return axios.post('/chart/addToChart', params)
        },

        createOrderX (store, params) {
            return axios.post('/order/add', params)
        },

        orderListX (store, params) {
            return axios.get('/order/list', { params })
        },

        orderDetailX (store, params) {
            return axios.get('/order/detail', { params })
        }
    }
}