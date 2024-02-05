<template>
  <div class="app-container">
    <!-- 搜索卡片  -->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small"
        >
          查询结果
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              style="width: 203px"
              v-model="listQuery.keyword"
              placeholder="活动标题"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 数据列表卡片 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddActivity()"
        size="mini"
        type="primary"
      >
        添加
      </el-button>
    </el-card>
    <!-- 文章列表 -->
    <div class="table-container">
      <el-table
        ref="activityForm"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="活动标题" align="center">
          <template slot-scope="scope">{{ scope.row.activityTitle }}</template>
        </el-table-column>
        <el-table-column label="活动封面" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.activityPic" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="邀请专家" align="center">
          <template slot-scope="scope">
            {{ scope.row.activityExpert }}
          </template>
        </el-table-column>
        <el-table-column label="活动地点" align="center">
          <template slot-scope="scope">
            {{ scope.row.activityPlace }}
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="200" align="center">
          <template slot-scope="scope">
            <p>
              开始：
              {{ scope.row.activityTime[0].slice(0, 10) }}
              {{ scope.row.activityTime[0].slice(11, 19) }}
            </p>
            <p>
              结束：
              {{ scope.row.activityTime[1].slice(0, 10) }}
              {{ scope.row.activityTime[1].slice(11, 19) }}
            </p></template
          >
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleshowStatusChange(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { Image } from "element-ui";
import { getActivityList, updateActivity } from "@/api/activity";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  showStatus: 1,
};
export default {
  name: "activityList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: Object.assign({}, defaultListQuery),
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  methods: {
    // 跳转活动添加页
    handleAddActivity() {
      this.$router.push({ name: "ActivityAdd" });
    },
    // 获取活动列表
    getList() {
      this.listLoading = true;
      getActivityList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    // 筛选搜索相关
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 分页器相关
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    // 跳转编辑页
    handleUpdate(index, row) {
      this.$router.push({
        path: "activityUpdate",
        query: { id: row.id },
      });
    },
    // 删除活动
    handleDelete(index, row) {
      this.$confirm("是否要删除该活动吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteActivity(row.id).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000,
          });
          this.getList();
        });
      });
    },
    handleshowStatusChange(index, row) {
      let data = {
        activityCategory: 0,
        activityContent: "",
        activityExpert: row.activityExpert,
        activityPlace: row.activityPlace,
        activityTitle: row.activityTitle,
        activityTime: row.activityTime,
        showStatus: 0,
      };
      updateActivity(row.id, data).then(() => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.getList();
      });
    },
  },
  components: { Image },
};
</script>

<style scoped>
</style>
