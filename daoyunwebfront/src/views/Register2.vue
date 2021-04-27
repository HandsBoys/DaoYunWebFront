<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">注册到云新账号</h3>
      <div>
        <el-form-item prop="phone">
          <el-input
            ref="inputPhone"
            v-model="registerForm.phone"
            prefix-icon="el-icon-login-user"
            type="text"
            auto-complete="off"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            prefix-icon="el-icon-login-password"
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
            v-if="updateDrag"
          ></drag-verify>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="registerForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            prefix-icon="el-icon-login-validCode"
            @keyup.enter.native="handleRegister"
          ></el-input>
          <div class="register-mesCode">
            <el-button
              type="primary"
              plain
              :disabled="btnChangeEnable"
              @click="getMessCode"
            >{{btntxt}}</el-button>
          </div>
        </el-form-item>
      </div>
      <el-form-item>
        <el-checkbox v-model="registerForm.rememberMe" style="margin:0px 0px 25px 0px;">我已阅读并同意</el-checkbox>
        <el-link type="primary">《用户协议》</el-link>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleRegister"
        >
          <span>注 册</span>
        </el-button>
      </el-form-item>
      <el-link class="reLoginLink" @click="toLogin()">返回登录</el-link>
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
import { registerApi, getMessCodeApi } from "@/api/api";
import { encrypt, decrypt } from "@/utils/jsencrypt";
export default {
  name: "Register2",
  components: {
    dragVerify
  },
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      registerForm: {
        phone: "",
        password: "",
        rememberMe: false,
        code: ""
      },
      registerRules: {
        phone: [{ required: true, trigger: "blur", message: "手机号不能为空" }],
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
      time: 0,
      btntxt: "获取验证码",

      updateDrag: true
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
  },
  methods: {
    // 滑动完成消失
    passcallback() {
      if (this.$refs.Verify.isPassing) {
        this.btnChangeEnable = false;
      }
    },
    toLogin() {
      this.$router.push({ path: "Login2" });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          //console.log("dd");
          const _this = this;

          if (this.registerForm.rememberMe == false) {
            this.$message.error("注册需同意用户协议");
          } else {
            //加密密码
            var encryptPass = encrypt(this.registerForm.password);

            registerApi(
              this.registerForm.password,
              this.registerForm.phone,
              this.registerForm.code,
              this.registerForm.phone
            )
              .then(function(response) {
                console.log(response);
                if (response.data.code == "200") {
                  _this.$message.success("注册成功");
                  _this.toLogin();
                  // });
                } else {
                  _this.$message.error("注册失败");
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        }
      });
    },
    getMessCode() {
      //发送短信前先校验手机号是否合法
      var testPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      var _this = this;
      if (this.registerForm.phone == "") {
        this.$message.error("请输入手机号");
      } else if (!testPhone.test(this.registerForm.phone)) {
        this.$message.error("手机号格式错误，请重新输入");
      } else {
        console.log(this.registerForm.phone);
        getMessCodeApi(this.registerForm.phone)
          .then(function(response) {
            if (response.data.code == "200") {
              _this.$message.success("短信发送成功");
            } else {
              _this.$message.error("短信发送失败");
            }
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      //开始计时，35s后获取验证码按钮才可按
      this.time = 35;
      this.btnChangeEnable = true;
      this.timer();
    },
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + "s,后重新获取验证码";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = "获取验证码";

        this.updateDrag = false;

        this.$nextTick(() => {
          this.updateDrag = true;
        });
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
