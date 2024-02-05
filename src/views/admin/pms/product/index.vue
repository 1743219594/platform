<template>
  <div class="app-container">
    <keep-alive></keep-alive>
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
              placeholder="商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input
              style="width: 203px"
              v-model="listQuery.productSn"
              placeholder="商品货号"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions"
              placeholder="请选择商品类别"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select
              v-model="listQuery.verifyStatus"
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
          <el-form-item label="同源认证：">
            <el-select
              v-model="listQuery.newStatus"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in newStatusOptions"
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
    <!-- 数据列表卡片 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>商品数据列表</span>
    </el-card>
    <!-- 商品列表 -->
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"
            ><img style="height: 80px" :src="scope.row.pic"
          /></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="发布商家" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品类别" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.productCategoryName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{ scope.row.price }}</p>
            <p>货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sale }}</template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>
              审核状态：<el-switch
                @change="handleVerifyStatus(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.verifyStatus"
              >
              </el-switch>
            </p>
            <p>
              同源认证：<el-switch
                @change="handleNewStatus(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.newStatus"
              >
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdateProduct(scope.$index, scope.row)"
              >查看详情
            </el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
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
import {
  fetchList,
  updatePublishStatus,
  updateVerifyStatus,
  updateDeleteStatus,
  updateNewStatus,
} from "@/api/product";
import { fetchListWithChildren } from "@/api/productCate";
const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 10,
  deleteStatus: 0,
  publishStatus: null,
  isApprove: null,
  productSn: null,
  productCategory: null,
};
export default {
  name: "productList",
  data() {
    return {
      operates: [
        {
          label: "商品上架",
          value: "publishOn",
        },
        {
          label: "商品下架",
          value: "publishOff",
        },
        {
          label: "设为推荐",
          value: "recommendOn",
        },
        {
          label: "取消推荐",
          value: "recommendOff",
        },
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      productCateOptions: [],
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
      newStatusOptions: [
        {
          value: 1,
          label: "已认证",
        },
        {
          value: 0,
          label: "未认证",
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getProductCateList();
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    },
  },
  methods: {
    beforeRouteEnter(to, from, next) {
      if (from.path == "/admin/product/productUpdate") {
        to.meta.isBack = true;
      } else {
        to.meta.isBack = false;
      }
      next();
    },
    // 商品列表
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
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
    getProductCateList() {
      fetchListWithChildren().then((response) => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id,
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children,
          });
        }
      });
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "请选择操作类型",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.$confirm("是否要进行该批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updatePublishStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updatePublishStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateRecommendStatus(1, ids);
            break;
          case this.operates[3].value:
            this.updateRecommendStatus(0, ids);
            break;
          case this.operates[4].value:
            this.updateNewStatus(1, ids);
            break;
          case this.operates[5].value:
            this.updateNewStatus(0, ids);
            break;
          case this.operates[6].value:
            break;
          case this.operates[7].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
        this.getList();
      });
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
    // 重置搜索栏
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
    },
    // 查看详情
    handleUpdateProduct(index, row) {
      this.$router.push({ path: "productUpdate", query: { id: row.id } });
    },
    // 修改上架状态
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    // 修改审核状态
    handleVerifyStatus(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateVerifyStatus(row.verifyStatus, ids);
    },
    updateVerifyStatus(verifyStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("detail", "");
      params.append("verifyStatus", verifyStatus);
      updateVerifyStatus(params).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    // 同源认证状态
    handleNewStatus(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNewStatus(row.newStatus, ids);
    },
    //
    updateNewStatus(newStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("detail", "");
      params.append("newStatus", newStatus);
      updateNewStatus(params).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    // 删除产品
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then((response) => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000,
        });
      });
      this.getList();
    },
  },
};
</script>
<style></style>


