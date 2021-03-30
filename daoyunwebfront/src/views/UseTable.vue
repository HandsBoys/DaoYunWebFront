<template>
  <div>
    <v-table :tData="tableData" :tCols="cols"></v-table>
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
export default {
  name: "UseTable",
  components: {
    vTable
  },
  data() {
    return {
      tableData: [
        { id: "1", name: "小李", sex: "男" },
        { id: "2", name: "小红", sex: "女" }
      ],
      cols: [
        { prop: "id", label: "编号" },
        { prop: "name", label: "名字" },
        { prop: "sex", label: "性别" }
      ]
    };
  }
};
</script>

<style>
</style>
