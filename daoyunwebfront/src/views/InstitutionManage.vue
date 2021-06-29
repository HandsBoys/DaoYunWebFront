<template>
  <div id="InstitutionManage" v-if="ifshow">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addInfo">新增</el-button>
      <!-- <el-input v-model="searchText" placeholder="机构名称" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
    </div>
    <el-table
      v-loading="loading"
      :data="institutionList"
      width="100%"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" label="机构名称" :show-overflow-tooltip="true" width="350"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="260"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="260"></el-table-column>
      <el-table-column
        prop="deptLevel"
        label="机构级别"
        :formatter="deptLevelsFormat"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :before-close="handleClose"
    >
      <el-form ref="institutionForm" :model="form" :rules="rules" label-width="80px" v-if="reFresh">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级机构">
              <treeselect
                v-model="form.parentId"
                :options="institutionOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级机构"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="机构类型" prop="deptLevel">
              <el-radio-group v-model="form.deptLevel">
                <el-radio label="U">大学</el-radio>
                <el-radio label="C">学院</el-radio>
                <el-radio label="S">专业</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入机构名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="inti in statusOptions"
                  :key="inti.intValue"
                  :label="inti.intValue"
                >{{inti.intLabel}}</el-radio>
              </el-radio-group>
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
import {
  getInstitutionInfoListApi,
  addInstitutionInfoApi,
  editInstitutionInfoApi,
  deleteInstitutionInfoApi
} from "@/api/api";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "InstitutionManage",
  components: { Treeselect },
  data() {
    return {
      ifshow: false,
      reFresh: true,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      institutionList: [],
      searchText: "",
      title: "",
      open: false,
      form: {},
      rules: {
        deptName: [
          { required: true, message: "机构名称不能为空", trigger: "blur" }
        ],
        orderNum: [{ required: true, message: "顺序不能为空", trigger: "blur" }]
      },
      institutionOptions: [],
      editRow: [],
      statusOptions: [
        { intValue: false, intLabel: "正常" },
        { intValue: true, intLabel: "停用" }
      ]
    };
  },
  methods: {
    //从后台获取表格内的信息
    getInstitutionInfo() {
      var _this = this;
      getInstitutionInfoListApi().then(function(response) {
        //console.log(response);
        _this.institutionList = response.data.data;
        _this.ifshow = true;
        _this.loading = false;
      });
    },
    // 机构等级翻译
    deptLevelsFormat(row, column) {
      if (row.deptLevel == "U") {
        return "大学";
      } else if (row.deptLevel == "C") {
        return "学院";
      } else {
        return "专业";
      }
    },
    statusFormat(row, column) {
      if (row.status == false) {
        return "正常";
      } else {
        return "禁用";
      }
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      var _this = this;
      getInstitutionInfoListApi().then(response => {
        _this.institutionOptions = [];
        const menu = { id: 0, deptName: "主类目", children: [] };
        menu.children = response.data.data;
        _this.institutionOptions.push(menu);
      });
    },
    initForm() {
      this.form = {
        id: undefined,
        parentId: 0,
        deptName: undefined,
        deptLevel: "U",
        orderNum: undefined,
        status: false
      };

      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
      });
    },
    handleClose() {
      this.open = false;
      this.initForm();
    },
    addInfo() {
      this.open = true;
      this.title = "新增";
    },
    handleSearch() {},
    submitForm() {
      const _this = this;
      this.$refs.institutionForm.validate(valid => {
        if (valid) {
          if (this.title == "新增") {
            addInstitutionInfoApi(this.form).then(function(response) {
              //console.log(response);
              _this.$message.success("新增成功");
              _this.handleClose();
              _this.getInstitutionInfo();
              _this.getTreeselect();
            });
          } else {
            editInstitutionInfoApi(this.form).then(function(response) {
              //console.log(response);
              _this.$message.success("修改成功");
              _this.handleClose();
              _this.getInstitutionInfo();
              _this.getTreeselect();
            });
          }
        }
      });
    },
    resetForm() {
      if (this.title == "新增") {
        this.initForm();
      } else {
        this.form = {
          parentId: this.editRow.parentId,
          deptName: this.editRow.deptName,
          deptLevel: this.editRow.deptLevel,
          orderNum: this.editRow.orderNum,
          status: this.editRow.status
        };
      }
    },
    handleUpdate(row) {
      //console.log(row);
      this.form = {
        id: row.id,
        parentId: row.parentId,
        deptName: row.deptName,
        deptLevel: row.deptLevel,
        orderNum: row.orderNum,
        status: row.status
      };
      this.title = "修改";
      this.editRow = row;
      this.open = true;
    },
    handleDelete(row) {
      //console.log(row);
      //二次确认删除;
      var _this = this;
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteInstitutionInfoApi(row.id)
            .then(function(response) {
              //console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("删除成功");
                _this.getInstitutionInfo();
                _this.getTreeselect();
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
    }
  },
  created() {
    this.getInstitutionInfo();
    this.getTreeselect();
    this.initForm();
  }
};
</script>

<style scoped>
#InstitutionManage {
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.mr10 {
  margin-right: 10px;
}
</style>
