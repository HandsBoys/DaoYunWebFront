<template>
  <div id="ParameterManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :ifShow="false"
      :ifEdit="true"
      :ifDelete="false"
      :ifTwoBtn="false"
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
            <el-color-picker v-model="form.configValue"></el-color-picker>
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
import { getConfigInfoListApi } from "@/api/api";
// import { routerToLogin } from "@/utils/routerGuard";
export default {
  name: "ParameterManage",
  components: {
    vTable
  },
  created() {
    this.getConfigInfo();
    // var bo = routerToLogin();
    // if (bo) {
    //   this.$router.push({
    //     path: "Login2"
    //   });
    // }
  },
  data() {
    return {
      ifshow: false,
      tableData: [],
      cols: [
        // { prop: "configId", label: "参数主键" },
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
          { required: true, message: "参数键名不能为空", trigger: "blur" }
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
          _this.tableData = response.data.data;
          _this.ifshow = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //点击修改按钮，弹出修改弹窗
    fatherEditInfo(row) {
      this.open = true;
      this.editRow = row;

      this.form = {
        configName: row["configName"],
        configKey: row["configKey"],
        configValue: row["configValue"],
        remark: row["remark"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {},
    handleClose() {
      this.open = false;
    },
    submitForm() {},
    resetForm() {
      this.form = {
        configName: this.editRow["configName"],
        configKey: this.editRow["configKey"],
        configValue: this.editRow["configValue"],
        remark: this.editRow["remark"]
      };
    }
  }
};
</script>

<style>
</style>
