<template>
  <div id="DictManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :infoUrl="infoUrl"
      :ifShow="true"
      :ifEdit="true"
      :ifDelete="true"
      rKey="id"
      :ifTwoBtn="true"
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
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="form.dictName" placeholder="请输入字典名称"/>
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="form.dictType" placeholder="请输入字典类型"/>
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

    <!-- 新建弹出框 -->
    <!-- <el-dialog title="新增" :visible.sync="addVisible" width="30%" :before-close="handleClose">
      <v-form :fContent="formContent" :fRules="formRules" mType="add"></v-form>
    </el-dialog>-->

    <!-- 修改弹出框 -->
    <!-- <el-dialog title="修改" :visible.sync="editVisible" width="30%" :before-close="handleClose">
      <v-form :fContent="formContent" :fRules="formRules" mType="edit"></v-form>
    </el-dialog>-->
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
import {
  getDictInfoListApi,
  addDictInfoApi,
  editDictInfoApi,
  deleteDictInfoApi
} from "@/api/api";
import { routerToLogin } from "@/utils/routerGuard";
import Cookies from "js-cookie";

export default {
  name: "DictManage",
  components: {
    vTable
  },
  created() {
    this.getDictInfo();
    this.initForm();
    var bo = routerToLogin();
    if (bo) {
      this.$router.push({
        path: "Login2"
      });
    }
  },
  data() {
    return {
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "dictName", label: "字典名称" },
        { prop: "dictType", label: "字典类型" },
        { prop: "status", label: "状态" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "字典名称",

      formContent: {
        // dictId: undefined,
        id: undefined,
        dictName: undefined,
        dictType: undefined,
        status: 0,
        remark: undefined
      },

      infoUrl: "/system/dicttype", //获取列表的URL
      detailMesUrl: "DictDataManage", //查看信息URL

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
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      title: "",
      editRow: []
    };
  },
  methods: {
    //从后台获取表格内的信息
    getDictInfo() {
      var _this = this;
      getDictInfoListApi()
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
    },
    //将新增的数据传入后台，完成新增
    fatherAddInfoSubmit(formData) {
      var _this = this;

      addDictInfoApi(formData)
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

      //暂时这样写
      if (row["status"] == "正常") {
        row["status"] = 0;
      } else {
        row["status"] = 1;
      }

      this.form = {
        // dictId: row["dictId"],
        id: row["id"],
        dictName: row["dictName"],
        dictType: row["dictType"],
        status: row["status"],
        remark: row["remark"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      editDictInfoApi(formData)
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
      //console.log("fatherResetAddForm");
      this.form = {
        // dictId: undefined,
        id: undefined,
        dictName: undefined,
        dictType: undefined,
        status: 0,
        remark: undefined
      };
    },
    //重置修改表单
    fatherResetEditForm() {
      this.form = {
        // dictId: this.editRow["dictId"],
        id: this.editRow["id"],
        dictName: this.editRow["dictName"],
        dictType: this.editRow["dictType"],
        status: this.editRow["status"],
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
          deleteDictInfoApi(idForAllDel)
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
    //点击查看信息按钮触发
    fatherShowMes(row) {
      //路由跳转，将row传递到查看信息界面
      // var bo = this.$store.state.updatePage;
      // if (bo == true) {
      //   bo = false;
      // } else {
      //   bo = true;
      // }
      // this.$store.state.updatePage = bo;

      Cookies.set(this.detailMesUrl, row, {
        expires: 30
      });
      this.$router.push({
        path: this.detailMesUrl
      });
    },
    //初始化表单
    initForm() {
      this.form = {
        // dictId: undefined,
        id: undefined,
        dictName: undefined,
        dictType: undefined,
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
    }
  }
};
</script>

<style>
</style>
