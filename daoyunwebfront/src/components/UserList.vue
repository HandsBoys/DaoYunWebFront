<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="userParams.query"
            clearable
            @clear="getUsersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="userDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户数据列表区域 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话" width="180"></el-table-column>
        <el-table-column prop="role.roleName" label="角色" width="180"></el-table-column>
        <!-- <el-table-column prop="mg_state" label="状态" width="180"> -->
        <!-- <el-table-column label="状态" width="180"> -->
        <!-- 作用域插槽会覆盖prop属性，则上面列中的属性prop可以删除  -->
        <!-- <template slot-scope="scope"> -->
        <!-- 可以使用{{slotProps.row}}来获取这一行的数据(相当于当前行的数据对象，row是个内置属性 $index可获取当前行的索引) -->
        <!-- <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch> -->
        <!-- </template> -->
        <!-- </el-table-column> -->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- {{scope.$index}} -->
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.userName, scope.row.email, scope.row.phone)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row.id,scope.row.username)"
            ></el-button>
            <!-- 文字提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <!-- 分配角色 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                @click="showAssignRole(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userParams.pagesize"
        :current-page="userParams.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="userDialogVisible" width="50%" @close="closeUserForm">
      <!-- 内容主体区域 -->
      <!-- <span>这是一段信息</span> -->
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editCloseUserForm"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserRules"
        ref="editUserFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="邮  箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电  话" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRoleDialogVisible"
      width="50%"
      @close="closeAssignRole"
    >
      <el-form :model="assignRoleForm" ref="assignRoleFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="assignRoleForm.username" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="assignRoleForm.rid"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserList",
  created() {
    // 页面一加载就执行获取用户列表数据的函数
    this.getUsersList();
  },
  data: function() {
    // 验证邮箱的自定义规则
    var checkEmail = (rule, value, callback) => {
      var emailreg = /^([a-zA-Z0-9-_])+@([a-zA-Z0-9-_])+(\.[a-zA-Z0-9-_])+/;
      if (emailreg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确格式的邮箱"));
      }
    };
    // 验证手机的自定义规则
    var checkPhone = (rule, value, callback) => {
      var phonereg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (phonereg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };
    return {
      // 用户列表数据
      userList: [],
      // 用户总数
      total: 0,
      // 查询用户列表的参数
      userParams: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 3
      },
      //是否显示添加用户对话框
      userDialogVisible: false,
      // 是否显示编辑用户对话框
      editDialogVisible: false,
      //是否显示分配角色对话框
      assignRoleDialogVisible: false,
      // 添加用户表单数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 编辑用户表单数据
      editUserForm: {},
      //分配角色表单数据
      assignRoleForm: {},
      // 添加用户表单验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      },
      //编辑用户表单验证规则
      editUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getUsersList: async function() {
      // 获取用户列表数据
      const _this = this;
      this.$axios
        .get("http://1.15.31.156:8081/system/user/list")
        .then(function(response) {
          console.log(response.data);
          _this.userList = response.data;
          _this.total = response.data.length;
        });
      console.log(this.userList);
      //   const { data: res } = await this.$http.get("users", {
      //     params: this.userParams
      //   });
      //   if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      //   this.userList = res.data.users;
      //   this.total = res.data.total;
    },
    handleSizeChange: function(newsize) {
      // 改变每页条数 pageSize 改变时会触发
      // console.log(newsize); newsize是自己选择的页面显示条数1，2,5,10
      // 根据选择的每页条数重新获取数据然后渲染出来
      this.userParams.pagesize = newsize;
      this.getUsersList();
    },
    handleCurrentChange: function(newpage) {
      // 当前页 currentPage 改变时会触发
      // console.log(newpage);
      this.userParams.pagenum = newpage;
      this.getUsersList();
    },
    changeUserState: async function(userInfo) {
      // 改变用户的状态
      // console.log(userInfo);${}为es6的语法代表变量
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      // console.log(res);
      if (res.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state; //状态不变
        return this.$message.error({
          message: "修改用户状态失败",
          duration: 1000
        });
      }
      this.$message.success({ message: "修改用户状态成功", duration: 500 });
    },
    // 关闭添加用户对话框让表单重置
    closeUserForm: function() {
      this.$refs.addUserFormRef.resetFields();
    },
    // 点击添加用户对话框的确定按钮
    addUser: function() {
      this.$refs.addUserFormRef.validate(async value => {
        // console.log(value); true代表输入的数据成功符合 false代表数据一个或多个不符合
        if (!value) return this.$message.error("添加用户失败！");
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 200) {
          return this.$message.error("添加用户失败！");
        } else {
          this.$message.success(res.meta.msg);
        }
        // 添加成功后关闭对话框
        this.userDialogVisible = false;
        // 在列表页也展示新增加的用户
        this.getUsersList();
      });
    },
    //展示编辑对话框
    showEditDialog: async function(userName, Email, Phone) {
      this.editDialogVisible = true;
      // 获取点击的用户数据
      //   console.log(userName);
      //   console.log(Email);
      //   console.log(Phone);
      this.editUserForm.username = userName;
      //   this.editUserForm.email = Email;
      //   this.editUserForm.mobile = Phone;
      //   const { data: res } = await this.$http.get("users/" + id);
      //   if (res.meta.status !== 200)
      //     return this.$message.error("获取用户数据失败");
      //   this.editUserForm = res.data;
    },
    // 关闭编辑用户表单对话框让表单重置
    editCloseUserForm: function() {
      this.$refs.editUserFormRef.resetFields();
    },
    // 编辑用户信息
    editUser: function() {
      this.$refs.editUserFormRef.validate(async value => {
        //  console.log(value);
        if (!value) return this.$message.error("请输入正确的修改信息");
        const _this = this;
        var params = new URLSearchParams();
        params.append("username", this.editUserForm.username);
        params.append("email", this.editUserForm.email);
        params.append("phone", this.editUserForm.mobile);
        this.$axios
          .post("http://1.15.31.156:8081/login?", params)
          .then(function(response) {
            console.log(response);
            if (response.data.code == "200") {
              _this.$router.push({
                path: "index",
                query: { username: _this.username }
              });
            } else {
              _this.$message.error("用户名或密码错误");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        // // 修改用户信息
        // const { data: res } = await this.$http.put(
        //   "users/" + this.editUserForm.id,
        //   {
        //     email: this.editUserForm.email,
        //     mobile: this.editUserForm.mobile
        //   }
        // );
        // if (res.meta.status !== 200) return this.$message.error("更新失败");
        // this.$message.success(res.meta.msg);
        // // 关闭编辑用户对话框
        // this.editDialogVisible = false;
        // // 重新渲染列表
        // this.getUsersList();
      });
    },
    // 删除用户
    deleteUser: async function(id, username) {
      const msg = await this.$confirm(
        "此操作将永久删除用户" + username + ", 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果点击删除返回confirm，如果点击取消返回cancel
      // console.log(msg);
      if (msg === "confirm") {
        const { data: res } = await this.$http.delete("users/" + id);
        if (res.meta.status !== 200)
          return this.$message.error("删除用户失败！");
        this.$message.success(res.meta.msg);
      }
      // 重新渲染列表
      this.getUsersList();
    },
    // 展示分配角色对话框
    showAssignRole: async function(id) {
      this.assignRoleDialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      // console.log(res);
      this.assignRoleForm = res.data;
    },
    // 关闭分配角色对话框使其重置
    closeAssignRole: function() {
      this.$refs.assignRoleFormRef.resetFields();
    },
    // 分配角色
    assignRole: async function() {
      const { data: res } = await this.$http.put(
        "users/" + this.assignRoleForm.id + "/role",
        {
          rid: this.assignRoleForm.rid
        }
      );
      if (res.meta.status !== 200) return this.$message.error("分配角色失败~");
      this.$message.success(res.meta.msg);
      // 关闭对话框
      this.assignRoleDialogVisible = false;
      //重新渲染列表
      this.getUsersList();
    }
  }
};
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  padding: 0;
  margin: 0;
}

/* 面包屑导航 */

.el-breadcrumb {
  margin-bottom: 30px;
}

/* 卡片 */

.el-card {
  box-shadow: 0 1px 1px rgba(216, 156, 156, 0.15) !important;
}

/* 表格 */

.el-table {
  margin-top: 15px;
  font-size: 15px;
}

/* 分页 */

.el-pagination {
  margin-top: 20px;
}
</style>
