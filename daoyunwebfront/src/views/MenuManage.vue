<template>
  <div id="MenuManage" v-if="ifshow">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addInfo">新增</el-button>
      <!-- <el-input v-model="searchText" placeholder="菜单名称" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
    </div>
    <el-table
      v-loading="loading"
      :data="menuList"
      width="100%"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="path" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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
      <el-form ref="menuForm" :model="form" :rules="rules" label-width="80px" v-if="reFresh">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected"/>
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'" label="权限标识">
              <el-input v-model="form.perms" placeholder="请权限标识" maxlength="50"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="显示状态">
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
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
  getAllMenuForRoleApi,
  addMenuInfoApi,
  editMenuInfoApi,
  deleteMenuInfoApi
} from "@/api/api";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "MenuManage",
  components: { Treeselect, IconSelect },
  data() {
    return {
      ifshow: false,
      reFresh: true,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      searchText: "",
      title: "",
      open: false,
      form: {},
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
      },
      menuOptions: [],
      statusOptions: [
        { dictValue: false, dictLabel: "正常" },
        { dictValue: true, dictLabel: "停用" }
      ],
      visibleOptions: [
        { dictValue: true, dictLabel: "显示" },
        { dictValue: false, dictLabel: "隐藏" }
      ],
      editRow: []
    };
  },
  methods: {
    //从后台获取表格内的信息
    getMenuInfo() {
      var _this = this;
      getAllMenuForRoleApi().then(function(response) {
        //console.log(response);
        _this.menuList = response.data.data;
        _this.ifshow = true;
        _this.loading = false;
      });
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      if (row.status == false) {
        return "正常";
      } else {
        return "停用";
      }
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      var _this = this;
      getAllMenuForRoleApi().then(response => {
        _this.menuOptions = [];
        const menu = { id: 0, menuName: "主类目", children: [] };
        menu.children = response.data.data;
        _this.menuOptions.push(menu);
        //  console.log(response)
      });
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    initForm() {
      this.form = {
        id: undefined,
        parentId: 0,
        menuType: "M",
        icon: undefined,
        menuName: undefined,
        orderNum: undefined,
        path: undefined,
        component: undefined,
        perms: undefined,
        visible: true,
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
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          if (this.title == "新增") {
            //console.log(this.form)
            addMenuInfoApi(this.form).then(function(response) {
              // console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("新增成功");
                _this.postSubmit();
              } else {
                _this.$message.error("新增失败");
              }
            });
          } else {
            //console.log(this.form)
            editMenuInfoApi(this.form).then(function(response) {
              // console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("修改成功");
                _this.postSubmit();
              } else {
                _this.$message.error("修改失败");
              }
            });
          }
        }
      });
    },
    postSubmit() {
      this.handleClose();
      this.getMenuInfo();
      this.getTreeselect();
      //使用全局变量控制菜单变化
      this.$store.state.reloadSidebar = this.$store.state.reloadSidebar
        ? false
        : true;
    },
    resetForm() {
      if (this.title == "新增") {
        this.initForm();
      } else {
        this.form = {
          parentId: this.editRow.parentId,
          menuType: this.editRow.menuType,
          icon: this.editRow.icon,
          menuName: this.editRow.menuName,
          orderNum: this.editRow.orderNum,
          path: this.editRow.path,
          component: this.editRow.component,
          perms: this.editRow.perms,
          visible: this.editRow.visible ? 1 : 0,
          status: this.editRow.status ? 1 : 0
        };
      }
    },
    handleUpdate(row) {
      //console.log(row);
      this.form = {
        id: row.id,
        parentId: row.parentId,
        menuType: row.menuType,
        icon: row.icon,
        menuName: row.menuName,
        orderNum: row.orderNum,
        path: row.path,
        component: row.component,
        perms: row.perms,
        visible: row.visible,
        status: row.status
      };
      this.title = "修改";
      this.editRow = row;
      this.open = true;
    },
    handleDelete(row) {
      // console.log(row);
      //二次确认删除;
      var _this = this;
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteMenuInfoApi(row.id)
            .then(function(response) {
              // console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("删除成功");
                _this.postSubmit();
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
    this.getMenuInfo();
    this.getTreeselect();
    this.initForm();
  }
};
</script>

<style scoped>
#MenuManage {
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
