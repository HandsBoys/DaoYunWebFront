<template>
  <div class="sidebar" v-if="reloadPage">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      :background-color="backgroundColor"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="ifHaveChildren(item)">
          <el-submenu :index="item.path + '' " :key="item.path">
            <template slot="title">
              <svg-icon :icon-class="item.icon"/>
              <span slot="title">{{ item.menuName }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu v-if="ifHaveChildren(subItem)" :index="subItem.path" :key="subItem.path">
                <template slot="title">
                  <svg-icon :icon-class="subItem.icon"/>
                  <span slot="title">{{ subItem.menuName }}</span>
                </template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.children"
                  :key="i"
                  :index="threeItem.path"
                >{{ threeItem.menuName }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.path" :key="subItem.path">
                <template slot="title">
                  <svg-icon :icon-class="subItem.icon"/>
                  <span slot="title">{{ subItem.menuName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path" :key="item.path">
            <svg-icon :icon-class="item.icon"/>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../api/bus";
import { getSideBarApi } from "@/api/api";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-lx-home",
          index: "Welcome",
          title: "系统首页"
        },
        {
          icon: "el-icon-lx-cascades",
          index: "table",
          title: "基础表格"
        },
        {
          icon: "el-icon-lx-copy",
          index: "form",
          title: "通用编辑"
        },
        {
          icon: "el-icon-lx-calendar",
          index: "3",
          title: "表单相关",
          subs: [
            {
              index: "form",
              title: "基本表单"
            },
            {
              index: "3-2",
              title: "三级菜单",
              subs: [
                {
                  index: "editor",
                  title: "富文本编辑器"
                },
                {
                  index: "markdown",
                  title: "markdown编辑器"
                }
              ]
            },
            {
              index: "upload",
              title: "文件上传"
            }
          ]
        },
        {
          icon: "el-icon-lx-emoji",
          index: "icon",
          title: "自定义图标"
        },
        {
          icon: "el-icon-pie-chart",
          index: "charts",
          title: "schart图表"
        },
        {
          icon: "el-icon-rank",
          index: "6",
          title: "拖拽组件",
          subs: [
            {
              index: "drag",
              title: "拖拽列表"
            },
            {
              index: "dialog",
              title: "拖拽弹框"
            }
          ]
        },
        {
          icon: "el-icon-lx-global",
          index: "i18n",
          title: "国际化功能"
        },
        {
          icon: "el-icon-lx-warn",
          index: "7",
          title: "错误处理",
          subs: [
            {
              index: "permission",
              title: "权限测试"
            },
            {
              index: "404",
              title: "404页面"
            }
          ]
        },
        {
          icon: "el-icon-lx-redpacket_fill",
          index: "/donate",
          title: "支持作者"
        }
      ],
      item2s: [],
      // 当前激活的路径（第二级菜单栏）
      activepath: "",
      reloadPage: true
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    backgroundColor() {
      return this.$store.state.backgroundColor;
    },
    ifReloadSideBar() {
      return this.$store.state.reloadSidebar;
    }
  },
  created() {
    this.getMenu();

    //获取侧边栏各种颜色

    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
  methods: {
    getMenu() {
      const _this = this;
      var userId = 2;
      getSideBarApi(userId)
        .then(function(response) {
          _this.items = response.data.data;
          // console.log(response);
          // console.log(_this.items);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    ifHaveChildren(item) {
      //判断菜单项是否存在子数组
      if (item.children instanceof Array) {
        let arr = [];
        arr = item.children;
        // console.log("sss " + arr.length)
        if (arr.length == 0) {
          return false;
        }
        return true;
      }
      return true;
    }
  },
  watch: {
    ifReloadSideBar: function() {
      // console.log("ifReloadSideBar");
      this.reloadPage = false;

      this.$nextTick(() => {
        this.getMenu();
        this.reloadPage = true;
      });
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
