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
              placeholder="文章标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章类别">
            <el-select
              v-model="listQuery.category"
              placeholder="请选择文章类别"
              clearable
            >
              <el-option
                v-for="item in articleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                size="medium"
              >
              </el-option>
            </el-select>
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
        @click="handleAddAirticle()"
        size="mini"
        type="primary"
      >
        添加
      </el-button>
    </el-card>
    <!-- 文章列表 -->
    <div class="table-container">
      <el-table
        ref="articleForm"
        style="width: 100%"
        :data="list"
        v-loading="false"
        border
      >
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="文章标题" align="center">
          <template slot-scope="scope">{{ scope.row.articleTitle }}</template>
        </el-table-column>
        <el-table-column label="文章封面" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.articlePic" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="文章类别" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.articleCategory === 0">中医</span>
            <span v-else-if="scope.row.articleCategory === 1">饮食</span>
            <span v-else-if="scope.row.articleCategory === 2">运动</span>
            <span v-else-if="scope.row.articleCategory === 3">睡眠</span>
            <span v-else-if="scope.row.articleCategory === 4">心理</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime.slice(0, 10)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
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
import { fetchList, deleteAirticle, updateArticle } from "@/api/knowledge";
import { number } from "echarts";
const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  category: null,
  showStatus: 1,
};
export default {
  name: "articleList",
  components: { Image },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: Object.assign({}, defaultListQuery),
      articleOptions: [
        {
          value: "0",
          label: "中医",
        },
        {
          value: "1",
          label: "饮食",
        },
        {
          value: "2",
          label: "运动",
        },
        {
          value: "3",
          label: "睡眠",
        },
        {
          value: "4",
          label: "心理",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 文章列表
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
    // 添加文章
    handleAddAirticle() {
      this.$router.push({ name: "ArticleAdd" });
    },
    // 编辑文章
    handleUpdate(index, row) {
      this.$router.push({ path: "articleUpdate", query: { id: row.id } });
    },
    handleshowStatusChange(index, row) {
      let data = {
        articleCategory: row.articleCategory,
        articleContent: row.articleContent,
        articleTitle: row.articleTitle,
        showStatus: 0,
      };
      updateArticle(row.id, data).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getList();
      });
    },
  },
};
</script>

<style scoped>
</style>
