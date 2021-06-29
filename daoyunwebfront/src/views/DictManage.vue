<template>
  <div id="DictManage" v-if="ifshow">
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
      <!-- 添加或修改参数配置对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="45%"
        append-to-body
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="reFresh">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="form.dictName" placeholder="请输入字典名称"/>
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="form.dictType" placeholder="请输入字典类型" :disabled="ifInputDictType"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="字典明细" prop="detail">
            <el-button type="primary" @click="addFormItem">添加明细</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="dictData"
          style="width: 100%"
          class="dictDataTable"
          row-key="id"
          v-if="reFresh3"
        >
          <el-table-column
            v-for="(item, index) in col"
            :key="`col_${index}`"
            :prop="dropCol[index].prop"
            :label="item.label"
          ></el-table-column>
          <el-table-column label="操作" prop="option">
            <template slot-scope="scope">
              <el-button type="primary" @click="editDictData(scope.row)" icon="el-icon-edit" circle></el-button>
              <el-button
                type="danger"
                @click="deleteDictData(scope.row)"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        :title="title2"
        :visible.sync="open2"
        width="45%"
        append-to-body
        :before-close="handleClose2"
      >
        <el-form ref="form2" :model="form2" :rules="rules2" label-width="80px" v-if="reFresh2">
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input v-model="form2.dictLabel" placeholder="请输入字典标签"/>
          </el-form-item>
          <el-form-item label="字典键值" prop="dictValue">
            <el-input v-model="form2.dictValue" placeholder="请输入字典键值"/>
          </el-form-item>
          <el-form-item label="是否默认" prop="default">
            <el-radio-group v-model="form2.isDefault">
              <el-radio :key="0" :label="0">否</el-radio>
              <el-radio :key="1" :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form2.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form2.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm2">保 存</el-button>
          <el-button @click="resetForm2">重 置</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 新建弹出框 -->
    <!-- <el-dialog title="新增" :visible.sync="addVisible" width="30%" :before-close="handleClose">
      <v-form :fContent="formContent" :fRules="formRules" mType="add"></v-form>
    </el-dialog>-->

    <!-- 修改弹出框 -->
    <!-- <el-dialog title="修改" :visible.sync="editVisible" width="30%" :before-close="handleClose">
      <v-form :fContent="formContent" :fRules="formRules" mType="edit"></v-form>
    </el-dialog>-->
  </div>
</template>

<script>
import Sortable from "sortablejs";
import vTable from "../components/CurrTable.vue";
import {
  getDictInfoListApi,
  addDictInfoApi,
  editDictInfoApi,
  deleteDictInfoApi,
  ifDictValueRepeat,
  addDictDataInfoApi,
  getDictDataInfoListApi,
  editDictDataInfoApi,
  deleteDictDataInfoApi
} from "@/api/api";

import Cookies from "js-cookie";

export default {
  name: "DictManage",
  components: {
    vTable
  },
  created() {
    this.getDictInfo();
    this.initForm();
  },
  data() {
    var validateDictValue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("字典键值不能为空"));
      } else {
        var _this = this;
        ifDictValueRepeat(this.form.dictType, this.form2.dictValue).then(
          function(response) {
            //console.log(response);
            if (response.data == false) {
              return callback(new Error("字典键值重复"));
            } else {
              for (var i = 0; i < _this.dictData.length; i++) {
                if (_this.dictData[i].dictValue == _this.form2.dictValue) {
                  return callback(new Error("字典键值重复"));
                }
              }
              callback();
            }
          }
        );
      }
    };

    return {
      ifshow: false,
      tableData: [],
      cols: [
        { prop: "dictName", label: "字典名称" },
        { prop: "dictType", label: "字典类型" },
        { prop: "status", label: "状态" },
        { prop: "remark", label: "备注" }
      ],
      searchLabel: "字典名称",

      formContent: {
        // dictId: undefined,
        id: undefined,
        dictName: undefined,
        dictType: undefined,
        status: 0,
        remark: undefined
      },

      infoUrl: "/system/dicttype", //获取列表的URL
      detailMesUrl: "DictDataManage", //查看信息URL

      open: false,
      reFresh: true,
      diaLogMode: "",
      statusOptions: [
        //从数据字典中获取，暂时写死
        { dictValue: 0, dictLabel: "正常" },
        { dictValue: 1, dictLabel: "停用" }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      title: "",
      editRow: [],
      ifInputDictType: false,

      open2: false,
      form2: {},
      tempForm2: {},
      rules2: {
        dictLabel: [
          { required: true, message: "字典标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, validator: validateDictValue, trigger: "blur" }
        ]
      },
      statusOptions: [
        //从数据字典中获取，暂时写死
        { dictValue: 0, dictLabel: "正常" },
        { dictValue: 1, dictLabel: "停用" }
      ],
      reFresh2: true,
      dictData: [],
      tempDictData: [],
      col: [
        {
          label: "字典标签",
          prop: "dictLabel"
        },
        {
          label: "字典键值",
          prop: "dictValue"
        },
        {
          label: "默认",
          prop: "isDefault"
        },
        {
          label: "状态",
          prop: "status"
        }
      ],
      dropCol: [
        {
          label: "字典标签",
          prop: "dictLabel"
        },
        {
          label: "字典键值",
          prop: "dictValue"
        },
        {
          label: "默认",
          prop: "isDefault"
        },
        {
          label: "状态",
          prop: "status"
        }
      ],
      title2: "",
      drawBodyWrapper: "",
      reFresh3: true
    };
  },
  methods: {
    //从后台获取表格内的信息
    getDictInfo() {
      var _this = this;
      getDictInfoListApi()
        .then(function(response) {
          // console.log(response);
          _this.tableData = response.data.data;
          //暂时这样写
          for (var i = 0; i < _this.tableData.length; i++) {
            if (_this.tableData[i]["status"] == false) {
              _this.tableData[i]["status"] = "正常";
            } else {
              _this.tableData[i]["status"] = "停用";
            }
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
      this.ifInputDictType = false;

      this.$nextTick(() => {
        this.drawBodyWrapper = document.querySelector(".el-dialog__body tbody"); //找element的标签
        this.rowDrop();
      });
    },
    //将新增的数据传入后台，完成新增
    fatherAddInfoSubmit(formData) {
      var _this = this;

      this.$refs.form.validate(valid => {
        if (valid) {
          addDictInfoApi(formData)
            .then(function(response) {
              //console.log(response);
              if (response.data.code == "200") {
                //新增字典数据
                var len = _this.dictData.length;
                for (var i = 0; i < len; i++) {
                  _this.dictData[i].dictSort = i;
                  _this.dictData[i].dictType = formData.dictType;
                  addDictDataInfoApi(_this.dictData[i]);
                }
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
    //点击修改按钮，弹出修改弹窗
    fatherEditInfo(row) {
      this.open = true;
      this.editRow = row;

      this.title = "修改";
      this.diaLogMode = "edit";
      this.ifInputDictType = true;

      var tempStatus = 0;
      //暂时这样写
      if (row["status"] == "正常") {
        tempStatus = 0;
      } else {
        tempStatus = 1;
      }

      this.form = {
        // dictId: row["dictId"],
        id: row["id"],
        dictName: row["dictName"],
        dictType: row["dictType"],
        status: tempStatus,
        remark: row["remark"]
      };
      var _this = this;
      var dictType = {};
      dictType["dictType"] = row.dictType;
      getDictDataInfoListApi(dictType).then(function(response) {
        //console.log(response);
        _this.dictData = response.data.data;
        for (var i = 0; i < _this.dictData.length; i++) {
          _this.dictData[i].isDefault = _this.dictData[i].isDefault ? 1 : 0;
          _this.dictData[i].status = _this.dictData[i].status ? 1 : 0;
        }
        _this.tempDictData = _this.dictData.concat();
      });

      this.$nextTick(() => {
        this.drawBodyWrapper = document.querySelector(".el-dialog__body tbody"); //找element的标签
        this.rowDrop();
      });
    },
    //将修改的数据传入后台，完成修改
    fatherEditInfoSubmit(formData) {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          editDictInfoApi(formData)
            .then(function(response) {
              //console.log(response);
              if (response.data.code == "200") {
                var len = _this.dictData.length;
                
                for(var i=0; i<_this.tempDictData.length; i++) {
                  deleteDictDataInfoApi(_this.tempDictData[i].id);
                }

                for (var i = 0; i < len; i++) {
                  _this.dictData[i].dictSort = i;
                  _this.dictData[i].dictType = formData.dictType;
                  addDictDataInfoApi(_this.dictData[i]);
                }

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
      this.form = {
        // dictId: undefined,
        id: undefined,
        dictName: undefined,
        dictType: undefined,
        status: 0,
        remark: undefined
      };
      this.dictData = [];
    },
    //重置修改表单
    fatherResetEditForm() {
      var tempStatus = 0;
      if (this.editRow["status"] == "正常") {
        tempStatus = 0;
      } else {
        tempStatus = 1;
      }
      this.form = {
        id: this.editRow["id"],
        dictName: this.editRow["dictName"],
        dictType: this.editRow["dictType"],
        status: tempStatus,
        remark: this.editRow["remark"]
      };

      this.dictData = [];
      //console.log(this.tempDictData);
      this.dictData = this.tempDictData.concat();
    },
    //关闭新增和修改弹窗
    handleClose() {
      //console.log("handleClose()");
      this.open = false;
      this.dictData = [];
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
          deleteDictInfoApi(idForAllDel)
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
    //初始化表单
    initForm() {
      this.form = {
        id: undefined,
        dictName: undefined,
        dictType: undefined,
        status: 0,
        remark: undefined
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
    addFormItem() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.initForm2();
          this.open2 = true;
          this.title2 = "添加字典明細";
        }
      });
    },
    initForm2() {
      this.form2 = {
        id: undefined,
        dictType: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        dictSort: 0,
        isDefault: 0,
        status: 0,
        remark: undefined
      };
      this.reFresh2 = false;
      this.$nextTick(() => {
        this.reFresh2 = true;
      });
    },
    submitForm2() {
      if (this.title2 == "添加字典明細") {
        this.$refs.form2.validate(valid => {
          if (valid) {
            //this.form2.dictType = this.form.dictType;
            if (this.form2.isDefault == 1) {
              for (var i = 0; i < this.dictData.length; i++) {
                this.dictData[i].isDefault = 0;
              }
            }
            this.dictData.push(this.form2);
            this.handleClose2();
            this.$message.success("保存成功");
          }
        });
      } else {
        if (this.form2.dictLabel != "" && this.form2.dictValue != "") {
          var bo = true;
          var _this = this;
          if (this.form2.dictValue != this.tempForm2.dictValue) {
            ifDictValueRepeat(this.form.dictType, this.form2.dictValue).then(
              function(response) {
                bo = response.data;
                if (bo == true) {
                  _this.funcForsubmitForm2Edit();
                }
              }
            );
          } else {
            this.funcForsubmitForm2Edit();
          }
        }
      }
    },
    funcForsubmitForm2Edit() {
      var ifUpdateDefeat = 0;
      for (var i = 0; i < this.dictData.length; i++) {
        if (this.dictData[i].id == this.form2.id) {
          this.dictData[i] = this.form2;
          if (this.dictData[i].isDefault == 1) {
            ifUpdateDefeat = 1;
          }
          break;
        }
      }
      if (ifUpdateDefeat == 1) {
        for (var i = 0; i < this.dictData.length; i++) {
          if (this.dictData[i].id != this.form2.id) {
            this.dictData[i].isDefault = 0;
          }
        }
      }

      this.reFresh3 = false;
      this.$nextTick(() => {
        this.reFresh3 = true;
      });
      this.handleClose2();
      this.$message.success("保存成功");
    },
    resetForm2() {
      if (this.title2 == "添加字典明細") {
        this.initForm2();
      } else {
        this.form2 = {
          id: this.tempForm2.id,
          dictType: this.tempForm2.dictType,
          dictLabel: this.tempForm2.dictLabel,
          dictValue: this.tempForm2.dictValue,
          dictSort: this.tempForm2.dictSort,
          isDefault: this.tempForm2.isDefault,
          status: this.tempForm2.status,
          remark: this.tempForm2.remark
        };
      }
    },
    handleClose2() {
      this.open2 = false;
      this.initForm2();
    },
    //行拖拽
    rowDrop() {
      const tbody = this.drawBodyWrapper;
      const _this = this;
      // console.log(tbody);
      Sortable.create(tbody, {
        // 官网上的配置项,加到这里面来,可以实现各种效果和功能
        animation: 150,
        ghostClass: "blue-background-class",
        onEnd({ newIndex, oldIndex }) {
          //console.log(newIndex, oldIndex);
          const currRow = _this.dictData.splice(oldIndex, 1)[0];
          //console.log(currRow);
          _this.dictData.splice(newIndex, 0, currRow);
          //console.log(_this.dictData);
        }
      });
    },
    editDictData(row) {
      //this.form2 = row;
      this.tempForm2 = row;
      this.form2 = {
        id: row.id,
        dictType: row.dictType,
        dictLabel: row.dictLabel,
        dictValue: row.dictValue,
        dictSort: row.dictSort,
        isDefault: row.isDefault,
        status: row.status,
        remark: row.remark
      };
      this.open2 = true;
      this.title2 = "修改字典明細";
    },
    deleteDictData(row) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        for (var i = 0; i < this.dictData.length; i++) {
          if (this.dictData[i].id == row.id) {
            this.dictData.splice(i, 1);
            break;
          }
        }
      });
    }
  }
};
</script>

<style>
</style>
