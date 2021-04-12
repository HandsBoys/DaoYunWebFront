<template>
  <div id="DictDataManage" v-if="ifshow">
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
      :ifShow="false"
      :ifEdit="true"
      :ifDelete="true"
    ></v-table>
  </div>
</template>

<script>
//批量操作未做
//若字典无数据时，显示空表未做
import Cookies from "js-cookie";
import vTable from "../components/CurrTable.vue";
import { getDictDataInfoListApi } from "@/api/api";
export default {
  name: "DictDataManage",
  components: {
    vTable
  },
  data() {
    return {
      row: {},
      dictType: {},
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "dictCode", label: "字典编码" },
        { prop: "dictLabel", label: "字典标签" },
        { prop: "dictValue", label: "字典键值" },
        { prop: "dictType", label: "字典类型" },
        { prop: "status", label: "状态" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "字典标签",
      formContent: [
        { prop: "dictType", label: "字典类型", value: "", disable: true },
        { prop: "dictCode", label: "字典编码", value: "", disable: true },
        { prop: "dictLabel", label: "字典标签", value: "", disable: false },
        { prop: "dictValue", label: "字典键值", value: "", disable: false },
        { prop: "status", label: "状态", value: "", disable: false },
        { prop: "remark", label: "备注", value: "", disable: false }
      ],
      formRules: [],
      infoUrl: "/system/dict/data/list", //获取列表的URL
      addUrl: "/system/dict/data/add", //新增操作访问后台的URL
      editUrl: "/system/dict/data/edit", //修改操作访问后台的URL
      delUrl: "/system/dict/data/delete", //删除操作访问后台的URL
    };
  },
  created() {
    var temp = Cookies.get("DictDataManage");
    this.row = JSON.parse(temp);
    this.dictType["dictType"] = this.row.dictType;
    this.formContent[0].value = this.row.dictType;
    //console.log(this.dictType);
    this.getDictDataInfo(this.dictType);
  },
  methods: {
    getDictDataInfo(dT) {
      var _this = this;
      getDictDataInfoListApi(dT)
        .then(function(response) {
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
