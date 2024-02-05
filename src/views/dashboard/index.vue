<template>
  <div class="app-container">
    <div class="un-handle-layout">
      <div class="layout-title">基本信息</div>
      <div class="layout-welcome">欢迎使用药食同源大健康平台管理系统</div>
    </div>
    <!-- 数据统计 -->
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon" />
            <div class="total-title">今日平台订单总数</div>
            <div class="total-value">{{ ordersNum }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_vip" class="total-icon" />
            <div class="total-title">平台会员总数</div>
            <div class="total-value">{{ membersNum }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_merchant" class="total-icon" />
            <div class="total-title">平台商家总数</div>
            <div class="total-value">{{ merchantNum }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 待处理事件 -->
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="24">
          <!-- 商品总览 -->
          <div class="out-border">
            <div class="layout-title">待处理事件</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="8" class="color-danger overview-item-value">{{
                  reviewMerchant
                }}</el-col>
                <el-col :span="8" class="color-danger overview-item-value">{{
                  reviewProduct
                }}</el-col>
                <el-col :span="8" class="color-danger overview-item-value">{{
                  reviewExamine
                }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="8" class="overview-item-title"
                  >待审核注册商户</el-col
                >
                <el-col :span="8" class="overview-item-title"
                  >待审核商品</el-col
                >
                <el-col :span="8" class="overview-item-title"
                  >待审核产品认证</el-col
                >
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { str2Date } from "@/utils/date";
import img_home_order from "@/assets/images/home_order.png";
import img_home_merchant from "@/assets/images/home_merchant.png";
import img_home_vip from "@/assets/images/home_vip.png";
import { ordersNum, membersNum, merchantNum } from "@/api/count";
import { fetchList, fetchListNotAuth } from "@/api/product";
import { fetchMerchantExamineList } from "@/api/merchant";
const defaultListQuery = {
  keyword: null,
  pageNum: 0,
  pageSize: 0,
  brandId: null,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  deleteStatus: null,
  productCategory: null,
  recommendStatus: null,
  status: null,
};
export default {
  name: "home",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      orderCountDate: "",
      chartSettings: {
        xAxisType: "time",
        area: true,
        axisSite: { right: ["orderAmount"] },
        labelMap: { orderCount: "订单数量", orderAmount: "订单金额" },
      },
      chartData: {
        columns: [],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      img_home_order,
      img_home_vip,
      img_home_merchant,
      ordersNum: 0,
      membersNum: 0,
      merchantNum: 0,
      reviewMerchant: 0,
      reviewProduct: 0,
      reviewExamine: 0,
    };
  },
  //   mounted() {
  //     this.initProductSalesChart();
  //     this.initProductCateGoryChart();
  //   },
  created() {
    // this.initOrderCountDate();
    this.getData();
  },
  methods: {
    async getData() {
      // 待审核注册商户
      this.listQuery.status = 0;
      let res = await fetchMerchantExamineList(this.listQuery);
      this.reviewMerchant = res.data.total;
      this.listQuery.status = null;
      // 待审核商品
      this.listQuery.deleteStatus = 0;
      this.listQuery.verifyStatus = 0;
      res = await fetchList(this.listQuery);
      this.reviewProduct = res.data.total;
      this.listQuery.deleteStatus = null;
      this.listQuery.verifyStatus = null;
      // 待审核产品认证
      this.listQuery.isAccept = 0;
      res = await fetchListNotAuth(this.listQuery);
      this.reviewExamine = res.data.total;
      this.listQuery.isAccept = null;
      ordersNum().then((res) => {
        this.ordersNum = res.data;
      });
      membersNum().then((res) => {
        this.membersNum = res.data;
      });
      merchantNum().then((res) => {
        this.merchantNum = res.data;
      });
      //   reviewMerchant().then((res) => {
      //     this.reviewMerchant = res.data;
      //   });
      //   reviewProduct().then((res) => {
      //     this.reviewProduct = res.data;
      //   });
      //   reviewExamine().then((res) => {
      //     this.reviewExamine = res.data;
      //   });
    },
    // handleDateChange() {
    //   this.getData();
    // },
    initOrderCountDate() {
      let start = new Date();
      start.setFullYear(2018);
      start.setMonth(10);
      start.setDate(1);
      const end = new Date();
      end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
      this.orderCountDate = [start, end];
    },
    // getData() {
    //   setTimeout(() => {
    //     this.chartData = {
    //       columns: ["date", "orderCount", "orderAmount"],
    //       rows: [],
    //     };
    //     for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
    //       let item = DATA_FROM_BACKEND.rows[i];
    //       let currDate = str2Date(item.date);
    //       let start = this.orderCountDate[0];
    //       let end = this.orderCountDate[1];
    //       if (
    //         currDate.getTime() >= start.getTime() &&
    //         currDate.getTime() <= end.getTime()
    //       ) {
    //         this.chartData.rows.push(item);
    //       }
    //     }
    //     this.dataEmpty = false;
    //     this.loading = false;
    //   }, 1000);
    // },
    initProductSalesChart() {
      var echarts = require("echarts");
      // 初始化echarts实例
      var myChart = echarts.init(document.getElementById("sales"));
      // 配置参数
      var option = {
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["丁香", "八角", "茴香", "罗汉果", "肉桂", "龙眼肉"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };
      myChart.setOption(option);
    },
    initProductCateGoryChart() {
      var echarts = require("echarts");
      // 初始化echarts实例
      var categoryChart = echarts.init(document.getElementById("category"));
      // 配置参数
      var option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "原料类" },
              { value: 735, name: "成药类" },
              { value: 580, name: "草药和天然补品" },
              { value: 484, name: "药膳" },
              { value: 300, name: "膳食补充剂" },
              { value: 1048, name: "保健食品" },
              { value: 735, name: "饮料" },
              { value: 580, name: "保健品" },
              { value: 484, name: "仪器类" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      categoryChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}
.address-layout {
}
.welcome-layout {
  color: #606266;
}
.total-layout {
  margin-top: 20px;
}
.total-frame {
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: 100px;
}
.total-icon {
  color: #409eff;
  width: 60px;
  height: 60px;
}
.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}
.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}
.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.layout-welcome {
  color: #616263;
  padding: 30px 20px;
  font-weight: bold;
  font-size: 25px;
  text-align: center;
}
.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}
.un-handle-content {
  padding: 20px 40px;
}
.un-handle-item {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}
.overview-layout {
  margin-top: 20px;
}
.overview-item-value {
  font-size: 24px;
  text-align: center;
}
.overview-item-title {
  margin-top: 10px;
  text-align: center;
}
.out-border {
  border: 1px solid #dcdfe6;
}
.statistics-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}
.address-content {
  padding: 20px;
  font-size: 18px;
}
</style>