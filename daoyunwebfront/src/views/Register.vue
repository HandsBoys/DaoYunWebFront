<template>
  <div id="Register">
    <div class="regheader">
      <img src="../assets/img/WebLogo.png" alt="WebLogo.png">
      <span id="regLogoText">到云</span>
      <div>
        <p>
          <router-link to="/Login" class="reLogin">返回登录</router-link>
        </p>
      </div>
    </div>
    <div class="regmain">
      <div class="regbox">
        <div class="regbox2">
          <p class="regbox2_1">注册到云新账号</p>
          <p>使用手机号注册后，你可以通过手机号加密码登录，也可以使用短信验证码进行登录</p>
        </div>
        <div class="regbox3">
          <el-input v-model="username" placeholder="手机号"></el-input>
          <el-tooltip
            class="item"
            effect="dark"
            content="密码为6-16位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符"
            placement="right"
          >
            <el-input placeholder="密码" v-model="password" show-password></el-input>
          </el-tooltip>
        </div>
        <div class="regbox4">
          <div class="regbox4_1">
            <div class="jc-component__range">
              <div class="jc-range" :class="rangeStatus?'success':''">
                <i @mousedown="rangeMove" :class="rangeStatus?successIcon:startIcon"></i>
                {{rangeStatus?successText:startText}}
              </div>
            </div>
          </div>
          <div class="regbox4_2">
            <el-input class="regbox4_2_input" v-model="verification" placeholder="验证码"></el-input>
            <el-button type="primary" :disabled="btnChangeEnable">获取验证码</el-button>
          </div>
        </div>
        <div class="regbox5">
          <el-checkbox v-model="checked">我已阅读并同意</el-checkbox>
          <el-link type="primary">《用户协议》</el-link>
        </div>
        <div class="regbox6">
          <el-button :plain="true" type="primary" class="regButton" @click="register()">注册</el-button>
        </div>
      </div>
    </div>
    <div class="regfooter">
      <p>2021福州大学工程实践课“到云”项目</p>
    </div>
  </div>
</template>

<script>
import { registerApi } from "@/api/api";
export default {
  name: "Register",
  props: {
    // 成功之后的函数
    successFun: {
      type: Function
    },
    //成功图标
    successIcon: {
      type: String,
      default: "el-icon-success"
    },
    //成功文字
    successText: {
      type: String,
      default: "验证成功"
    },
    //开始的图标
    startIcon: {
      type: String,
      default: "el-icon-d-arrow-right"
    },
    //开始的文字
    startText: {
      type: String,
      default: "拖动滑块到最右边"
    },
    //失败之后的函数
    errorFun: {
      type: Function
    },
    //或者用值来进行监听22
    status: {
      type: String
    }
  },
  data() {
    return {
      username: "",
      password: "",
      disX: 0,
      rangeStatus: false,
      checked: false,
      btnChangeEnable: true,
      verification: ""
    };
  },
  methods: {
    rangeMove(e) {
      let ele = e.target;
      let startX = e.clientX;
      let eleWidth = ele.offsetWidth;
      let parentWidth = ele.parentElement.offsetWidth;
      let MaxX = parentWidth - eleWidth;
      if (this.rangeStatus) {
        //不运行
        return false;
      }
      document.onmousemove = e => {
        let endX = e.clientX;
        this.disX = endX - startX;
        if (this.disX <= 0) {
          this.disX = 0;
        }
        if (this.disX >= MaxX - eleWidth) {
          //减去滑块的宽度,体验效果更好
          this.disX = MaxX;
        }
        ele.style.transition = ".1s all";
        ele.style.transform = "translateX(" + this.disX + "px)";
        e.preventDefault();
      };
      document.onmouseup = () => {
        if (this.disX !== MaxX) {
          ele.style.transition = ".5s all";
          ele.style.transform = "translateX(0)";
          //执行成功的函数
          this.errorFun && this.errorFun();
        } else {
          this.rangeStatus = true;
          this.btnChangeEnable = false;
          if (this.status) {
            this.$parent[this.status] = true;
          }
          //执行成功的函数
          this.successFun && this.successFun();
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    register() {
      var testPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      var testPassword = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/; /*密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符 */
      if (!testPhone.test(this.username)) {
        this.$message.error("手机号格式不正确，请重新输入");
      } else if (!testPassword.test(this.password)) {
        this.$message.error("密码格式不正确，请重新输入");
      } else if (this.checked == false) {
        this.$message.error("注册需同意用户协议");
      } else {
        //判断验证码是否正确，若正确将数据送入后台
        if (this.verification == "1111") {
          const _this = this;
          var params = new URLSearchParams();
          params.append("username", this.username);
          params.append("password", this.password);

          registerApi(params)
            .then(function(response) {
              console.log(response);
              if (response.data.code == "200") {
                _this.$message.error("注册成功");
                // });
              } else {
                _this.$message.error("注册失败");
              }
            })
            .catch(function(error) {
              console.log(error);
            });

          // this.$axios
          //   .post("http://1.15.31.156:8081/sign?", params)
          //   .then(function(response) {
          //     if (response.data.code == "200") {
          //        _this.$message.error("注册成功");
          //       // _this.$router.push({
          //       //   path: "index",
          //       //   query: { username: _this.username }
          //       // });
          //     } else {
          //       _this.$message.error("注册失败");
          //     }
          //   })
          //   .catch(function(error) {
          //     console.log(error);
          //   });
        }
      }
    }
  }
};
</script>

<style scoped>
#Register {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  position: fixed;
}
#regLogoText {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 50px;
}
.regheader {
  display: flex;
  margin-left: 300px; /*需要设置动态*/
}
.reLogin {
  margin-left: 550px;
  color: black;
}
.router-link-active {
  text-decoration: none;
  color: black;
  margin-left: 800px; /*需要设置动态*/
}
.regbox {
  height: 600px;
  width: 1000px;
  background-color: #ffffff;
  margin-left: 300px; /*需要设置动态*/
}
.regbox2 {
  width: 400px;
  margin-left: 300px; /*需要设置动态*/
  padding-top: 80px;
  text-align: center;
}
.regbox2_1 {
  font-size: 25px;
}
.regbox3 {
  width: 400px;
  height: 120px;
  margin-left: 300px; /*需要设置动态*/
  /* border: 1px red solid; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.regbox4 {
  width: 400px;
  margin-left: 300px; /*需要设置动态*/
  /* border: 1px red solid; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 120px;
}
.regbox4_2 {
  /* border: 1px blue solid; */
  display: flex;
  justify-content: space-between;
  /* align-items: flex-end;
  text-align: end; */
}
.regbox4_2_input {
  width: 285px;
  /* margin-right: 0;
  padding: 0; */
}
.regbox5 {
  width: 400px;
  margin-left: 300px; /*需要设置动态*/
  margin-top: 15px;
  /* border: 1px black solid; */
}
.regbox6 {
  width: 400px;
  margin-left: 300px; /*需要设置动态*/
  margin-top: 15px;
  /* border: 1px black solid; */
}
.regButton {
  width: 100%;
}
.jc-range {
  background-color: #bbb;
  position: relative;
  transition: 1s all;
  user-select: none;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px; /*no*/
}
.jc-range i {
  position: absolute;
  left: 0;
  width: 60px; /*no*/
  height: 100%;
  color: #919191;
  background-color: #fff;
  border: 1px solid #bbb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.jc-range.success {
  background-color: #7ac23c;
  color: #fff;
}
.jc-range.success i {
  color: #7ac23c;
}
.regfooter {
  /* position: absolute;
  bottom: 0; */
  text-align: center;
}
</style>
