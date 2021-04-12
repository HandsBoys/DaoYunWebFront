<template>
  <div id="DictManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :fContent="formContent"
      :fRules="formRules"
      :infoUrl="infoUrl"
      :addUrl="addUrl"
      :editUrl="editUrl"
      :delUrl="delUrl"
      :delAllUrl="delAllUrl"
      :detailMesUrl="detailMesUrl"
      :ifShow="true"      
      :ifEdit="true"
      :ifDelete="true"
    ></v-table>
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
import { getDictInfoListApi } from "@/api/api";
import { routerToLogin } from "@/utils/routerGuard";
export default {
  name: "DictManage",
  components: {
    vTable
  },
  created() {
    this.getDictInfo();
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
        { prop: "dictId", label: "字典编号" },
        { prop: "dictName", label: "字典名称" },
        { prop: "dictType", label: "字典类型" },
        { prop: "status", label: "状态" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "字典名称",
      formContent: [
        { prop: "dictId", label: "字典编号", value: "", disable: true },
        { prop: "dictName", label: "字典名称", value: "", disable: false },
        { prop: "dictType", label: "字典类型", value: "", disable: false },
        { prop: "status", label: "状态", value: "", disable: false },
        { prop: "remark", label: "备注", value: "", disable: false }
      ],
      formRules: [],
      infoUrl: "/system/dict/type/list", //获取列表的URL
      addUrl: "/system/dict/type/add", //新增操作访问后台的URL
      editUrl: "/system/dict/type/edit", //修改操作访问后台的URL
      delUrl: "/system/dict/type/delete", //删除操作访问后台的URL
      delAllUrl: "/system/dict/type/remove", //批量删除操作访问后台的URL
      detailMesUrl: "DictDataManage" //查看信息URL
    };
  },
  methods: {
    getDictInfo() {
      var _this = this;
      getDictInfoListApi()
        .then(function(response) {
             console.log(response)
          _this.tableData = response.data;
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
