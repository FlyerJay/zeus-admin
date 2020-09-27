import Vue from 'vue'
import Router from 'vue-router'
import user from './user'
import base from './base'
import price from './price'
import platform from './plarform'

Vue.use(Router)

export default new Router({
    routes: [
        ...user,
        ...base,
        ...price,
        ...platform
    ]
})