import http from '../utils/http'

//登录接口
export function loginApi(password, userName, code) {
    return http.postLogin(`/login`, password, userName, code)
}
export function login2Api(code, phone) {
    return http.postLogin2(`/login/sms`, code, phone)
}

//注册接口
export function registerApi(password, phone, code, userName) {
    return http.postRegister(`/sign`, password, phone, code, userName)
}

//获取sidebar
export function getSideBarApi(userId) {
    return http.get(`/system/menu`, userId)
}
//用户管理
//获取用户信息列表
export function getUserInfoListApi() {
    return http.get(`/system/user`)
}
//新增用户信息
export function addUserInfoApi(data) {
    //console.log(data)
    return http.put(`/system/dicttype`, data)
}

//修改用户信息
export function editUserInfoApi(data) {
    //console.log(data)
    return http.post(`/system/dicttype`, data)
}

//删除用户信息
export function deleteUserInfoApi(UserId) {
    //console.log(data)
    return http.delete(`/system/dicttype/` + UserId)
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

//判斷DictValue是否重複
export function ifDictValueRepeat(dictType,dictValue) {
    return http.get(`/system/dictdata/query-dict-value?dictType=`+ dictType + `&dictValue=`+ dictValue)
}

//获取参数管理信息列表
export function getConfigInfoListApi() {
    return http.get(`/system/config`)
}
//新增参数信息
export function addConfigInfoApi(data) {
    //console.log(data)
    return http.put(`/system/config`, data)
}
//修改参数信息
export function editConfigInfoApi(data) {
    //console.log(data)
    return http.post(`/system/config`, data)
}
//判斷ConfigKey是否重複
export function ifConfigKeyRepeat(configKey) {
    return http.get(`/system/config/query-config-key?configKey=`+ configKey)
}

//删除角色信息
export function deletetConfigInfoApi(ConfigId) {
    //console.log(data)
    return http.delete(`/system/config/` + ConfigId)
}

//获得验证码图片
export function getCodeImgApi() {
    return http.getCodeImg(`/captcha.jpg`)
}
//获取短信验证码
export function getMessCodeApi(phone) {
    return http.getMessCode(`/message?phone=`+ phone)
}

//获取角色信息列表
export function getRoleInfoListApi() {
    return http.get(`/system/role`)
}

//新增角色信息
export function addRoleInfoApi(data) {
    //console.log(data)
    return http.put(`/system/role`, data)
}

//修改角色信息
export function editRoleInfoApi(data) {
    //console.log(data)
    return http.post(`/system/role`, data)
}

//删除角色信息
export function deleteRoleInfoApi(roleId) {
    //console.log(data)
    return http.delete(`/system/role/` + roleId)
}

//获取所有菜单列表，用于角色的新增和修改分配权限
export function getAllMenuForRoleApi() {
    return http.get(`/system/menu/listall`)
}


