<template>
 <div>
  <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
   <el-table-column prop="date" label="日期" width="180">
   </el-table-column>
   <el-table-column prop="name" label="姓名" width="180">
   </el-table-column>
   <el-table-column prop="address" label="地址">
   </el-table-column>
  </el-table>
  <!-- 分页器 -->
  <div class="block" style="margin-top:15px;">
   <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1,5,10,20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
   </el-pagination>
  </div>
 </div>
  
</template>
  
 <script>
export default {
 data() {
  return {
   tableData: [
    {
     date: "2016-05-02",
     name: "王小虎",
     address: "上海市普陀区金沙江路 1518 弄"
    },
    {
     date: "2016-05-04",
     name: "王小虎",
     address: "上海市普陀区金沙江路 1517 弄"
    },
    {
     date: "2016-05-01",
     name: "王小虎",
     address: "上海市普陀区金沙江路 1519 弄"
    },
    {
     date: "2016-05-03",
     name: "王小虎",
     address: "上海市普陀区金沙江路 1516 弄"
    }
   ],
   currentPage: 1, // 当前页码
   total: 20, // 总条数
   pageSize: 1 // 每页的数据条数
  };
 },
 methods: {
  handleSizeChange(val) {
   console.log(`每页 ${val} 条`);
   this.currentPage = 1;
   this.pageSize = val;
  },
  handleCurrentChange(val) {
   console.log(`当前页: ${val}`);
   this.currentPage = val;
  }
 }
};
</script>