<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">到云后台管理系统</h3>
      <div v-if="loginMode=='1'">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-login-user"
            type="text"
            auto-complete="off"
            placeholder="账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            prefix-icon="el-icon-login-password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            prefix-icon="el-icon-login-validCode"
            @keyup.enter.native="handleLogin"
          ></el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img">
          </div>
        </el-form-item>
      </div>
      <div v-if="loginMode=='2'">
        <el-form-item prop="username">
          <el-input
            ref="inputPhone"
            v-model="loginForm.username"
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
            v-if="updateDrag"
          ></drag-verify>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            prefix-icon="el-icon-login-validCode"
            @keyup.enter.native="handleLogin"
          ></el-input>
          <div class="login-mesCode">
            <el-button
              type="primary"
              plain
              :disabled="btnChangeEnable"
              @click="getMessCode"
            >{{btntxt}}</el-button>
          </div>
        </el-form-item>
      </div>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">{{RememberLabel}}</el-checkbox>
      <el-link @click="changeMode()" class="lMode">{{ModeLabel}}</el-link>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
      <el-link class="forPassLink" @click="toForPass()">忘记密码</el-link>
      <el-link class="registerLink" @click="toRegister()">注册</el-link>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>2021福州大学工程实践课“到云”项目</span>
    </div>
  </div>
</template>

<script>
import "font-awesome/css/font-awesome.min.css";
import dragVerify from "vue-drag-verify";
import { loginApi, login2Api, getCodeImgApi, getMessCodeApi } from "@/api/api";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import Cookies from "js-cookie";
import { setToken } from "@/utils/auth";
export default {
  name: "Login2",
  components: {
    dragVerify
  },
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginMode: "1",
      ModeLabel: "短信登录",
      RememberLabel: "记住密码",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
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
    this.getCode();
    this.getCookie();
  },
  methods: {
    changeMode() {
      if (this.loginMode == "1") {
        this.loginMode = "2";
        this.ModeLabel = "密码登录";
        this.RememberLabel = "记住手机号";
      } else if (this.loginMode == "2") {
        this.loginMode = "1";
        this.ModeLabel = "短信登录";
        this.RememberLabel = "记住密码";
      }
    },
    // 滑动完成消失
    passcallback() {
      if (this.$refs.Verify.isPassing) {
        this.btnChangeEnable = false;
      }
    },
    //点击注册跳转到注册界面
    toRegister() {
      this.$router.push({ path: "Register2" });
    },
    toForPass() {
      this.$router.push({ path: "ForgetPassword2" });
    },
    handleLogin() {
      var testEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      var testPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      var testPassword = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/; /*密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符 */
      const _this = this;

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.loginMode == "1") {
            if (
              !testEmail.test(this.loginForm.username) &&
              !testPhone.test(this.loginForm.username)
            ) {
              this.$message.error("账号格式不正确，请重新输入");
            } else if (!testPassword.test(this.loginForm.password)) {
              this.$message.error("密码格式不正确，请重新输入");
            } else if (this.loginForm.code.length < 5) {
              //demo
              this.$message.error("验证码格式不正确，请重新输入");
            } else {
              this.loading = true;
              //加密密码
              var encryptPass = encrypt(this.loginForm.password);
              //连接后台判断账号密码，正确登入且设置token，错误提示
              loginApi(
                this.loginForm.password,
                this.loginForm.username,
                this.loginForm.code
              )
                .then(function(response) {
                  console.log(response);
                  if (response.data.code == "200") {
                    //设置token
                    setToken(response.data.data.token);

                    //将用户名存入sessionStorage
                    sessionStorage.setItem(
                      "username",
                      _this.loginForm.username
                    );

                    //若点了记住密码，存储cookie
                    if (_this.loginForm.rememberMe) {
                      Cookies.set("username", _this.loginForm.username, {
                        expires: 30
                      });
                      Cookies.set("password", encryptPass, {
                        expires: 30
                      });
                      Cookies.set("rememberMe", _this.loginForm.rememberMe, {
                        expires: 30
                      });
                    } else {
                      Cookies.remove("username");
                      Cookies.remove("password");
                      Cookies.remove("rememberMe");
                    }

                    //参数管理
                    //设置侧边栏颜色  后期改为从数据库读取
                    //为了参数管理新增的设置   从数据库中读出参数数据，使用$store赋值

                    _this.$router.push({
                      path: "Welcome"
                    });
                  } else {
                    //_this.$message.error("用户名或密码错误");
                    _this.$message.error(response.data.msg);
                    _this.loading = false;
                    _this.getCode();
                  }
                })
                .catch(function(error) {
                  _this.loading = false;
                  _this.getCode();
                  console.log(error);
                });
            }
          } else if (this.loginMode == "2") {
            this.loading = true;
            login2Api(this.loginForm.code, this.loginForm.username)
              .then(function(response) {
                console.log(response);
                if (response.data.code == "200") {
                  //设置token
                  setToken(response.data.data.token);
                  //将用户名存入sessionStorage
                  sessionStorage.setItem("username", _this.loginForm.username);

                  //若点了记住手机号，存储cookie
                  if (_this.loginForm.rememberMe) {
                    Cookies.set("username", _this.loginForm.username, {
                      expires: 30
                    });
                    Cookies.set("rememberMe", _this.loginForm.rememberMe, {
                      expires: 30
                    });
                  } else {
                    Cookies.remove("username");
                    Cookies.remove("rememberMe");
                  }

                  //参数管理
                  //设置侧边栏颜色  后期改为从数据库读取
                  //为了参数管理新增的设置   从数据库中读出参数数据，使用$store赋值

                  _this.$router.push({
                    path: "Welcome"
                  });
                } else {
                  _this.$message.error("验证码错误");
                  _this.loading = false;
                }
              })
              .catch(function(error) {
                _this.loading = false;
                console.log(error);
              });
          }
        }
      });
    },
    getCode() {
      var _this = this;
      getCodeImgApi()
        .then(function(response) {
          //将从后台获取的图片流进行转换
          //console.log(response);
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(function(data) {
          //接收转换后的Base64图片
          _this.codeUrl = data;
        })
        .catch(function(err) {});
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    getMessCode() {
      //发送短信前先校验手机号是否合法
      var testPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      var _this = this;
      if (this.loginForm.username == "") {
        this.$message.error("请输入手机号");
      } else if (!testPhone.test(this.loginForm.username)) {
        this.$message.error("手机号格式错误，请重新输入");
      } else {
        //console.log(this.loginForm.username);
        getMessCodeApi(this.loginForm.username)
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
.login {
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

.login-form {
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
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-mesCode {
  width: 30%;
  height: 40px;
  float: right;
}
.el-login-footer {
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
.login-code-img {
  height: 38px;
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
.lMode {
  margin-left: 60%;
}
.forPassLink {
  margin-left: 70%;
}
.registerLink {
  margin-left: 5%;
}
</style>
