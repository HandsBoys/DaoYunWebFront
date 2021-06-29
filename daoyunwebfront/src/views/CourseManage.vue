<template>
  <div id="CourseManage" v-if="ifshow">
    <v-table
      :tData="tableData"
      :tCols="cols"
      :sLabel="searchLabel"
      :infoUrl="infoUrl"
      :ifShow="true"
      :ifEdit="true"
      :ifDelete="true"
      rKey="id"
      :ifTwoBtn="true"
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
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="form.courseName" placeholder="请输入课程名称"/>
          </el-form-item>
          <el-form-item label="学期" prop="term">
            <el-input v-model="form.term" placeholder="请输入学期"/>
          </el-form-item>
          <el-form-item label="班级" prop="className">
            <el-input v-model="form.className" placeholder="请输入班级"/>
          </el-form-item>
          <el-form-item label="学校" prop="university">
            <el-select
              v-model="form.universityId"
              placeholder="请选择"
              @change="getCollegeOption"
              clearable
            >
              <el-option
                v-for="uni in universityOptions"
                :key="uni.id"
                :label="uni.deptName"
                :value="uni.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院" prop="college">
            <el-select
              v-model="form.collegeId"
              placeholder="请选择"
              @change="getSubjectOption"
              clearable
            >
              <el-option
                v-for="col in collegeOptions"
                :key="col.id"
                :label="col.deptName"
                :value="col.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业" prop="subject">
            <el-select v-model="form.subjectId" placeholder="请选择" clearable>
              <el-option
                v-for="sub in subjectOptions"
                :key="sub.id"
                :label="sub.deptName"
                :value="sub.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="enableJoin">
            <el-radio-group v-model="form.enableJoin">
              <el-radio
                v-for="joinStatus in statusOptions"
                :key="joinStatus.joinValue"
                :label="joinStatus.joinValue"
              >{{joinStatus.joinLabel}}</el-radio>
            </el-radio-group>
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
  getCourseInfoListApi,
  addCourseInfoApi,
  editCourseInfoApi,
  deleteCourseInfoApi,
  getDeptInfoListForUserApi
} from "@/api/api";

import Cookies from "js-cookie";

export default {
  name: "CourseManage",
  components: {
    vTable
  },
  created() {
    this.getCourseInfo();
    this.initForm();
    this.getUniversityOption();
  },
  data() {
    return {
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "courseName", label: "课程名称" },
        { prop: "term", label: "学期" },
        { prop: "teacherName", label: "教师" },
        { prop: "className", label: "班级" },
        { prop: "enableJoin", label: "状态" }
      ],
      searchLabel: "课程名称",

      infoUrl: "/system/course", //获取列表的URL
      detailMesUrl: "CourseStudentManage", //查看信息URL

      open: false,
      reFresh: true,
      diaLogMode: "",
      statusOptions: [
        //从数据字典中获取，暂时写死
        { joinValue: true, joinLabel: "可加入" },
        { joinValue: false, joinLabel: "不可加入" }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        courseName: [
          { required: true, message: "课程名称不能为空", trigger: "blur" }
        ],
        term: [{ required: true, message: "学期不能为空", trigger: "blur" }],
        className: [
          { required: true, message: "班级不能为空", trigger: "blur" }
        ]
      },
      title: "",
      editRow: [],
      universityOptions: [],
      collegeOptions: [],
      subjectOptions: []
    };
  },
  methods: {
    //从后台获取表格内的信息
    getCourseInfo() {
      var _this = this;
      getCourseInfoListApi()
        .then(function(response) {
          //console.log(response);
          _this.tableData = response.data.data;
          for (var i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i]["className"] =
              _this.tableData[i]["classDto"]["className"];
            _this.tableData[i]["enableJoin"] = _this.tableData[i]["enableJoin"]
              ? "可加入"
              : "不可加入";
            _this.tableData[i]["teacherName"] =
              _this.tableData[i]["teacher"] == null
                ? null
                : _this.tableData[i]["teacher"]["nickName"];
          }

          _this.ifshow = true;
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

      var tempform = new Object();
      tempform.id = formData["id"];
      tempform.courseName = formData["courseName"];
      tempform.term = formData["term"];

      tempform.enableJoin = formData["enableJoin"];
      tempform.finish = false;
      var classDto = new Object();
      classDto.className = formData["className"];
      tempform.classDto = classDto;
      var teacher = null;
      tempform.teacher = teacher;
      tempform.universityId = formData["universityId"];
      tempform.collegeId = formData["collegeId"];
      tempform.subjectId = formData["subjectId"];

      //console.log(formData);
      //console.log(tempform);

      addCourseInfoApi(tempform)
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
    },
    //点击修改按钮，弹出修改弹窗
    fatherEditInfo(row) {
      this.open = true;
      this.editRow = row;
      this.title = "修改";
      this.diaLogMode = "edit";
      //console.log(row);
      var tempEnableJoin = row["enableJoin"] == "可加入" ? true : false;
      this.getCollegeOption(row["universityId"]);
      this.getSubjectOption(row["collegeId"]);
      this.form = {
        id: row["id"],
        courseName: row["courseName"],
        term: row["term"],
        className: row["className"],
        classId: row["classDto"]["id"],
        enableJoin: tempEnableJoin,
        finish: row["finish"],
        universityId: row["universityId"],
        collegeId: row["collegeId"],
        subjectId: row["subjectId"]
      };
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          var tempform = new Object();
          tempform.id = formData["id"];
          tempform.courseName = formData["courseName"];
          tempform.term = formData["term"];

          tempform.enableJoin = formData["enableJoin"];
          tempform.finish = false;
          var classDto = new Object();
          classDto.id = formData["classId"];
          classDto.className = formData["className"];
          tempform.classDto = classDto;
          var teacher = null;
          tempform.teacher = teacher;
          tempform.universityId = formData["universityId"];
          tempform.collegeId = formData["collegeId"];
          tempform.subjectId = formData["subjectId"];
          //console.log(tempform);
          //console.log(formData);
          editCourseInfoApi(tempform)
            .then(function(response) {
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
      var tempEnableJoin = this.editRow["enableJoin"] == "可加入" ? true : false;
      this.getCollegeOption(this.editRow["universityId"]);
      this.getSubjectOption(this.editRow["collegeId"]);

      this.form = {
        id: this.editRow["id"],
        courseName: this.editRow["courseName"],
        term: this.editRow["term"],
        className: this.editRow["className"],
        classId: this.editRow["classDto"]["id"],
        enableJoin: tempEnableJoin,
        finish: this.editRow["finish"],
        universityId: this.editRow["universityId"],
        collegeId: this.editRow["collegeId"],
        subjectId: this.editRow["subjectId"]
      };
    },
    //关闭新增和修改弹窗
    handleClose() {
      this.open = false;
      this.initForm();
    },
    //删除和批量删除函数
    fatherDeleteInfo(formData) {
      var idForAllDel = "";
      for (let i = 0; i < formData.length; i++) {
        if (i == formData.length - 1) {
          idForAllDel = idForAllDel + formData[i].id;
        } else {
          idForAllDel = idForAllDel + formData[i].id + ", ";
        }
      }
      //console.log(idForAllDel);

      //二次确认删除;
      var _this = this;

      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteCourseInfoApi(idForAllDel)
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
              } else {
                _this.$message.error("删除失败");
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
        id: undefined,
        courseName: undefined,
        term: undefined,
        className: undefined,
        enableJoin: true,
        finish: false,
        universityId: undefined,
        collegeId: undefined,
        subjectId: undefined
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
        this.fatherEditInfoSubmit(this.form);
      }
    },
    resetForm() {
      if (this.diaLogMode == "add") {
        this.fatherResetAddForm();
      } else if (this.diaLogMode == "edit") {
        this.fatherResetEditForm();
      }
    },
    //点击查看信息按钮触发
    fatherShowMes(row) {
      //路由跳转，将row传递到查看信息界面
      Cookies.set(this.detailMesUrl, row, {
        expires: 30
      });
      this.$router.push({
        path: this.detailMesUrl
      });
    },
    //获取学校下拉选择框
    getUniversityOption(parentId) {
      var _this = this;
      parentId = parentId || 0;
      getDeptInfoListForUserApi(parentId).then(function(response) {
        _this.universityOptions = response.data.data;
        //console.log(_this.universityOptions);
      });
    },
    //获取学院下拉选择框
    getCollegeOption(parentId) {
      var _this = this;
      this.form["collegeId"] = undefined;
      this.form["subjectId"] = undefined;
      this.collegeOptions = [];
      this.subjectOptions = [];
      if (parentId != undefined) {
        getDeptInfoListForUserApi(parentId).then(function(response) {
          _this.collegeOptions = response.data.data;
        });
      }
    },
    //获取专业下拉选择框
    getSubjectOption(parentId) {
      var _this = this;
      this.form["subjectId"] = undefined;
      this.subjectOptions = [];
      if (parentId != undefined) {
        getDeptInfoListForUserApi(parentId).then(function(response) {
          _this.subjectOptions = response.data.data;
        });
      }
    }
  }
};
</script>

<style>
</style>
