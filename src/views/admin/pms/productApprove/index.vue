<template>
  <div class="app-container">
    <!-- 搜索卡片 -->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span> 筛选搜索</span>
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
              placeholder="产品名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select
              v-model="listQuery.isAccept"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 数据列表tag卡片 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span> 产品审核列表</span>
    </el-card>
    <!-- 数据表格 -->
    <div class="table-container">
      <el-table
        ref="adminTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="产品编号" align="center">
          <template slot-scope="scope">{{ scope.row.productId }}</template>
        </el-table-column>
        <!-- <el-table-column label="产品照片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.shopImage" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.productName }}</template>
        </el-table-column> -->

        <!-- <el-table-column label="发布商家" align="center">
          <template slot-scope="scope">{{ scope.row.shopName }}</template>
        </el-table-column> -->
        <el-table-column label="委托人" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.client }}</template>
        </el-table-column>

        <el-table-column label="联系方式" width="200" align="center">
          <template slot-scope="scope">
            <P>手机：{{ scope.row.phone }}</P>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200" align="center">
          <template slot-scope="scope">
            <P>{{ scope.row.isAccept === 0 ? "未审核" : "" }}</P>
            <P>{{ scope.row.isAccept === 1 ? "审核通过" : "" }}</P>
            <P>{{ scope.row.isAccept === 2 ? "审核未通过" : "" }}</P>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="navToDetail(scope.row)">
              <!-- @click="handleUpdate(scope.$index, scope.row)" -->
              查看详情
            </el-button>
            <!-- <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >通过审核
            </el-button> -->
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
import { fetchListNotAuth } from "@/api/product";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  isAccept: null,
  keyword: null,
};
export default {
  name: "adminList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      isEdit: false,
      verifyStatusOptions: [
        {
          value: 0,
          label: "未审核",
        },
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 2,
          label: "审核未通过",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 搜索相关
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

    // 获取注册商户列表
    getList() {
      this.listLoading = true;
      fetchListNotAuth(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    // 跳转详情页
    navToDetail(row) {
      this.$router.push({ path: "productAuthDetail", query: { id: row.id } });
    },
  },
};
</script>
<style></style>


