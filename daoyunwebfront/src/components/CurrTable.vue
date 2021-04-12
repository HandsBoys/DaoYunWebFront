<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addInfo">新增</el-button>
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
        >批量删除</el-button>
        <el-input v-model="query.name" :placeholder="searchLabel" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>

      <el-table
        class="table"
        :data="tableData"
        border
        width="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column :key="col.prop" :label="col.label" :prop="col.prop" v-for="col in cols"></el-table-column>
        <el-table-column label="操作" prop="option">
          <template slot-scope="scope">
            <el-button
              type="info"
              @click="showMes(scope.row)"
              icon="el-icon-message"
              circle
              v-if="ifShowMes"
            ></el-button>
            <el-button
              type="primary"
              @click="editInfo(scope.row)"
              icon="el-icon-edit"
              circle
              v-if="ifEditInfo"
            ></el-button>
            <el-button
              type="danger"
              @click="deleteInfo(scope.row)"
              icon="el-icon-delete"
              circle
              v-if="ifDeleteInfo"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>

      <!-- 新建弹出框 -->
      <el-dialog title="新增" :visible.sync="addVisible" width="30%" :before-close="handleClose">
        <v-form
          :fContent="formContent"
          :fRules="formRules"
          :subUrl="addURL"
          v-on:ifSub="ifAddSubmit"
        ></v-form>
      </el-dialog>

      <!-- 修改弹出框 -->
      <el-dialog title="修改" :visible.sync="editVisible" width="30%" :before-close="handleClose">
        <v-form
          :fContent="formContent"
          :fRules="formRules"
          :subUrl="editURL"
          v-on:ifSub="ifEditSubmit"
        ></v-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import vForm from "../components/CurrForm.vue";
import http from "../utils/http";
import request from "../utils/request";
import Cookies from "js-cookie";
export default {
  name: "CurrTable",
  props: [
    "tData",
    "tCols",
    "sLabel",
    "fContent",
    "fRules",
    "infoUrl",
    "addUrl",
    "editUrl",
    "delUrl",
    "delAllUrl",
    "detailMesUrl",
    "ifShow",
    "ifEdit",
    "ifDelete"
  ],
  data() {
    return {
      query: {
        address: "",
        name: "",
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      cols: [],
      id: "",
      multipleSelection: [],
      delList: [],
      pageTotal: 0,
      idx: -1,
      id: -1,
      searchLabel: "",
      addVisible: false,
      editVisible: false,
      idForAllDel: [],

      formContent: [],
      formRules: [],
      tempContent: [],

      infoURL: "",
      addURL: "",
      editURL: "",
      delURL: "",
      delAllURL: "",
      detailMesURL: "",

      ifShowMes: false,
      ifEditInfo: true,
      ifDeleteInfo: true
    };
  },
  components: {
    vForm
  },
  created() {
    this.getData();
  },
  methods: {
    // 接收prop数据
    getData() {
      this.tableData = this.tData;
      this.cols = this.tCols;
      this.searchLabel = this.sLabel;
      this.pageTotal = this.tableData.length;

      this.formContent = this.fContent;
      this.formRules = this.fRules;
      this.tempContent = JSON.parse(JSON.stringify(this.formContent));

      this.infoURL = this.infoUrl;
      this.addURL = this.addUrl;
      this.editURL = this.editUrl;
      this.delURL = this.delUrl;
      this.delAllURL = this.delAllUrl;
      this.detailMesURL = this.detailMesUrl;

      this.ifShowMes = this.ifShow;
      this.ifEditInfo = this.ifEdit;
      this.ifDeleteInfo = this.ifDelete;
    },
    //使用axios更新数据，用于新建，更新，删除等操作后调用
    getDataByAxios() {
      var _this = this;
      http
        .get(this.infoURL)
        .then(function(response) {
          // console.log(response.data);
          //将tableData重新赋值
          _this.tableData = response.data;
          _this.pageTotal = _this.tableData.length;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //触发新建弹窗
    addInfo() {
      this.addVisible = true;
    },
    //新增提交
    ifAddSubmit(val) {
      //console.log(val);
      //若提交成功，重新向后台请求数据，更新页面
      if (val == true) {
        this.getDataByAxios();
        this.handleClose()
        // this.addVisible = false;
        this.$message.success("新增成功");
      } else {
        this.$message.error("新增失败");
      }
    },
    //触发修改弹窗
    editInfo(row) {
      this.editVisible = true;

      for (var i = 0; i < this.formContent.length; i++) {
        var name = this.formContent[i].prop;
        this.formContent[i].value = row[name];
      }
    },
    //修改提交
    ifEditSubmit(val) {
      //若提交成功，重新向后台请求数据，更新页面
      console.log(" ifEditSubmit(val)");
      if (val == true) {
        this.getDataByAxios();
        this.handleClose()
        // this.editVisible = false;
        // this.formContent = JSON.parse(JSON.stringify(this.tempContent));
        this.$message.success("修改成功");
      } else {
        this.$message.error("修改失败");
      }
    },
    //关闭新增和修改弹窗
    handleClose() {
      for (var i = 0; i < this.formContent.length; i++) {
        this.formContent[i].value = this.tempContent[i].value;
      }
      
      this.editVisible = false;
      this.addVisible = false;
    },
    //触发删除
    deleteInfo(row) {
      // 二次确认删除
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          //console.log(row);

          const config = {
            method: "post",
            url: this.delURL,
            data: row
          };

          request(config)
            .then(function(response) {
              //console.log(response);
              _this.$message.success("删除成功");
              _this.getDataByAxios();
            })
            .catch(function(error) {
              _this.$message.error("删除失败");
              console.log(error);
            });
        })
        .catch(() => {});
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;

      console.log(val);
    },
    //批量删除
    delAllSelection() {
      // 二次确认删除
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var id = this.cols[0].prop;
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.idForAllDel[i] = this.multipleSelection[i][id];
          }
          console.log(this.idForAllDel);

          const config = {
            method: "post",
            url: this.delAllURL,
            data: this.idForAllDel
          };

          request(config)
            .then(function(response) {
              //console.log(response);
              _this.$message.success("删除成功");
              _this.multipleSelection = [];
              _this.getDataByAxios();
            })
            .catch(function(error) {
              _this.$message.error("删除失败");
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //查看信息
    showMes(row) {
      //路由跳转，将row传递到查看信息界面
      Cookies.set(this.detailMesURL, row, {
        expires: 30
      });
      //alert(this.detailMesURL);
      //console.log(row);
      this.$router.push({
        path: this.detailMesURL
      });
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
