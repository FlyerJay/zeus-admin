import moment from 'moment'

// 添加cookie
export const addCookie = (name, value, expiresHours) => {
    let cookieString = name + '=' + escape(value) + '; path=/'
    // 判断是否设置过期时间
    if (expiresHours > 0) {
        let date = new Date()
        date.setTime(date.getTime + expiresHours * 3600 * 1000)
        cookieString = cookieString + '; expires=' + date.toUTCString()
    }
    document.cookie = cookieString
}

// 获取cookie
export const getCookie = name => {
    const $match = document.cookie.match(new RegExp(`${name}=([^;]*)(?:(;|$))?`))
    return $match && $match[1]
}

// 删除cookie
export const removeCookie = name => {
    let date = new Date()
    date.setTime(date.getTime() - 10000)
    document.cookie = name + '=; path=/; expires=' + date.toUTCString()
}

export const getKey = (key, subKey) => {
    const keyStr = localStorage.getItem(key)
    const keyObj = JSON.parse(keyStr)
    if (typeof keyObj !== 'object' || !keyObj) return keyObj
    return subKey ? keyObj[subKey] : keyObj
}

export const setKey = (key, obj) => {
    localStorage.setItem(key, JSON.stringify(obj))
}

export const removeKey = key => {
    localStorage.removeItem(key)
}

export const isEmptyObject = obj => {
    return JSON.stringify(obj) === '{}'
}

// 格式化金钱
export const formatMoney = function (number) {
    if (!number) return 0
    try {
        return parseFloat(number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } catch (error) {
        return '-'
    }
}

// 格式化日期
export const formatDate = function (date, fmt = 'YYYY-MM-DD') {
    if (!date) return ''
    return moment(date).format(fmt)
}