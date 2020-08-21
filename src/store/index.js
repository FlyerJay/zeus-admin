import Vue from 'vue'
import Vuex from 'vuex'
import company from './company'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        company,
        user
    }
})