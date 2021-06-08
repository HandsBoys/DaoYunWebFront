<template>
  <div id="ParameterManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :infoUrl="infoUrl"
      :ifShow="false"
      :ifEdit="true"
      :ifDelete="true"
      :ifTwoBtn="true"
      rKey="id"
    ></v-table>

    <div>
      <!-- 添加或修改参数配置对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="30%"
        append-to-body
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="reFresh">
          <el-form-item label="参数名称" prop="configName">
            <el-input v-model="form.configName" placeholder="请输入参数名称"/>
          </el-form-item>
          <el-form-item label="参数键名" prop="configKey">
            <el-input v-model="form.configKey" placeholder="请输入参数键名"/>
          </el-form-item>
          <el-form-item label="参数键值" prop="configValue">
            <el-input v-model="form.configValue" placeholder="请输入参数键值"/>
            <!-- <el-color-picker v-model="form.configValue"></el-color-picker> -->
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
import vTable from "../components/CurrTable.vue";
import {
  getConfigInfoListApi,
  addConfigInfoApi,
  editConfigInfoApi,
  deletetConfigInfoApi,
  ifConfigKeyRepeat
} from "@/api/api";
export default {
  name: "ParameterManage",
  components: {
    vTable
  },
  created() {
    this.getConfigInfo();
    this.initForm();
  },
  data() {
    var validateConfigKey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("参数键名不能为空"));
      } else {
        //绑定接口
        var _this = this;
        ifConfigKeyRepeat(this.form.configKey).then(function(response) {
          if (response.data == false) {
            return callback(new Error("参数键名重复"));
          } else {
            callback();
          }
        });
      }
    };

    return {
      ifshow: false,
      infoUrl: "/system/config", //获取列表的URL
      tableData: [],
      cols: [
        { prop: "configName", label: "参数名称" },
        { prop: "configKey", label: "参数键名" },
        { prop: "configValue", label: "参数键值" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "参数名称",
      open: false,
      reFresh: true,
      title: "修改",
      form: {},
      rules: {
        configName: [
          { required: true, message: "参数名称不能为空", trigger: "blur" }
        ],
        configKey: [
          { required: true, validator: validateConfigKey, trigger: "blur" }
        ],
        configValue: [
          { required: true, message: "参数键值不能为空", trigger: "blur" }
        ]
      },
      color1: null
    };
  },
  methods: {
    getConfigInfo() {
      var _this = this;
      getConfigInfoListApi()
        .then(function(response) {
          console.log(response);
          _this.tableData = response.data;
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
      this.ifInputDictType = false;
    },
    //将新增的数据传入后台，完成新增
    fatherAddInfoSubmit(formData) {
      var _this = this;
      // console.log(formData);

      this.$refs.form.validate(valid => {
        if (valid) {
          addConfigInfoApi(formData)
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
        }
      });
    },
    //点击修改按钮，弹出修改弹窗
    fatherEditInfo(row) {
      this.open = true;
      this.editRow = row;
      this.title = "修改";

      this.form = {
        id: row["id"],
        configName: row["configName"],
        configKey: row["configKey"],
        configValue: row["configValue"],
        remark: row["remark"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          editConfigInfoApi(formData)
            .then(function(response) {
              console.log(response);
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
      console.log(idForAllDel);

      //二次确认删除;
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deletetConfigInfoApi(idForAllDel)
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
    handleClose() {
      this.open = false;
      this.initForm();
    },
    initForm() {
      this.form = {
        id: undefined,
        configName: undefined,
        configKey: undefined,
        configValue: undefined,
        remark: undefined
      };
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
      });
    },
    submitForm() {
      if (this.title == "新增") {
        this.fatherAddInfoSubmit(this.form);
      } else {
        this.fatherEditInfoSubmit(this.form);
      }
    },
    resetForm() {
      if (this.title == "新增") {
        this.initForm();
      } else {
        this.form = {
          configName: this.editRow["configName"],
          configKey: this.editRow["configKey"],
          configValue: this.editRow["configValue"],
          remark: this.editRow["remark"]
        };
      }
    }
  }
};
</script>

<style>
</style>
