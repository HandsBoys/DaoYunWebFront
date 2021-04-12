/****   http.js   ****/
// 导入封装好的axios实例
import request from './request'

const http ={
    /**
     * methods: 请求
     * @param url 请求地址 
     * @param params 请求参数
     */
    get(url,params){
        const config = {
            method: 'get',
            url:url
        }
        if(params) config.params = params
        return request(config)
    },
    //获取验证码图片
    getCodeImg(url,params){
        const config = {
            method: 'get',
            url:url,
            responseType: 'arraybuffer' // 最为关键
        }
        if(params) config.params = params
        return request(config)
    },
    post(url,params){
        const config = {
            method: 'post',
            url:url
        }
        // let data = "username=13010101010&password=Aa%40123"
        console.log("http.js post params=" + params);
        if(params) config.data = params;
        console.log("http.js post config.data=" + config.data);
        return request(config)
    },
    //登录
    postLogin(url,password, userName){
        const data = {
            password,
            userName
        }
        //console.log(data)
        const config = {
            method: 'post',
            url:url,
            data:data
        }
        return request(config)
    },
    //注册
    postRegister(url,password, userName,code){
        const data = {
            password,
            userName,
            code
        }
        const config = {
            method: 'post',
            url:url,
            data:data
        }
        return request(config)
    },
    put(url,params){
        const config = {
            method: 'put',
            url:url
        }
        if(params) config.params = params
        return request(config)
    },
    delete(url,params){
        const config = {
            method: 'delete',
            url:url
        }
        if(params) config.params = params
        return request(config)
    }
}
//导出
export default http
