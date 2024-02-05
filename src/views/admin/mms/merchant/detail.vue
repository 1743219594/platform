<template>
  <div class="app-container">
    <el-form
      ref="form"
      class="form"
      :model="examineData"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="公司名称">
        <el-input v-model="examineData.companyName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="注册地址">
        <el-input
          v-model="examineData.companyAddress"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="examineData.companyTime"
          style="width: 100%"
          :disabled="true"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="法定代表人">
        <el-input
          v-model="examineData.representative"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="营业执照">
        <el-image
          style="width: 250px; height: 200px"
          :src="examineData.prove"
          :preview-src-list="examineData.srcList"
        >
        </el-image>
      </el-form-item>
      <el-form-item label="店铺名称">
        <el-input v-model="examineData.shopName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="店铺简介">
        <el-input
          type="textarea"
          v-model="examineData.shopInfo"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="主营业务">
        <el-input
          v-model="examineData.shopBusiness"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="店铺图标">
        <el-image
          style="width: 100px; height: 100px"
          :src="examineData.shopLogo"
          :preview-src-list="examineData.shopLogoSrcList"
        >
        </el-image>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="examineData.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="examineData.phone" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="examineData.email" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="登录用户名">
        <el-input v-model="examineData.userName" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item label="登录密码">
        <el-input v-model="examineData.password" :disabled="true"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="danger" @click="refuseApplication">返回</el-button>
        <el-button type="primary" @click="passExamine">通过审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  fetchMerchantExamineDetail,
  passExamine,
  refuseApplication,
} from "@/api/merchant";
import { createBrand } from "@/api/brand";
import router from "@/router";
export default {
  data() {
    return {
      id: null,
      examineData: {
        companyName: "",
        companyAddress: "",
        companyDate: "",
        representative: "",
        representativeNum: "",
        shopName: "",
        shopIntro: "",
        shopBusiness: "",
        name: "",
        phone: "",
        email: "",
        remark: "无",
        prove: "",
        srcList: [],
        shopLogo: "",
        shopLogoSrcList: [],
        status: null,
      },
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getData();
  },
  methods: {
    // 获取详细信息
    getData() {
      const merchantId = this.id;
      fetchMerchantExamineDetail(merchantId).then((response) => {
        this.examineData = response.data;
      });
    },
    // 通过审核
    passExamine() {
      const _that = this;
      this.$confirm("此操作后将通过商户注册审核，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //   if (_that.examineData.status === 1) {
          //     this.$message({
          //       type: "warning",
          //       message: "该商家已通过审核！",
          //     });
          //     return;
          //   }
          const data = {
            status: 1,
          };
          passExamine(this.id, data).then((response) => {
            // const shopData = {
            //   name: _that.examineData.companyName,
            //   logo: _that.examineData.shopLogo,
            //   brandStory: _that.examineData.shopIntro,
            //   bigPic: _that.examineData.shopLogo,
            //   firstLetter: "",
            //   sort: _that.examineData.id,
            //   factoryStatus: 1,
            //   showStatus: 1,
            // };

            this.$message({
              type: "success",
              message: "通过审核!",
            });

            this.$router.push({
              path: "merchantExamine",
            });
          });
        })
        .catch((err) => {
          this.$message({
            type: "dangerous",
            message: err,
          });
        });
    },
    // 退回
    refuseApplication() {
      this.$router.push({
        path: "merchantExamine",
      });
    },
  },
};
</script>

<style>
.form {
  margin: 20px 300px 20px 200px;
}
</style>