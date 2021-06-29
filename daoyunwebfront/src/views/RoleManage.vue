<template>
  <div id="RoleManage" v-if="ifshow">
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

    <div>
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="45%"
        append-to-body
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="reFresh">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名称"/>
          </el-form-item>
          <el-form-item label="权限字符" prop="roleKey">
            <el-input v-model="form.roleKey" placeholder="请输入权限字符" :disabled="ifCanInputRoleKey"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>

            <el-tree
              class="tree-border"
              :data="menuOptions"
              :default-checked-keys="menuIds"
              show-checkbox
              ref="menu"
              node-key="id"
              empty-text="加载中，请稍后"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
import {
  getRoleInfoListApi,
  addRoleInfoApi,
  editRoleInfoApi,
  deleteRoleInfoApi,
  getAllMenuForRoleApi
} from "@/api/api";

import Cookies from "js-cookie";

export default {
  name: "RoleManage",
  components: {
    vTable
  },
  created() {
    this.getROleInfo();
    this.initForm();
    this.getMenuList();
  },
  data() {
    return {
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "roleName", label: "角色名称" },
        { prop: "roleKey", label: "权限字符" },
        { prop: "status", label: "状态" }
        // { prop: "createTime", label: "创建时间" }
      ],
      searchLabel: "角色名称",

      formContent: {
        id: undefined,
        roleName: undefined,
        roleKey: undefined,
        status: 0,
        createTime: undefined,
        menuIds: [],
        roleSort: 0
      },

      infoUrl: "/system/role", //获取列表的URL

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
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ]
      },
      title: "",
      editRow: [],
      ifCanInputRoleKey: false,

      defaultProps: {
        children: "children",
        label: "label"
      },
      menuOptions: [],
      menuExpand: false,
      menuNodeAll: false,
      menuIds: []
    };
  },
  methods: {
    //从后台获取表格内的信息
    getROleInfo() {
      var _this = this;
      getRoleInfoListApi()
        .then(function(response) {
          // console.log(response);
          _this.tableData = response.data.data;

          for (var i = 0; i < _this.tableData.length; i++) {
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
    //从后台获取菜单列表，用于新增和修改
    getMenuList() {
      var _this = this;
      getAllMenuForRoleApi()
        .then(function(response) {
          //console.log(response);
          var temp = response.data.data;
          for (var i = 0; i < temp.length; i++) {
            var ob1 = new Object();
            _this.menuOptions[i] = ob1;
            ob1.id = temp[i].id;
            ob1.label = temp[i].menuName;
            //第一个树结点“系统首页”不让选择，设为禁用
            if (i == 0) {
              ob1.disabled = true;
            }

            var temp2 = temp[i].children;

            if (temp2.length != 0) {
              ob1.children = [];
              for (var j = 0; j < temp2.length; j++) {
                var ob2 = new Object();
                ob1.children[j] = ob2;
                ob2.id = temp2[j].id;
                ob2.label = temp2[j].menuName;
                var temp3 = temp2[j].children;
                if (temp3.length != 0) {
                  ob2.children = [];
                  for (var k = 0; k < temp3.length; k++) {
                    var ob3 = new Object();
                    ob2.children[k] = ob3;
                    ob3.id = temp3[k].id;
                    ob3.label = temp3[k].menuName;
                  }
                }
              }
            }
          }
          // console.log(_this.menuOptions);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      let treeList = this.menuOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
    },
    //点击新增，弹出dialog弹窗
    fatherAddInfo() {
      this.open = true;
      this.title = "新增";
      this.diaLogMode = "add";
      this.ifCanInputRoleKey = false;
      this.menuIds[0] = 1;
    },
    //将新增的数据传入后台，完成新增
    fatherAddInfoSubmit(formData) {
      var _this = this;
      formData.menuIds = this.$refs.menu.getCheckedKeys();

      formData["roleKey"] = "ROLE_" + formData["roleKey"] 
            // console.log(formData)
      addRoleInfoApi(formData)
        .then(function(response) {
          //console.log(response);
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
      this.ifCanInputRoleKey = true;

      var tempStatus = 0;
      //暂时这样写
      if (row["status"] == "正常") {
        tempStatus = 0;
      } else {
        tempStatus = 1;
      }

      this.menuIds = row.menuIds;

      this.form = {
        id: row["id"],
        roleName: row["roleName"],
        roleKey: row["roleKey"],
        status: tempStatus,
        createTime: row["createTime"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          formData.menuIds = this.$refs.menu.getCheckedKeys();
          editRoleInfoApi(formData)
            .then(function(response) {
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
      this.form = {
        id: undefined,
        roleName: undefined,
        roleKey: undefined,
        status: 0,
        createTime: undefined
      };
      this.menuExpand = false;
      this.menuNodeAll = false;
      this.handleCheckedTreeExpand(this.menuExpand);
      this.handleCheckedTreeNodeAll(this.menuNodeAll);
    },
    //重置修改表单
    fatherResetEditForm() {
      var tempStatus = 0;
      if (this.editRow["status"] == "正常") {
        tempStatus = 0;
      } else {
        tempStatus = 1;
      }

      this.$refs.menu.setCheckedKeys(this.menuIds);

      this.form = {
        id: this.editRow["id"],
        roleName: this.editRow["roleName"],
        roleKey: this.editRow["roleKey"],
        status: tempStatus,
        createTime: this.editRow["createTime"]
      };
    },
    //关闭新增和修改弹窗
    handleClose() {
      this.open = false;
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
          deleteRoleInfoApi(idForAllDel)
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
        roleName: undefined,
        roleKey: undefined,
        status: 0,
        createTime: undefined,
        menuIds: [],
        roleSort: 0
      };
      this.menuExpand = false;
      this.menuNodeAll = false;
      this.menuIds = [];
      this.menuIds[0] = 1;

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
