<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <span v-if="ifTwoButton">
          <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addInfo">新增</el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllSelection"
          >批量删除</el-button>
        </span>
        <!-- <el-input v-model="searchText" :placeholder="searchLabel" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
      </div>

      <el-table
        class="table"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        width="100%"
        @selection-change="handleSelectionChange"
        :row-key="rowKey"
        ref="currtable"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :reserve-selection="true"
          v-if="ifTwoButton"
        ></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
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
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5,10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../utils/http";
import request from "../utils/request";

export default {
  name: "CurrTable",
  props: [
    "tData",
    "tCols",
    "sLabel",
    "infoUrl",
    "ifShow",
    "ifEdit",
    "ifDelete",
    "rKey",
    "ifTwoBtn"
  ],
  data() {
    return {
      searchText: "",
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5, // 每页的数据条数
      pageTotal: 0,

      tableData: [],
      cols: [],
      id: "",
      multipleSelection: [],
      delList: [],
      idx: -1,
      id: -1,
      searchLabel: "",

      infoURL: "",

      ifShowMes: false,
      ifEditInfo: true,
      ifDeleteInfo: true,

      ifTwoButton: true
    };
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
      // console.log(this.pageTotal);

      this.infoURL = this.infoUrl;

      this.ifShowMes = this.ifShow;
      this.ifEditInfo = this.ifEdit;
      this.ifDeleteInfo = this.ifDelete;

      this.ifTwoButton = this.ifTwoBtn;
    },
    //使用axios更新数据，用于新建，更新，删除等操作后调用
    getDataByAxios() {
      var _this = this;
      var temp = this.currentPage; //记录删除前所在的页数
      // console.log(this.infoURL);
      http
        .get(this.infoURL)
        .then(function(response) {
          //console.log(response);
          // console.log(response.data);
          //将tableData重新赋值
          _this.tableData = [];
          _this.tableData = response.data.data;
          // console.log(_this.pageTotal);

          //_this.pageTotal = _this.tableData.length;
          //暂时这样写
          for (var i = 0; i < _this.tableData.length; i++) {
            // console.log("1");
            //判断对象中是否存在status这一项，未测试
            if (_this.tableData[i].hasOwnProperty("status")) {
              if (_this.tableData[i]["status"] == false) {
                _this.tableData[i]["status"] = "正常";
              } else {
                _this.tableData[i]["status"] = "停用";
              }
            }

            if (_this.tableData[i].hasOwnProperty("sex")) {
              if (_this.tableData[i]["sex"] == 0) {
                _this.tableData[i]["sex"] = "男";
              } else if (_this.tableData[i]["sex"] == 1) {
                _this.tableData[i]["sex"] = "女";
              } else {
                _this.tableData[i]["sex"] = "未知";
              }
            }

            if (_this.tableData[i].hasOwnProperty("roles")) {
              var role = "";
              for (var j = 0; j < _this.tableData[i]["roles"].length; j++) {
                role = _this.tableData[i]["roles"][j]["roleName"] + " " + role;
              }
              _this.tableData[i]["roles"] = role;
            }

            if (_this.tableData[i].hasOwnProperty("classDto")) {
              _this.tableData[i]["className"] =
                _this.tableData[i]["classDto"]["className"];
            }

            if (_this.tableData[i].hasOwnProperty("enableJoin")) {
              _this.tableData[i]["enableJoin"] = _this.tableData[i][
                "enableJoin"
              ]
                ? "可加入"
                : "不可加入";
            }

            if (_this.tableData[i].hasOwnProperty("teacher")) {
              _this.tableData[i]["teacherName"] =
                _this.tableData[i]["teacher"] == null
                  ? null
                  : _this.tableData[i]["teacher"]["nickName"];
            }
          }
          //若触发删除，可能需操控currentPage
          //例如第二页只有1条数据时，删掉该条数据，需要退回第一页
          //删除后，若当页还存在，留在当页，否则跳到删除后的最后一页
          _this.pageTotal = _this.tableData.length;
          var x = Math.ceil(_this.pageTotal / _this.pageSize); //删除后数据的页数
          // console.log(temp)
          if (x < temp) {
            _this.currentPage = x;
          }
          _this.currentPage = _this.currentPage==0?1:_this.currentPage;
          // console.log(_this.currentPage)
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //触发新建弹窗
    addInfo() {
      this.$parent.fatherAddInfo();
    },
    //触发修改弹窗
    editInfo(row) {
      this.$parent.fatherEditInfo(row);
    },
    //触发删除
    deleteInfo(row) {
      var temp = [];
      temp[0] = row;
      this.$parent.fatherDeleteInfo(temp);
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(val);
    },
    //批量删除
    delAllSelection() {
      this.$parent.fatherDeleteInfo(this.multipleSelection);
    },
    //查看信息
    showMes(row) {
      this.$parent.fatherShowMes(row);
    },
    // 分页导航
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    rowKey(row) {
      var id = this.rKey;
      return row[id];
    }
  },
  watch: {
    ifDictSuccess() {
      this.getDataByAxios();
      this.$refs.currtable.clearSelection();
    }
  },
  computed: {
    ifDictSuccess: {
      //通过监听全局变量的改变，来判断是否需要重新请求后台数据，更新表格
      get() {
        return this.$store.state.ifDictSuccess;
      },
      set(v) {
        this.$store.state.ifDictSuccess = false;
      }
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
