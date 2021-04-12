<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <el-form-item>
        <el-steps :active="resetSteps" align-center>
          <el-step title="身份验证"></el-step>
          <el-step title="密码重置"></el-step>
          <el-step title="重置完成"></el-step>
        </el-steps>
      </el-form-item>
      <div v-if="resetSteps==0">
        <el-form-item prop="username">
          <el-input
            ref="inputPhone"
            v-model="registerForm.username"
            prefix-icon="el-icon-login-user"
            type="text"
            auto-complete="off"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <drag-verify
            @passcallback="passcallback"
            :width="width"
            :height="height"
            :text="text"
            :success-text="successText"
            :background="background"
            :progress-bar-bg="progressBarBg"
            :completed-bg="completedBg"
            :handler-bg="handlerBg"
            :handler-icon="handlerIcon"
            :text-size="textSize"
            :success-icon="successIcon"
            ref="Verify"
          ></drag-verify>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="registerForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            prefix-icon="el-icon-login-validCode"
          ></el-input>
          <div class="register-mesCode">
            <el-button type="primary" plain :disabled="btnChangeEnable">获取验证码</el-button>
          </div>
        </el-form-item>
      </div>
      <div v-if="resetSteps==1">
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            auto-complete="off"
            placeholder="新密码"
            prefix-icon="el-icon-login-password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            auto-complete="off"
            placeholder="确认密码"
            prefix-icon="el-icon-login-password"
          ></el-input>
        </el-form-item>
      </div>
      <div v-if="resetSteps==2"><h3 class="title">密码重置完成</h3></div>
      <el-form-item style="width:100%;">
        <el-button size="medium" type="primary" style="width:100%;" @click="next">
          <span>{{butLabel}}</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>2021福州大学工程实践课“到云”项目</span>
    </div>
  </div>
</template>

<script>
import "font-awesome/css/font-awesome.min.css";
import dragVerify from "vue-drag-verify";

export default {
  name: "ForgetPassword2",
  components: {
    dragVerify
  },
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      registerForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      registerRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      redirect: undefined,
      show: true,

      handlerIcon: "fa fa-angle-double-right",
      successIcon: "fa fa-check",
      background: "#cccccc",
      progressBarBg: "#4b0",
      completedBg: "#66cc66",
      handlerBg: "#fff",
      text: "请将滑块拖动到右侧",
      successText: "验证成功",
      width: 400,
      height: 42,
      textSize: "18px",
      isCircle: "false",

      btnChangeEnable: true,
      resetSteps: 0,
      butLabel: "下一步"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // this.getCode();
    // this.getCookie();
  },
  methods: {
    // 滑动完成消失
    passcallback() {
      if (this.$refs.Verify.isPassing) {
        this.btnChangeEnable = false;
      }
    },
    next() {
      this.resetSteps++;
      if (this.resetSteps >= 2) {
        this.butLabel = "完成";
      } else {
        this.butLabel = "下一步";
      }
      if (this.resetSteps > 2) {
        this.$router.push({ path: "Login2" });
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/img/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-mesCode {
  width: 30%;
  height: 40px;
  float: right;
}
.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

/* 添加用户名密码小图标 */
.el-icon-login-user {
  background: url(../assets/img/user.png) center no-repeat;
  background-size: contain;
}
.el-icon-login-user:before {
  content: "\66ff";
  font-size: 16px;
  visibility: hidden;
}
.el-icon-login-password {
  background: url(../assets/img/password.png) center no-repeat;
  background-size: contain;
}
.el-icon-login-password:before {
  content: "替";
  font-size: 16px;
  visibility: hidden;
}
.el-icon-login-validCode {
  background: url(../assets/img/validCode.png) center no-repeat;
  background-size: contain;
}
.el-icon-login-validCode:before {
  content: "\66ff";
  font-size: 16px;
  visibility: hidden;
}
.el-input__prefix {
  left: 10px;
}
.el-input--prefix .el-input__inner {
  padding-left: 40px;
}

.reLoginLink {
  margin-left: 73%;
}
</style>
