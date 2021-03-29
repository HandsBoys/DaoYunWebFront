<template>
  <div class="app-container home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/logo.png" alt>
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="quit">退出</el-button>
      </el-header>
      <!-- 内容区 -->
      <el-container>
        <!-- 侧边栏 -- 属性加冒号表示绑定一个值，不加值为字符串如unique-opened可以直接写为unique-opened不加属性值-->
        <el-aside :width="iscollapse?'64px':'200px'">
          <div class="toggle-button" @click="togglecollapse">|||</div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="iscollapse"
            :collapse-transition="false"
            router
            :default-active="activepath"
          >
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <!-- 一级菜单图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 一级菜单内容 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="getpath(subitem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右边内容区 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  created() {
    this.showMenuList();
    // 设置当前的二级菜单
    this.activepath = "/" + window.sessionStorage.getItem("activepath");
  },

  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 一级菜单图标对象
      iconsObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      // 菜单栏是否水平折叠
      iscollapse: false,
      // 当前激活的路径（第二级菜单栏）
      activepath: ""
    };
  },
  methods: {
    quit: function() {
      // 退出功能主要是利用清除token的原理来实现
      // 清除token
      window.sessionStorage.clear();
      // 退出后回到登录页面
      this.$router.push("/login");
      // 显示退出成功
      this.$message.success("退出成功");
    },
    showMenuList: async function() {
      // 展示左侧菜单列表
      const { data: res } = await this.$http.get("menus");
      //console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      console.log(this.menuList);
    },
    togglecollapse: function() {
      // 是否水平折叠菜单栏
      this.iscollapse = !this.iscollapse;
    },
    getpath: function(val) {
      // 获取点击二级菜单的路径
      // console.log(val);
      window.sessionStorage.setItem("activepath", val);
      //  this.activepath = '/'+val;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color:#373D41;
    // 项目位于各行之间留有空白的容器内
    display: flex;
    justify-content: space-between;
    padding-left:0;
    color:#fff;
    font-size: 25px;
    // 纵向居中
    align-items: center;
    div {
        display:flex;
        align-items:center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color:#333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color:#eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color:#4A5064;
    color:#fff;
    font-size:10px;
    line-height:24px;
    text-align: center;
    letter-spacing:0.3em;
    cursor: pointer;
}
</style>
