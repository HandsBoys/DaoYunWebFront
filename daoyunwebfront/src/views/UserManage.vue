<template>
  <div id="UserManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :infoUrl="infoUrl"
      :ifShow="false"
      :ifEdit="true"
      :ifDelete="true"
      rKey="id"
      :ifTwoBtn="true"
    ></v-table>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="45%"
      append-to-body
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校" prop="university">
              <el-select
                v-model="form.university"
                placeholder="请选择"
                @change="getCollegeOption"
                clearable
              >
                <el-option
                  v-for="uni in universityOptions"
                  :key="uni.id"
                  :label="uni.deptName"
                  :value="uni.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学/工号" prop="identityNumber">
              <el-input v-model="form.identityNumber" placeholder="请输入学号/工号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院" prop="college">
              <!-- <el-input v-model="form.college" placeholder="请输入学院"/> -->
              <el-select
                v-model="form.college"
                placeholder="请选择"
                @change="getSubjectOption"
                clearable
              >
                <el-option
                  v-for="col in collegeOptions"
                  :key="col.id"
                  :label="col.deptName"
                  :value="col.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="subject">
              <!-- <el-input v-model="form.subject" placeholder="请输入专业"/> -->
              <el-select v-model="form.subject" placeholder="请选择" clearable>
                <el-option
                  v-for="sub in subjectOptions"
                  :key="sub.id"
                  :label="sub.deptName"
                  :value="sub.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roles">
              <el-select v-model="form.roles" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="resetForm">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
import {
  getUserInfoListApi,
  getDictDataInfoListApi,
  getRoleInfoListApi,
  addUserInfoApi,
  editUserInfoApi,
  deleteUserInfoApi,
  getDeptInfoListForUserApi
} from "@/api/api";
// import { routerToLogin } from "@/utils/routerGuard";
import Cookies from "js-cookie";

export default {
  name: "UserManage",
  components: {
    vTable
  },
  created() {
    this.getUserInfo();
    this.getSexOptions();
    this.getRoleOption();
    this.initForm();
    this.getUniversityOption();
  },
  data() {
    var emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (!emailReg.test(value)) {
          callback(new Error("邮箱格式不正确，请重新输入"));
        } else {
          callback();
        }
      }, 1000);
    };
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      setTimeout(() => {
        if (!phoneReg.test(value)) {
          callback(new Error("手机号格式不正确，请重新输入"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "userName", label: "用户名称" },
        { prop: "sex", label: "性别" },
        { prop: "roles", label: "角色" },
        { prop: "status", label: "状态" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "用户名称",

      infoUrl: "/system/user", //获取列表的URL

      open: false,
      reFresh: true,
      diaLogMode: "",
      statusOptions: [
        //从数据字典中获取，暂时写死
        { dictValue: false, dictLabel: "正常" },
        { dictValue: true, dictLabel: "停用" }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        // identityNumber: [
        //   { required: true, message: "学号/工号不能为空", trigger: "blur" }
        // ],
        // email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        // university: [
        //   { required: true, message: "学校不能为空", trigger: "blur" }
        // ],
        // college: [{ required: true, message: "学院不能为空", trigger: "blur" }],
        // subject: [{ required: true, message: "专业不能为空", trigger: "blur" }],
        roles: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      },
      title: "",
      editRow: [],
      sexOptions: {},
      roleOptions: [],
      universityOptions: [],
      collegeOptions: [],
      subjectOptions: []
    };
  },
  methods: {
    //从后台获取表格内的信息
    getUserInfo() {
      var _this = this;
      getUserInfoListApi()
        .then(function(response) {
          // console.log(response);
          _this.tableData = response.data.data;
          //暂时这样写
          for (var i = 0; i < _this.tableData.length; i++) {
            if (_this.tableData[i]["sex"] == 0) {
              _this.tableData[i]["sex"] = "男";
            } else if (_this.tableData[i]["sex"] == 1) {
              _this.tableData[i]["sex"] = "女";
            } else {
              _this.tableData[i]["sex"] = "未知";
            }
            _this.tableData[i]["status"] = _this.tableData[i]["status"]
              ? "停用"
              : "正常";
            var role = "";
            for (var j = 0; j < _this.tableData[i]["roles"].length; j++) {
              role = _this.tableData[i]["roles"][j]["roleName"] + " " + role;
            }
            _this.tableData[i]["roles"] = role;
          }
          _this.ifshow = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //获取性别下拉选择框
    getSexOptions() {
      var _this = this;
      var dictType = {};
      dictType["dictType"] = "sys_user_sex";
      getDictDataInfoListApi(dictType).then(function(response) {
        _this.sexOptions = response.data.data;
      });
    },
    //获取角色下拉选择框
    getRoleOption() {
      var _this = this;
      getRoleInfoListApi().then(function(response) {
        _this.roleOptions = response.data.data;
        // console.log(response);
      });
    },
    //获取学校下拉选择框
    getUniversityOption(parentId) {
      var _this = this;
      parentId = parentId || 0;
      getDeptInfoListForUserApi(parentId).then(function(response) {
        _this.universityOptions = response.data.data;
        // console.log(_this.universityOptions);
      });
    },
    //获取学院下拉选择框
    getCollegeOption(parentId) {
      var _this = this;
      this.form["college"] = undefined;
      this.form["subject"] = undefined;
      this.collegeOptions = [];
      this.subjectOptions = [];
      if (parentId != undefined) {
        getDeptInfoListForUserApi(parentId).then(function(response) {
          _this.collegeOptions = response.data.data;
        });
      }
    },
    //获取专业下拉选择框
    getSubjectOption(parentId) {
      var _this = this;
      this.form["subject"] = undefined;
      this.subjectOptions = [];
      if (parentId != undefined) {
        getDeptInfoListForUserApi(parentId).then(function(response) {
          _this.subjectOptions = response.data.data;
        });
      }
    },
    //点击新增，弹出dialog弹窗
    fatherAddInfo() {
      this.open = true;
      this.title = "新增";
      this.diaLogMode = "add";
    },
    //将新增的数据传入后台，完成新增
    fatherAddInfoSubmit(formData) {
      var _this = this;

      this.$refs.form.validate(valid => {
        if (valid) {
          var tempform = new Object();
          tempform.userName = formData["userName"];
          tempform.nickName = formData["userName"];

          var university =
            formData["university"] == undefined
              ? null
              : { id: formData["university"] };
          tempform.university = university;
          var college =
            formData["college"] == undefined
              ? null
              : { id: formData["college"] };
          tempform.college = college;
          var subject =
            formData["subject"] == undefined
              ? null
              : { id: formData["subject"] };
          tempform.subject = subject;
          tempform.roles = [];
          for (var i = 0; i < formData["roles"].length; i++) {
            var role = { id: formData["roles"][i] };
            tempform["roles"][i] = role;
          }
          tempform.email = formData["email"];
          tempform.identityNumber = formData["identityNumber"];
          tempform.sex = formData["sex"];
          tempform.phone = formData["phone"];
          tempform.remark = formData["remark"];
          tempform.status = formData["status"];

          addUserInfoApi(tempform)
            .then(function(response) {
              // console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("新增成功");
                _this.handleClose();
                //通过全局变量刷新表格数据
                var bo = _this.$store.state.ifDictSuccess;
                if (bo == true) {
                  bo = false;
                } else {
                  bo = true;
                }
                _this.$store.state.ifDictSuccess = bo;
              } else {
                _this.$message.error("新增失败");
              }
            })
            .catch(function(error) {
              _this.$message.error("新增失败");
              console.log(error);
            });
        }
      });
    },
    //点击修改按钮，弹出修改弹窗
    fatherEditInfo(row) {
      this.open = true;
      this.editRow = row;
      this.title = "修改";
      this.diaLogMode = "edit";
      // console.log(row);

      var tempStatus = row["status"] == "正常" ? false : true;
      var arr = row["roles"].split(" ");
      var tempRoles = [];
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < this.roleOptions.length; j++) {
          if (arr[i] == this.roleOptions[j]["roleName"]) {
            tempRoles.push(this.roleOptions[j]["id"]);
            break;
          }
        }
      }
      var tempSex = 0;
      if (row["sex"] == "女") {
        tempSex = 1;
      } else if (row["sex"] == "男") {
        tempSex = 0;
      } else {
        tempSex = 2;
      }
      if (row["university"] != null) {
        var tempUniversity = row["university"]["id"];
        this.getCollegeOption(tempUniversity);
      }
      if (row["college"] != null) {
        var tempCollege = row["college"]["id"];
        this.getSubjectOption(tempCollege);
      }
      if (row["subject"] != null) {
        var tempSubject = row["subject"]["id"];
      }

      this.form = {
        id: row["id"],
        userName: row["userName"],
        nickName: row["nickName"],
        university: tempUniversity,
        identityNumber: row["identityNumber"],
        college: tempCollege,
        email: row["email"],
        subject: tempSubject,
        sex: tempSex,
        status: tempStatus,
        phone: row["phone"],
        roles: tempRoles,
        remark: row["remark"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      console.log(formData);
      this.$refs.form.validate(valid => {
        if (valid) {
          var tempform = new Object();
          tempform.userName = formData["userName"];
          tempform.nickName = formData["userName"];
          var university = { id: formData["university"] };
          tempform.university =
            formData["university"] == undefined ? null : university;
          var college = { id: formData["college"] };
          tempform.college = formData["college"] == undefined ? null : college;
          var subject = { id: formData["subject"] };
          tempform.subject = formData["subject"] == undefined ? null : subject;
          tempform.roles = [];
          for (var i = 0; i < formData["roles"].length; i++) {
            var role = { id: formData["roles"][i] };
            tempform["roles"][i] = role;
          }
          tempform.email = formData["email"];
          tempform.identityNumber = formData["identityNumber"];
          tempform.sex = formData["sex"];
          tempform.phone = formData["phone"];
          tempform.remark = formData["remark"];
          tempform.status = formData["status"];
          tempform.id = formData["id"];

          editUserInfoApi(tempform)
            .then(function(response) {
              // console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("修改成功");
                _this.handleClose();
                //通过全局变量刷新表格数据
                var bo = _this.$store.state.ifDictSuccess;
                if (bo == true) {
                  bo = false;
                } else {
                  bo = true;
                }
                _this.$store.state.ifDictSuccess = bo;
              } else {
                _this.$message.error("修改失败");
              }
            })
            .catch(function(error) {
              _this.$message.error("修改失败");
              console.log(error);
            });
        }
      });
    },
    //重置新增表单
    fatherResetAddForm() {
      this.initForm();
    },
    //重置修改表单
    fatherResetEditForm() {
      var tempStatus = this.editRow["status"] == "正常" ? false : true;
      var arr = this.editRow["roles"].split(" ");
      var tempRoles = [];
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < this.roleOptions.length; j++) {
          if (arr[i] == this.roleOptions[j]["roleName"]) {
            tempRoles.push(this.roleOptions[j]["id"]);
            break;
          }
        }
      }
      var tempSex = 0;
      if (this.editRow["sex"] == "女") {
        tempSex = 1;
      } else if (this.editRow["sex"] == "男") {
        tempSex = 0;
      } else {
        tempSex = 2;
      }

      if (this.editRow["university"] != null) {
        var tempUniversity = this.editRow["university"]["id"];
      }
      if (this.editRow["university"] != null) {
        var tempCollege = this.editRow["college"]["id"];
      }
      if (this.editRow["university"] != null) {
        var tempSubject = this.editRow["subject"]["id"];
      }

      this.form = {
        id: this.editRow["id"],
        userName: this.editRow["userName"],
        nickName: this.editRow["nickName"],
        university: tempUniversity,
        identityNumber: this.editRow["identityNumber"],
        college: tempCollege,
        email: this.editRow["email"],
        subject: tempSubject,
        sex: tempSex,
        status: tempStatus,
        phone: this.editRow["phone"],
        roles: tempRoles,
        remark: this.editRow["remark"]
      };
    },
    //关闭新增和修改弹窗
    handleClose() {
      this.open = false;
      this.collegeOptions = [];
      this.subjectOptions = [];
      this.initForm();
    },
    //删除和批量删除函数
    fatherDeleteInfo(formData) {
      var idForAllDel = "";
      for (let i = 0; i < formData.length; i++) {
        if (i == formData.length - 1) {
          idForAllDel = idForAllDel + formData[i].id;
        } else {
          idForAllDel = idForAllDel + formData[i].id + ", ";
        }
      }
      // console.log(idForAllDel);

      //二次确认删除;
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteUserInfoApi(idForAllDel)
            .then(function(response) {
              // console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("删除成功");
                //通过全局变量刷新表格数据
                var bo = _this.$store.state.ifDictSuccess;
                if (bo == true) {
                  bo = false;
                } else {
                  bo = true;
                }
                _this.$store.state.ifDictSuccess = bo;
              } else {
                _this.$message.error("删除失败");
              }
            })
            .catch(function(error) {
              _this.$message.error("删除失败");
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //初始化表单
    initForm() {
      this.form = {
        id: undefined,
        userName: undefined,
        nickName: undefined,
        university: undefined,
        identityNumber: undefined,
        college: undefined,
        email: undefined,
        subject: undefined,
        sex: undefined,
        status: false,
        phone: undefined,
        roles: undefined,
        remark: undefined
      };
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
      });
    },
    submitForm() {
      if (this.diaLogMode == "add") {
        this.fatherAddInfoSubmit(this.form);
      } else if (this.diaLogMode == "edit") {
        this.fatherEditInfoSubmit(this.form);
      }
    },
    resetForm() {
      if (this.diaLogMode == "add") {
        this.fatherResetAddForm();
      } else if (this.diaLogMode == "edit") {
        this.fatherResetEditForm();
      }
    }
  }
};
</script>

<style>
</style>
