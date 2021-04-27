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
export default {
  name: "CurrForm",
  props: ["fContent", "fRules", "mType"],
  data() {
    return {
      dynamicValidateForm: {},
      formContent: [],
      rules: [],
      methodType: "",
      id: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.formContent = this.fContent;
      // this.tempContent = JSON.parse(JSON.stringify(this.formContent));
      this.rules = this.fRules;
      this.methodType = this.mType;
    },
    resetForm() {
      //调用父组件的重置函数进行提交
      if (this.methodType == "add") {
        this.$parent.$parent.fatherResetAddForm();
      } else if (this.methodType == "edit") {
        this.$parent.$parent.fatherResetEditForm();
      }
    },
    submitForm() {
      //console.log(this.$parent.$parent);
      //调用父组件的提交函数进行提交
      console.log(this.methodType);
      if (this.methodType == "add") {
        console.log(this.formContent);
        this.$parent.$parent.fatherAddInfoSubmit(this.formContent);
      } else if (this.methodType == "edit") {
        this.$parent.$parent.fatherEditInfoSubmit(this.formContent);
      }
    }
  }
};
</script>

<style scoped>
</style>
