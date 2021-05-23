      <template>
  <div id="MenuManage" v-if="ifshow">
    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="path" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { getAllMenuForRoleApi } from "@/api/api";

export default {
  name: "MenuManage",
  data() {
    return {
      ifshow: false,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
    };
  },
  methods: {
    //从后台获取表格内的信息
    getMenuInfo() {
      var _this = this;
      getAllMenuForRoleApi().then(function(response) {
        console.log(response);
        _this.menuList = response.data;
        _this.ifshow = true;
        _this.loading = false;
      });
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      if(row.status== false) {
        return "正常";
      }else {
        return "停用";
      }
    },
    //
  },
  created() {
    this.getMenuInfo();
  }
};
</script>

<style>
</style>
