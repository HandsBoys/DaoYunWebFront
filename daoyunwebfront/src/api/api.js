import http from '../utils/http'

//登录接口
export function loginApi(password, userName) {
    return http.postLogin(`/login`, password, userName)
}

//注册接口
export function registerApi(password, userName, code) {
    return http.postRegister(`/sign`, password, userName, code)
}

//获取sidebar
export function getSideBarApi(userId) {
    return http.get(`/system/menu/list`, userId)
}

//获取用户信息列表
export function getUserInfoListApi() {
    return http.get(`/system/user/list`)
}

//获取字典信息列表
export function getDictInfoListApi() {
    return http.get(`/system/dict/type/list`)
}

//获取字典数据信息列表
export function getDictDataInfoListApi(dictType) {
    return http.get(`/system/dict/data/list`, dictType)
}

//获取参数管理信息列表
export function getConfigInfoListApi(x) {
    return http.get(`/system/config/list`)
}

//获得验证码图片
export function getCodeImgApi() {
    return http.getCodeImg(`/captcha.jpg`)
}

// export function loginApi() {
//     console.log("loginApi");
//     return http.get(`/hello`)
// }

