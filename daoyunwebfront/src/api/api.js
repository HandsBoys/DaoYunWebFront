import http from '../utils/http'

//登录接口
export function loginApi(params) {
    //console.log("loginApi");
    return http.post(`/login`, params)
}

//注册接口
export function registerApi(params) {
    return http.post(`/sign`, params)
}

//获取sidebar
export function getSideBarApi(userId) {
    return http.get(`/system/menu/list`,userId)
}

//获取用户信息列表
export function getUserInfoListApi() {
    return http.get(`/system/user/list`)
}

// export function loginApi() {
//     console.log("loginApi");
//     return http.get(`/hello`)
// }

