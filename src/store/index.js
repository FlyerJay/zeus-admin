import Vue from 'vue'
import Vuex from 'vuex'
import company from './company'
import user from './user'
import base from './base'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        company,
        user,
        base
    }
})