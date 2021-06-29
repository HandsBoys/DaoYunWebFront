<template>
  <div id="CourseStudentManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :infoUrl="infoUrl"
      :ifShow="false"
      :ifEdit="true"
      :ifDelete="true"
      rKey="id"
      :ifTwoBtn="true"
      v-if="ifUpdateTable"
    ></v-table>

    <div>
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="45%"
        append-to-body
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="reFresh">
          <el-form-item label="学生Id" prop="studentId">
            <el-input v-model="form.studentId" placeholder="请输入学生Id"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </span>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        :title="title"
        :visible.sync="open2"
        width="45%"
        append-to-body
        :before-close="handleClose"
      >
        <el-form ref="form2" :model="form2" :rules="rules" label-width="80px" v-if="reFresh">
          <el-form-item label="学生姓名" prop="nickName">
            <el-input v-model="form2.nickName" placeholder="请输入学生姓名" :disabled="true"/>
          </el-form-item>
          <el-form-item label="学号" prop="identityNumber">
            <el-input v-model="form2.identityNumber" placeholder="请输入学号" :disabled="true"/>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form2.phone" placeholder="请输入手机号" :disabled="true"/>
          </el-form-item>
          <el-form-item label="分数" prop="score">
            <el-input v-model="form2.score" placeholder="请输入分数" type="number"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import vTable from "../components/CurrTable.vue";
import {
  getCourseStudentInfoListApi,
  addCourseStudentInfoApi,
  editCourseStudentInfoApi,
  deleteCourseStudentInfoApi
} from "@/api/api";

import Cookies from "js-cookie";

export default {
  name: "CourseStudentManage",
  components: {
    vTable
  },
  data() {
    return {
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "nickName", label: "姓名" },
        { prop: "identityNumber", label: "学号" },
        { prop: "courseId", label: "课程号" },
        { prop: "phone", label: "手机号" },
        { prop: "score", label: "分数" }
      ],
      searchLabel: "字典标签",

      infoUrl: "/system/course/student?courseId=", //获取列表的URL

      open: false,
      open2: false,
      reFresh: true,
      diaLogMode: "",
      // 表单参数
      form: {},
      form2: {},
      // 表单校验
      rules: {
        studentId: [
          { required: true, message: "学生Id不能为空", trigger: "blur" }
        ]
      },
      title: "",
      editRow: [],

      ifUpdateTable: true
    };
  },
  created() {
    this.initPage();
    // this.initForm();
  },
  methods: {
    getCourseStudentInfo(courseId) {
      var _this = this;
      getCourseStudentInfoListApi(courseId)
        .then(function(response) {
          //console.log(response);
          _this.tableData = response.data.data;
          _this.ifshow = true;

          _this.ifUpdateTable = false;
          _this.$nextTick(() => {
            _this.ifUpdateTable = true;
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //点击新增，弹出dialog弹窗
    fatherAddInfo() {
      this.open = true;
      this.title = "新增";
      this.diaLogMode = "add";
    },
    //将新增的数据传入后台，完成新增
    fatherAddInfoSubmit(formData) {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          var temp = Cookies.get("CourseStudentManage");
          var row = {};
          row = JSON.parse(temp);
          var courseId = row["id"];
          formData.courseId = courseId;
          //console.log(formData);
          addCourseStudentInfoApi(formData)
            .then(function(response) {
              //console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("新增成功");
                _this.handleClose();

                //通过全局变量刷新表格数据
                var bo = _this.$store.state.ifDictSuccess;
                if (bo == true) {
                  bo = false;
                } else {
                  bo = true;
                }
                _this.$store.state.ifDictSuccess = bo;
              } else {
                _this.$message.error("新增失败");
              }
            })
            .catch(function(error) {
              _this.$message.error("新增失败");
              console.log(error);
            });
        }
      });
    },
    //点击修改图标，弹出修改弹窗
    fatherEditInfo(row) {
      this.open2 = true;
      this.editRow = row;
      this.title = "修改";
      this.diaLogMode = "edit";

      //console.log(row);

      this.form2 = {
        id: row["id"],
        nickName: row["nickName"],
        identityNumber: row["identityNumber"],
        phone: row["phone"],
        score: row["score"],
        courseId: row["courseId"],
        studentId: row["studentId"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      this.$refs.form2.validate(valid => {
        if (valid) {
          //console.log(formData);
          editCourseStudentInfoApi(formData)
            .then(function(response) {
              //console.log(formData);
              if (response.data.code == "200") {
                _this.$message.success("修改成功");
                _this.handleClose();

                //通过全局变量刷新表格数据
                var bo = _this.$store.state.ifDictSuccess;
                if (bo == true) {
                  bo = false;
                } else {
                  bo = true;
                }
                _this.$store.state.ifDictSuccess = bo;
              } else {
                _this.$message.error("修改失败");
              }
            })
            .catch(function(error) {
              _this.$message.error("修改失败");
              console.log(error);
            });
        }
      });
    },
    //重置新增表单
    fatherResetAddForm() {
      this.initForm();
    },
    //重置修改表单
    fatherResetEditForm() {
      this.form2 = {
        id: this.editRow["id"],
        nickName: this.editRow["nickName"],
        identityNumber: this.editRow["identityNumber"],
        phone: this.editRow["phone"],
        score: this.editRow["score"],
        courseId: this.editRow["courseId"],
        studentId: this.editRow["studentId"]
      };
    },
    //关闭新增和修改弹窗
    handleClose() {
      this.open = false;
      this.open2 = false;
      this.initForm();
    },
    //删除和批量删除函数
    fatherDeleteInfo(formData) {
      //console.log(formData);
      var idForAllDel = "";
      var courseId = formData[0].courseId
      for (let i = 0; i < formData.length; i++) {
        if (i == formData.length - 1) {
          idForAllDel = idForAllDel + formData[i].studentId;
        } else {
          idForAllDel = idForAllDel + formData[i].studentId + ", ";
        }
      }
      //console.log(idForAllDel)
      //二次确认删除;
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteCourseStudentInfoApi(courseId,idForAllDel)
            .then(function(response) {
              //console.log(response);
              if (response.data.code == "200") {
                _this.$message.success("删除成功");
                //通过全局变量刷新表格数据
                var bo = _this.$store.state.ifDictSuccess;
                if (bo == true) {
                  bo = false;
                } else {
                  bo = true;
                }
                _this.$store.state.ifDictSuccess = bo;
              }
            })
            .catch(function(error) {
              _this.$message.error("删除失败");
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //初始化表单
    initForm() {
      this.form = {
        studentId: undefined,
        courseId: undefined
      };
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
      });
    },
    submitForm() {
      if (this.diaLogMode == "add") {
        this.fatherAddInfoSubmit(this.form);
      } else if (this.diaLogMode == "edit") {
        this.fatherEditInfoSubmit(this.form2);
      }
    },
    resetForm() {
      if (this.diaLogMode == "add") {
        this.fatherResetAddForm();
      } else if (this.diaLogMode == "edit") {
        this.fatherResetEditForm();
      }
    },
    initPage() {
      var temp = Cookies.get("CourseStudentManage");
      var row = {};

      row = JSON.parse(temp);
      //console.log(row);
      
      this.infoUrl = "/system/course/student?courseId=" + row.id;
      this.getCourseStudentInfo(row.id);
    }
  },
  activated() {
    this.initPage();
    this.initForm();
  }
};
</script>

<style>
</style>
