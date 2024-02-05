<template>
  <div class="app-container">
    <!-- 搜索卡片 -->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
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
              v-model="listQuery.keyword"
              class="input-width"
              placeholder="会员姓名"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span> 数据列表</span>
    </el-card>
    <!-- 表格数据 -->
    <el-table
      class="operate-container"
      :data="listData"
      border
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="会员编号" align="center">
      </el-table-column>
      <el-table-column prop="name" label="会员名字" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="下级" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="findSubordinate(scope.row.id)"
            >查看下级</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="分润" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">分润订单</el-button>
          <el-button type="text" size="small">分润设置</el-button>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            @click="deleteMember(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNum"
        :page-sizes="[10, 15, 20]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  fetchList,
  fetchListById,
  fetchChildList,
  deleteMember,
} from "@/api/member";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  status: 0,
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      listData: [],
      memberList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
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
    // 获取列表数据
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.listData = response.data.list;
        this.total = response.data.total;
      });
    },
    // 根据用户id获取下级会员列表
    findSubordinate(parentId) {
      this.listLoading = true;
      fetchChildList(parentId).then((response) => {
        this.listLoading = false;
        this.listData = response.data.list;
      });
    },
    // 删除会员
    deleteMember(memberId) {
      this.$confirm("确定删除该会员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMember(memberId).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>