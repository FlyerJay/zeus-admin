import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {
        addressList: []
    },

    mutations: {
        setAddressList (state, addressList) {
            state.addressList = addressList
        }
    },

    actions: {
        async addressListX ({ commit }, params) {
            const response = await axios.get('/supplier/address', { params })
            if (response.code === 200) {
                commit('setAddressList', response.data)
            }
            return response
        },

        supplierListX (store, params) {
            return axios.get('/supplier/list', { params })
        },

        openSupplierX (store, params) {
            return axios.post('/supplier/open', params)
        },

        closeSupplierX (store, params) {
            return axios.post('/supplier/close', params)
        },

        freightListX (store, params) {
            return axios.get('/freight/list', { params })
        },

        createFreightX (store, params) {
            return axios.post('/freight/add', params)
        },

        updateFreightX (store, params) {
            return axios.post('/freight/update', params)
        },

        removeFreightX (store, params) {
            return axios.post('/freight/remove', params)
        }
    }
}