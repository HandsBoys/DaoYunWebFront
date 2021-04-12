<template>
  <div id="ParameterManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :ifShow="true"
      :ifEdit="true"
      :ifDelete="true"
    ></v-table>
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
import { getConfigInfoListApi } from "@/api/api";
import { routerToLogin } from "@/utils/routerGuard";
export default {
  name: "ParameterManage",
  components: {
    vTable
  },
  created() {
    this.getConfigInfo();
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
        { prop: "configId", label: "参数主键" },
        { prop: "configName", label: "参数名称" },
        { prop: "configKey", label: "参数键名" },
        { prop: "configValue", label: "参数键值" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "参数名称",
      test: {},
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
    }
  }
};
</script>

<style>
</style>
