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
              placeholder="帐号/姓名"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 数据列表tag卡片 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <!-- 数据表格 -->
    <div class="table-container">
      <el-table
        ref="adminTable"
        :data="list"
        style="width: 100%"
        v-loading="false"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="店铺名称" align="center">
          <template slot-scope="scope">{{ scope.row.shopName }}</template>
        </el-table-column>
        <el-table-column label="主营业务" align="center">
          <template slot-scope="scope">{{ scope.row.shopBusiness }}</template>
        </el-table-column>
        <el-table-column label="加入时间" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" width="200">
          <template slot-scope="scope">
            <div>手机：{{ scope.row.phone }}</div>
            <div>邮箱：{{ scope.row.email }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >注销
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
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10, 15, 20]"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchList } from "@/api/merchant";
import { fetchAllRoleList } from "@/api/role";
import { formatDate } from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
};
export default {
  name: "merChantList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
  },
  methods: {
    // 筛选搜索相关
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
    // 修改商家启用状态
    handleStatusChange(index, row) {
      this.$confirm("是否要修改该状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改",
          });
          this.getList();
        });
    },
    // 注销商家
    handleDelete(index, row) {
      this.$confirm("确定注销该商家吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMerchant().then((response) => {
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
    // 获取列表数据
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
  },
};
</script>
<style></style>


