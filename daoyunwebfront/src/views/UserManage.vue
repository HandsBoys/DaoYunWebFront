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
            <el-form-item label="学校" prop="userSchool">
              <el-input v-model="form.userSchool" placeholder="请输入学校"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学/工号" prop="userSchoolNum">
              <el-input v-model="form.userSchoolNum" placeholder="请输入学号/工号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院" prop="userCollege">
              <el-input v-model="form.userCollege" placeholder="请输入学院"/>
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
            <el-form-item label="专业" prop="userMajor">
              <el-input v-model="form.userMajor" placeholder="请输入专业"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
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
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
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
  deleteUserInfoApi
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
        { prop: "role", label: "角色" },
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
        { dictValue: 0, dictLabel: "正常" },
        { dictValue: 1, dictLabel: "停用" }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        userSchoolNum: [
          { required: true, message: "学号/工号不能为空", trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        userSchool: [
          { required: true, message: "学校不能为空", trigger: "blur" }
        ],
        userCollege: [
          { required: true, message: "学院不能为空", trigger: "blur" }
        ],
        userMajor: [
          { required: true, message: "专业不能为空", trigger: "blur" }
        ]
      },
      title: "",
      editRow: [],
      sexOptions: {},
      roleOptions: []
    };
  },
  methods: {
    //从后台获取表格内的信息
    getUserInfo() {
      var _this = this;
      getUserInfoListApi()
        .then(function(response) {
          console.log(response);
          _this.tableData = response.data;
          //暂时这样写
          for (var i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i]["role"] = _this.tableData[i]["role"]["roleName"];
            if (_this.tableData[i]["status"] == false) {
              _this.tableData[i]["status"] = "正常";
            } else {
              _this.tableData[i]["status"] = "停用";
            }
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
        _this.sexOptions = response.data;
      });
    },
    //获取角色下拉选择框
    getRoleOption() {
      var _this = this;
      getRoleInfoListApi().then(function(response) {
        _this.roleOptions = response.data;
        console.log(response)
      });
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

      addUserInfoApi(formData)
        .then(function(response) {
          console.log(response);
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
    },
    //点击修改按钮，弹出修改弹窗
    fatherEditInfo(row) {
      this.open = true;
      this.editRow = row;
      this.title = "修改";
      this.diaLogMode = "edit";

      var tempStatus = 0;
      //暂时这样写
      if (row["status"] == "正常") {
        tempStatus = 0;
      } else {
        tempStatus = 1;
      }

      this.form = {
        // dictId: row["dictId"],
        id: row["id"],
        dictName: row["dictName"],
        dictType: row["dictType"],
        status: tempStatus,
        remark: row["remark"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      editUserInfoApi(formData)
        .then(function(response) {
          //console.log(response);
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
    },
    //重置新增表单
    fatherResetAddForm() {
      this.form = {
        id: undefined,
        userName: undefined,
        userSchool: undefined,
        userSchoolNum: undefined,
        userCollege: undefined,
        email: undefined,
        userMajor: undefined,
        sex: undefined,
        status: 0,
        phone: undefined,
        roleIds: undefined,
        remark: undefined
      };
    },
    //重置修改表单
    fatherResetEditForm() {
      var tempStatus = 0;
      if (this.editRow["status"] == "正常") {
        tempStatus = 0;
      } else {
        tempStatus = 1;
      }
      this.form = {
        id: this.editRow["id"],
        dictName: this.editRow["dictName"],
        dictType: this.editRow["dictType"],
        status: tempStatus,
        remark: this.editRow["remark"]
      };
    },
    //关闭新增和修改弹窗
    handleClose() {
      //console.log("handleClose()");
      this.open = false;
      this.initForm();
    },
    //删除和批量删除函数
    fatherDeleteInfo(formData) {
      //console.log("fatherDeleteInfo");
      //console.log(formData);
      var idForAllDel = "";
      for (let i = 0; i < formData.length; i++) {
        // idForAllDel[i] = formData[i].dictId;
        if (i == formData.length - 1) {
          // idForAllDel = idForAllDel + formData[i].dictId;
          idForAllDel = idForAllDel + formData[i].id;
        } else {
          // idForAllDel = idForAllDel + formData[i].dictId + ", ";
          idForAllDel = idForAllDel + formData[i].id + ", ";
        }
      }
      console.log(idForAllDel);

      //二次确认删除;
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteUserInfoApi(idForAllDel)
            .then(function(response) {
              console.log(response);
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
        userSchool: undefined,
        userSchoolNum: undefined,
        userCollege: undefined,
        email: undefined,
        userMajor: undefined,
        sex: undefined,
        status: 0,
        phone: undefined,
        roleIds: undefined,
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
