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
              placeholder="店铺名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
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
      <span> 商家注册列表</span>
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
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="公司名字" align="center">
          <template slot-scope="scope">{{ scope.row.companyName }}</template>
        </el-table-column>
        <el-table-column label="营业执照" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.prove" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" align="center">
          <template slot-scope="scope">{{ scope.row.shopName }}</template>
        </el-table-column>
        <el-table-column label="联系人" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="联系方式" width="200" align="center">
          <template slot-scope="scope">
            <div>手机：{{ scope.row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              disabled
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="navToDetail(scope.row.id)"
            >
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
import {
  fetchList,
  createAdmin,
  updateAdmin,
  updateStatus,
  deleteAdmin,
  getRoleByAdmin,
  allocRole,
} from "@/api/login";
import { updateShowStatus } from "@/api/brand";
import { fetchMerchantExamineList } from "@/api/merchant";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  status: null,
};
export default {
  name: "examineList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      verifyStatusOptions: [
        {
          value: 1,
          label: "已审核",
        },
        {
          value: 0,
          label: "未审核",
        },
      ],
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
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
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
    handleDelete(index, row) {
      this.$confirm("是否要删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteAdmin(row.id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.admin = Object.assign({}, row);
    },
    handleStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateVerifyStatus(row.status, ids);
    },
    updateVerifyStatus(status, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("showStatus", status);
      updateShowStatus(params).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    handleDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          updateAdmin(this.admin.id, this.admin).then((response) => {
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          createAdmin(this.admin).then((response) => {
            this.$message({
              message: "添加成功！",
              type: "success",
            });
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    },
    // 获取注册商户列表
    getList() {
      this.listLoading = true;
      fetchMerchantExamineList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    navToDetail(id) {
      this.$router.push({
        path: "merchantDetail",
        query: { id: id },
      });
    },
  },
};
</script>
<style></style>


