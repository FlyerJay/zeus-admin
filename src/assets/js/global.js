import { formatDate, formatMoney, getCookie, removeCookie, addCookie, getKey, setKey, removeKey } from './utils'
import components from '@/components'

export default {
    install (Vue) {
        Vue.filter('currency', formatMoney)
        Vue.filter('date', formatDate)

        Vue.prototype.$date = formatDate
        Vue.prototype.$currency = formatMoney

        Vue.prototype.$cookie = {
            set: addCookie,
            get: getCookie,
            remove: removeCookie
        }

        Vue.prototype.$storage = {
            set: setKey,
            get: getKey,
            remove: removeKey
        }

        // 注册全局组件
        for (let key of Object.keys(components)) {
            Vue.component(components[key].name, components[key])
        }
    }
}
