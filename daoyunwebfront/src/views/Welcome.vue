<template>
  <div>
    <img src="../assets/img/welcome.gif" alt="welcome.gif">
  </div>
</template>

<script>
import bus from "../api/bus";
import { routerToLogin } from "@/utils/routerGuard";
export default {
  name: "Welcome",
  created() {
    var bo = routerToLogin();
    if (bo) {
      this.$router.push({
        path: "Login2"
      });
    }
  }
};
</script>

<style>
</style>
