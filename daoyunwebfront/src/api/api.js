import http from '../utils/http'

//登录接口
export function loginApi(password, userName, code) {
    return http.postLogin(`/login`, password, userName, code)
}
export function login2Api(code, phone) {
    return http.postLogin2(`/login2`, code, phone)
}

//注册接口
export function registerApi(password, phone, code, userName) {
    return http.postRegister(`/sign`, password, phone, code, userName)
}

//获取sidebar
export function getSideBarApi(userId) {
    return http.get(`/system/menu`, userId)
}

//获取用户信息列表
export function getUserInfoListApi() {
    return http.get(`/system/user/list`)
}
//字典类型
//获取字典类型信息列表
export function getDictInfoListApi() {
    return http.get(`/system/dicttype`)
}

//新增字典类型信息
export function addDictInfoApi(data) {
    //console.log(data)
    return http.put(`/system/dicttype`, data)
}

//修改字典类型信息
export function editDictInfoApi(data) {
    //console.log(data)
    return http.post(`/system/dicttype`, data)
}

//删除字典类型信息
export function deleteDictInfoApi(DictId) {
    //console.log(data)
    return http.delete(`/system/dicttype/` + DictId)
}
//字典数据
//获取字典数据信息列表
export function getDictDataInfoListApi(dictType) {
    return http.get(`/system/dictdata`, dictType)
}

//新增字典数据信息
export function addDictDataInfoApi(data) {
    //console.log(data)
    return http.put(`/system/dictdata`, data)
}

//修改字典数据信息
export function editDictDataInfoApi(data) {
    //console.log(data)
    return http.post(`/system/dictdata`, data)
}

//删除字典数据信息
export function deleteDictDataInfoApi(DictCode) {
    //console.log(data)
    return http.delete(`/system/dictdata/` + DictCode)
}

//获取参数管理信息列表
export function getConfigInfoListApi() {
    return http.get(`/system/config`)
}

//获得验证码图片
export function getCodeImgApi() {
    return http.getCodeImg(`/captcha.jpg`)
}
//获取短信验证码
export function getMessCodeApi(phone) {
    return http.get(`/message?phone=`+ phone)
}
// export function loginApi() {
//     console.log("loginApi");
//     return http.get(`/hello`)
// }

