<template>
  <div id="UserManage" v-if="ifshow">
    <v-table :tData="tableData" :tCols="cols"></v-table>
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
import { getUserInfoListApi } from "@/api/api";
export default {
  name: "UserManage",
  components: {
    vTable
  },
  created() {
    this.getUserInfo();
  },
  data() {
    return {
      //         { id: "1", name: "小李", sex: "男" },
      // { id: "2", name: "小红", sex: "女" }
      tableData: [],
      cols: [
        { prop: "userId", label: "用户ID" },
        { prop: "userName", label: "用户名" },
        { prop: "email", label: "邮箱" },
        { prop: "sex", label: "性别" },
        { prop: "roleName", label: "角色" }
      ],
      ifshow: false
    };
  },
  methods: {
    getUserInfo() {
      var _this = this;
      getUserInfoListApi()
        .then(function(response) {
          for (var i = 0; i < response.data.length; i++) {
            var rolename;
            if (response.data[i].role == null) {
              rolename = "";
            } else {
              rolename = response.data[i].role.roleName;
            }
            var ob = {
              userId: response.data[i].userId,
              userName: response.data[i].userName,
              email: response.data[i].email,
              sex: response.data[i].sex,
              roleName: rolename
            };
            _this.tableData[i] = ob;
          }
          _this.ifshow = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
