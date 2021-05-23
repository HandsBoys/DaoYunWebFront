/****   http.js   ****/
// 导入封装好的axios实例
import request from './request'


const http = {
    /**
     * methods: 请求
     * @param url 请求地址 
     * @param params 请求参数
     */
    get(url, params) {
        const config = {
            method: 'get',
            url: url
        }
        if (params) config.params = params
        return request(config)
    },
    post(url, params) {
        const config = {
            method: 'post',
            url: url,
            data: params
        }
        return request(config)
    },
    put(url, params) {
        //console.log(params)
        //console.log(url)
        const config = {
            method: 'put',
            url: url,
            data: params
        }
        // if(params) config.params = params
        return request(config)
    },
    delete(url) {
        const config = {
            method: 'delete',
            url: url
        }
        //if(params) config.params = params
        return request(config)
    },
    //获取验证码图片
    getCodeImg(url, params) {
        //console.log(url)
        const config = {
            method: 'post',
            url: url,
            responseType: 'arraybuffer' // 最为关键
        }
        if (params) config.params = params
        return request(config)
    },
    //获取短信验证码
    getMessCode(url, params) {
        const config = {
            method: 'post',
            url: url,
        }
        if (params) config.params = params
        return request(config)
    },
    //登录
    postLogin(url, password, userName, code) {
        const data = {
            password,
            userName,
            code
        }
        //console.log(data)
        const config = {
            method: 'post',
            url: url,
            data: data
        }
        return request(config)
    },
    //短信登录
    postLogin2(url, code, phone) {
        const data = {
            code,
            phone
        }
        //console.log(data)
        const config = {
            method: 'post',
            url: url,
            data: data
        }
        return request(config)
    },
    //注册
    postRegister(url, password, phone, code, userName) {
        const data = {
            password,
            phone,
            userName,
            code
        }
        const config = {
            method: 'post',
            url: url,
            data: data
        }
        return request(config)
    },
}
//导出
export default http
