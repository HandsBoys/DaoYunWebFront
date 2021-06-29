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

//新增菜单信息
export function addMenuInfoApi(data) {
    //console.log(data)
    return http.put(`/system/menu`, data)
}

//修改菜单信息
export function editMenuInfoApi(data) {
    //console.log(data)
    return http.post(`/system/menu`, data)
}

//删除用户信息
export function deleteMenuInfoApi(MenuId) {
    //console.log(data)
    return http.delete(`/system/menu/` + MenuId)
}

//用户管理
//获取用户信息列表
export function getUserInfoListApi() {
    return http.get(`/system/user`)
}
//新增用户信息
export function addUserInfoApi(data) {
    // console.log(data)
    return http.put(`/system/user`, data)
}

//修改用户信息
export function editUserInfoApi(data) {
    //console.log(data)
    return http.post(`/system/user`, data)
}

//删除用户信息
export function deleteUserInfoApi(UserId) {
    //console.log(data)
    return http.delete(`/system/user/` + UserId)
}
//获取新增用户用的学校，学院、专业列表
export function getDeptInfoListForUserApi(parentId) {
    return http.get(`/system/dept/next-dept?parentId=`+ parentId);
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

//获取班课信息列表
export function getCourseInfoListApi() {
    return http.get(`/system/course`)
}
//新增班课
export function addCourseInfoApi(data) {
    //console.log(data)
    return http.put(`/system/course`, data)
}
//修改班课
export function editCourseInfoApi(data) {
    //console.log(data)
    return http.post(`/system/course`, data)
}
//删除班课
export function deleteCourseInfoApi(courseId) {
    //console.log(data)
    return http.delete(`/system/course/` + courseId)
}

//机构管理
//获取机构信息列表
export function getInstitutionInfoListApi() {
    return http.get(`/system/dept`)
}
//新增机构
export function addInstitutionInfoApi(data) {
    //console.log(data)
    return http.put(`/system/dept`, data)
}
//修改机构
export function editInstitutionInfoApi(data) {
    //console.log(data)
    return http.post(`/system/dept`, data)
}
//删除机构
export function deleteInstitutionInfoApi(InstId) {
    //console.log(data)
    return http.delete(`/system/dept/` + InstId)
}

//班课学生
//获取班课学生信息列表
export function getCourseStudentInfoListApi(courseId) {
    return http.get(`/system/course/student?courseId=` + courseId)
}

//新增班课学生信息
export function addCourseStudentInfoApi(data) {
    //console.log(data)
    return http.put(`/system/course/student?courseId=` + data.courseId + `&studentId=` + data.studentId)
}

//修改班课学生信息
export function editCourseStudentInfoApi(data) {
    //console.log(data)
    return http.post(`/system/course/student?courseId=` + data.courseId + `&studentId=` + data.studentId + `&score=` + data.score)
}

//删除班课学生信息
export function deleteCourseStudentInfoApi(courseId, studentIds) {
    //console.log(data)
    return http.delete(`/system/course/student/` + courseId + `/` + studentIds)
}