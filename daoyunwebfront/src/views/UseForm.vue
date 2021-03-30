<template>
  <div>
    <v-form :fContent="formContent" :fRules="formRules"></v-form>
  </div>
</template>

<script>
import vForm from "../components/CurrForm.vue";
export default {
  name: "UseForm",
  components: {
    vForm
  },
  data() {
    return {
      formContent: [
        { prop: "name", label: "姓名", value: "" },
        { prop: "password", label: "密码", value: "" }
      ],
      formRules: []
    };
  }
};
</script>

<style>
</style>
