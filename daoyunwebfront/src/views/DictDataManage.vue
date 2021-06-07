<template>
  <div id="DictDataManage" v-if="ifshow">
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
      v-if="ifUpdateTable"
    ></v-table>

    <div>
      <!-- 添加或修改参数配置对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="45%"
        append-to-body
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="reFresh">
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="form.dictType" placeholder="请输入字典类型" :disabled="true"/>
          </el-form-item>
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input v-model="form.dictLabel" placeholder="请输入字典标签"/>
          </el-form-item>
          <el-form-item label="字典键值" prop="dictValue">
            <el-input v-model="form.dictValue" placeholder="请输入字典键值"/>
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
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
//批量操作未做
//若字典无数据时，显示空表未做
import vTable from "../components/CurrTable.vue";
import {
  getDictDataInfoListApi,
  addDictDataInfoApi,
  editDictDataInfoApi,
  deleteDictDataInfoApi
} from "@/api/api";
// import { routerToLogin } from "@/utils/routerGuard";

import Cookies from "js-cookie";

export default {
  name: "DictDataManage",
  components: {
    vTable
  },
  data() {
    return {
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "dictLabel", label: "字典标签" },
        { prop: "dictValue", label: "字典键值" },
        { prop: "dictType", label: "字典类型" },
        { prop: "status", label: "状态" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "字典标签",

      infoUrl: "/system/dictdata?dictType=", //获取列表的URL

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
        dictLabel: [
          { required: true, message: "字典标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "字典键值不能为空", trigger: "blur" }
        ]
      },
      title: "",
      editRow: [],

      ifUpdateTable: true
    };
  },
  created() {
    this.initPage();
    this.initForm();
  },
  methods: {
    getDictDataInfo(dT) {
      //console.log("dd")
      var _this = this;
      getDictDataInfoListApi(dT)
        .then(function(response) {
          console.log(response);
          _this.tableData = response.data;
          //暂时这样写
          for (var i = 0; i < _this.tableData.length; i++) {
            if (_this.tableData[i]["status"] == false) {
              _this.tableData[i]["status"] = "正常";
            } else {
              _this.tableData[i]["status"] = "停用";
            }
          }
          _this.ifshow = true;

          _this.ifUpdateTable = false;
          _this.$nextTick(() => {
            _this.ifUpdateTable = true;
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //点击新增，弹出dialog弹窗
    fatherAddInfo() {
      this.open = true;
      this.title = "新增";
      this.diaLogMode = "add";
      var temp = Cookies.get("DictDataManage");
      var row = {};
      //var dictType = {};

      row = JSON.parse(temp);
      //dictType["dictType"] = row.dictType;
      this.form["dictType"] = row.dictType;
    },
    //将新增的数据传入后台，完成新增
    fatherAddInfoSubmit(formData) {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          addDictDataInfoApi(formData)
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
        }
      });
    },
    //点击修改图标，弹出修改弹窗
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
        // dictCode: row["dictCode"],
        id: row["id"],
        dictType: row["dictType"],
        dictLabel: row["dictLabel"],
        dictValue: row["dictValue"],
        status: tempStatus,
        remark: row["remark"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          editDictDataInfoApi(formData)
            .then(function(response) {
              console.log(formData);
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
      var temp = Cookies.get("DictDataManage");
      var row = {};
      row = JSON.parse(temp);
      this.form = {
        dictType: row.dictType,
        dictLabel: undefined,
        dictValue: undefined,
        status: 0,
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
        dictType: this.editRow["dictType"],
        dictLabel: this.editRow["dictLabel"],
        dictValue: this.editRow["dictValue"],
        status: tempStatus,
        remark: this.editRow["remark"]
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
          // idForAllDel = idForAllDel + formData[i].dictCode;
          idForAllDel = idForAllDel + formData[i].id;
        } else {
          // idForAllDel = idForAllDel + formData[i].dictCode + ", ";
          idForAllDel = idForAllDel + formData[i].id + ", ";
        }
      }
      //console.log(idForAllDel);

      //二次确认删除;
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteDictDataInfoApi(idForAllDel)
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
        // dictCode: undefined,
        id: undefined,
        dictType: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        status: 0,
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
    },
    initPage() {
      var temp = Cookies.get("DictDataManage");
      var row = {};
      var dictType = {};

      row = JSON.parse(temp);
      console.log(row);
      dictType["dictType"] = row.dictType;
      this.infoUrl = "/system/dictdata?dictType=" + row.dictType;
      this.getDictDataInfo(dictType);
    }
  },
  activated() {
    this.initPage();
    this.initForm();

    // var bo = routerToLogin();
    // if (bo) {
    //   this.$router.push({
    //     path: "Login2"
    //   });
    // }

    //console.log("----------activated--------");
  }
};
</script>

<style>
</style>
