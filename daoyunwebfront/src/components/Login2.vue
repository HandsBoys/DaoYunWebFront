<template>
  <div id="Login">
    <div class="logheader">
      <img src="../assets/WebLogo.png" alt="WebLogo.png">
      <span id="LogoText">到云</span>
    </div>
    <div class="main">
      <div class="box">
        <!-- class="active" -->
        <div class="box2">
          <p @click="switchView1()" class="box2_1">
            <router-link to>账户密码登录</router-link>
          </p>
          <p @click="switchView2()" class="box2_2">
            <router-link to>短信验证登录</router-link>
          </p>
        </div>
        <div class="box3">
          <div v-if="switView1" class="box3_1">
            <el-input v-model="username" placeholder="邮箱/手机"></el-input>
            <el-input placeholder="密码" v-model="password" show-password></el-input>
          </div>
          <div v-if="switView2" class="box3_1">
            <el-input v-model="username" placeholder="手机号"></el-input>

            <div class="jc-component__range">
              <div class="jc-range" :class="rangeStatus?'success':''">
                <i @mousedown="rangeMove" :class="rangeStatus?successIcon:startIcon"></i>
                {{rangeStatus?successText:startText}}
              </div>
            </div>

            <div class="box3_1_1">
              <el-input v-model="password" placeholder="验证码" class="box3_1_1_input"></el-input>
              <p>
                <router-link to>获取验证码</router-link>
              </p>
            </div>
          </div>
        </div>
        <div class="box4">
          <el-checkbox v-model="checked">30天自动登录</el-checkbox>
          <p>
            <router-link to>忘记密码</router-link>
          </p>
        </div>
        <router-link to>
          <div class="box5">登录</div>
        </router-link>
        <div class="box6">
          <p>
            <router-link :to="{ path: '/Register' }" class="box6_1">注册</router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>2021福州大学工程实践课“到云”项目</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
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
    //或者用值来进行监听
    status: {
      type: String
    }
  },
  data() {
    return {
      username: "",
      password: "",
      switView1: true,
      switView2: false,
      checked: false,
      disX : 0,
			rangeStatus: false
    };
  },
  methods: {
    switchView1() {
      this.switView1 = true;
      this.switView2 = false;
      document
        .querySelector(".box2_1")
        .setAttribute("style", "border-bottom: blue solid 3px;");
      document.querySelector(".box2_2").removeAttribute("style");
    },
    switchView2() {
      this.switView2 = true;
      this.switView1 = false;
      document
        .querySelector(".box2_2")
        .setAttribute("style", "border-bottom: blue solid 3px;");
      document.querySelector(".box2_1").removeAttribute("style");
    },
    rangeMove(e){
			let ele = e.target;
			let startX = e.clientX;
			let eleWidth = ele.offsetWidth;
			let parentWidth =  ele.parentElement.offsetWidth;
			let MaxX = parentWidth - eleWidth;
			if(this.rangeStatus){//不运行
				return false;
			}
			document.onmousemove = (e) => {
				let endX = e.clientX;
				this.disX = endX - startX;
				if(this.disX<=0){
					this.disX = 0;
				}
				if(this.disX>=MaxX-eleWidth){//减去滑块的宽度,体验效果更好
					this.disX = MaxX;
				}
				ele.style.transition = '.1s all';
				ele.style.transform = 'translateX('+this.disX+'px)';
				e.preventDefault();
			}
			document.onmouseup = ()=> {
				if(this.disX !== MaxX){
					ele.style.transition = '.5s all';
					ele.style.transform = 'translateX(0)';
					//执行成功的函数
					this.errorFun && this.errorFun();
				}else{
					this.rangeStatus = true;
					if(this.status){
						this.$parent[this.status] = true;
					}
					//执行成功的函数
					this.successFun && this.successFun();
				}
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}
  },
  mounted() {
    const main_h = window.screen.height / 1.5;
    document
      .querySelector(".main")
      .setAttribute("style", "height:" + main_h + "px;");
  }
};
</script>
<style scoped>
#LogoText {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 50px;
}
.main {
  background: url("../assets/LoginBackGround.jpg");
  size: 50%;
}
.box {
  height: 350px;
  width: 400px;
  background-color: #ffffff;
  margin-left: 1000px;   /*需要设置动态*/
  transform: translateY(20%);
  border-radius: 15px;
}
.box2 {
  display: flex;
  justify-content: space-around;
}
.active {
  border-bottom: blue solid 3px;
}
.box3 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
  border: 1px red solid;
}
.box4 {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.box5 {
  border: 1px red solid;
  text-align: center;
  padding: 20px 0;
  margin-top: 20px;
}
.box3_1 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px blue solid; 
  height: 100px;
}
.box3_1_1 {
   /* border: 1px blue solid;  */
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  text-align: end;
  /* padding: 0;
  margin: 0 auto; */
}
.box3_1_1_input {
  width: 300px;
}
.router-link-active {
  text-decoration: none;
  color: black;
}
.box6_1 {
  margin-left: 320px;
  text-decoration: none;
  color: black;
}
.el-checkbox {
  color: black;
}
.jc-range{
	background-color: #FFCCCC;
	position: relative;
	transition: 1s all;
	user-select: none;
	color: #333;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 45px; /*no*/
}
.jc-range i{
	position: absolute;
	left: 0;
	width: 60px;/*no*/
	height: 100%;
	color: #919191;
	background-color: #fff;
	border: 1px solid #bbb;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
}
.jc-range.success{
	background-color: #7AC23C;
	color: #fff;
}
.jc-range.success i{
	color: #7AC23C;
}
.footer {
  text-align: center;
}
</style>
