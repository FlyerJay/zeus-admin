import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {
        companyList: []
    },

    mutations: {
        setCompanyList (state, companyList) {
            state.companyList = companyList
        }
    },

    actions: {
        async companyListX ({ commit }, params) {
            const response = await axios.get('/company', { params })
            if (response && response.length > 0) {
                commit('setCompanyList', response.filter(item => item.comId === '10'))
            }
            return response
        }
    }
}