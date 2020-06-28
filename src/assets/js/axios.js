import axios from 'axios'
import router from '../../router'
import Vue from 'vue'

const $vm = new Vue()

axios.defaults.timeout = 50000
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.defaults.baseURL = '/api/v1/admin'

// 添加一个响应拦截器
axios.interceptors.response.use(
    function (res) {
        if (res.data.code === 401) {
            $vm.$message({
                type: 'error',
                message: '登录已过期，请重新登录'
            })
            router.push('/user/login')
            return res.data
        } else {
            return res.data
        }
    },
    function (err) {
        // 处理请求错误
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误'
                    break

                case 401:
                    err.message = '未授权，请登录'
                    break

                case 403:
                    err.message = '拒绝访问'
                    break

                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`
                    break

                case 408:
                    err.message = '请求超时'
                    break

                case 500:
                    err.message = '服务器内部错误'
                    break

                case 501:
                    err.message = '服务未实现'
                    break

                case 502:
                    err.message = '网关错误'
                    break

                case 503:
                    err.message = '服务不可用'
                    break

                case 504:
                    err.message = '网关超时'
                    break

                case 505:
                    err.message = 'HTTP版本不受支持'
                    break

                default:
            }
        }

        return Promise.reject(err)
    }
)

export default axios
