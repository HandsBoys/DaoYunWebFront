<template>
  <div>
    <el-form :model="dynamicValidateForm" label-width="120px" ref="dynamicValidateForm">
      <el-form-item
        :key="domain.prop"
        :label="domain.label"
        :prop="domain.prop"
        :rules="rules"
        v-for="domain in formContent"
      >
        <el-input type="money" autocomplete="off" v-model.number="domain.value"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CurrForm",
  props: ["fContent", "fRules"],
  data() {
    return {
      dynamicValidateForm: {},
      formContent: [],
      rules: [],
      id: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.formContent = this.fContent;
      this.rules = this.fRules;
      console.log(this.dynamicValidateForm)
    }
  }
};
</script>

<style>
</style>
