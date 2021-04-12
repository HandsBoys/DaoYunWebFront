<template>
  <div>
    <el-form label-width="80px" :model="dynamicValidateForm" ref="dynamicValidateForm">
      <el-form-item
        :key="domain.prop"
        :label="domain.label"
        :prop="domain.prop"
        :rules="rules"
        v-for="domain in formContent"
      >
        <el-input
          type="money"
          autocomplete="off"
          v-model.number="domain.value"
          :disabled="domain.disable"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from "../utils/http";
import request from "../utils/request";
export default {
  name: "CurrForm",
  props: ["fContent", "fRules", "subUrl"],
  data() {
    return {
      dynamicValidateForm: {},
      formContent: [],
      tempContent: [],
      rules: [],
      id: "",
      subURL: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.formContent = this.fContent;
      this.tempContent = JSON.parse(JSON.stringify(this.formContent));
      this.rules = this.fRules;
      this.subURL = this.subUrl;
    },
    resetForm() {
      this.formContent = JSON.parse(JSON.stringify(this.tempContent));
      // for (let i = 0; i < this.formContent.length; i++) {
      //   this.formContent[i].value = "";
      // }
    },
    submitForm() {
      //将数据存入后台，若成功为true,失败为false
      console.log(this.subURL);
      var data = {};
      var _this = this;
      for (var i = 0; i < this.formContent.length; i++) {
        data[this.formContent[i].prop] = this.formContent[i].value;
      }
      // console.log(data);
      const config = {
        method: "post",
        url: this.subURL,
        data: data
      };

      request(config)
        .then(function(response) {
          console.log(response);
          //若成功，返回this.$emit("ifSub", true);，否则，返回this.$emit("ifSub", false);
          if (response.data.code == "200") {
            _this.$emit("ifSub", true);
          } else {
            _this.$emit("ifSub", false);
          }
        })
        .catch(function(error) {
          this.$emit("ifSub", false);
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
</style>
