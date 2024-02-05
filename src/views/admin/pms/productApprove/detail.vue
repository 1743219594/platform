<template>
  <div class="app-container">
    <el-form
      ref="form"
      :rules="rules"
      class="form"
      :model="form"
      label-width="110px"
      label-position="left"
    >
      <el-form-item label="商品名称">
        <el-input disabled v-model="productName"></el-input>
      </el-form-item>
      <div class="productAdd">
        <h2>加工厂信息</h2>
        <el-form-item label="加工厂名称：" prop="factoryName">
          <el-input
            disabled
            v-model="form.factoryName"
            placeholder="请填写加工厂名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="加工厂面积：" prop="factoryArea">
          <el-input
            disabled
            v-model="form.factoryArea"
            placeholder="请填写加工厂面积"
          ></el-input>
        </el-form-item>
        <el-form-item label="加工厂地址：" prop="factoryAddress">
          <el-input
            disabled
            v-model="form.factoryAddress"
            placeholder="请填写加工厂地址"
          ></el-input>
        </el-form-item>
      </div>

      <div class="productAdd">
        <h2>委托人信息</h2>
        <el-form-item label="委托人：" prop="client">
          <el-input
            disabled
            v-model="form.client"
            placeholder="请填写委托人姓名或企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input
            disabled
            v-model="form.address"
            placeholder="请填写委托人地址"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="联系人：" prop="contact">
          <el-input
            v-model="form.contact"
            placeholder="请填写联系人姓名"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="手机号：" prop="phone">
          <el-input
            disabled
            v-model="form.phone"
            placeholder="请填写联系人手机号码"
          ></el-input>
        </el-form-item>
      </div>

      <!-- <div
        class="productAdd"
        v-for="(item, index) in form.dynamicItem"
        :key="index"
      >
        <div class="header">
          <p>申请认证产品 {{ index + 1 }}</p>
          <p class="el-icon-delete" @click="deleteItem(item, index)"></p>
        </div>
        <el-form-item
          label="产品名称："
          :prop="'dynamicItem.' + index + '.productName'"
          :rules="{
            required: true,
            message: '该项为必填项',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="item.productName"
            placeholder="请填写产品名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="产品描述："
          :prop="'dynamicItem.' + index + '.productDesc'"
          :rules="{
            required: true,
            message: '该项为必填项',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="item.productDesc"
            placeholder="请填写产品描述"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="产品产量："
          :prop="'dynamicItem.' + index + '.productStock'"
          :rules="{
            required: true,
            message: '该项为必填项',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="item.productStock"
            placeholder="请填写产品产量"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="产品图片："
          :prop="'dynamicItem.' + index + '.productPics'"
        >
          <single-upload v-model="item.productPics"></single-upload>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button @click="addItem()">添加认证产品</el-button>
      </el-form-item> -->
      <el-form-item label="商家备注：">
        <el-input
          type="textarea"
          disabled
          placeholder="备注"
          v-model="form.remark"
        ></el-input>
      </el-form-item>
      <el-form-item label="审核状态：">
        {{ form.isAccept | formatApproveType }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleApproveStatu(1)"
          >通过审核</el-button
        ><el-button type="danger" @click="handleApproveStatu(2)"
          >退回审核</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import singleUpload from "@/components/Upload/singleUpload.vue";
import { fetchNotAuthDetail, getProduct, handleApprove } from "@/api/product";
const defaultForm = {
  productId: null,
  factoryName: "",
  factoryArea: "",
  factoryAddress: "",
  //   dynamicItem: [
  //     {
  //       productName: "",
  //       productDesc: "",
  //       productStock: "",
  //       productPics: "",
  //     },
  //   ],
  client: "",
  address: "",
  contact: "",
  phone: "",
  remark: "",
};
export default {
  name: "ProductExamine",
  components: {
    singleUpload,
  },
  data() {
    return {
      form: Object.assign({}, defaultForm),
      productName: "",
      approveStatus: null,
      rules: {
        factoryName: [
          { required: true, message: "该项为必填项", trigger: "blur" },
        ],
        factoryArea: [
          { required: true, message: "该项为必填项", trigger: "blur" },
        ],
        factoryAddress: [
          { required: true, message: "该项为必填项", trigger: "blur" },
        ],
        client: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        contact: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        address: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        phone: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        // productCertification: [
        //   { required: true, message: "该项为必填项", trigger: "blur" },
        // ],
      },
    };
  },
  created() {
    this.form.productId = this.$route.query.id - 0;

    this.getData(this.form.productId);
  },
  filters: {
    formatApproveType(value) {
      if (value === 0) {
        return "未审核";
      } else if (value === 1) {
        return "审核通过";
      } else if (value === 2) {
        return "审核未通过";
      }
    },
  },
  methods: {
    getData(id) {
      fetchNotAuthDetail(id).then((res) => {
        this.form = res.data;
        this.getProductData(res.data.productId);
      });
    },
    // 获取商品信息
    getProductData(id) {
      let that = this;
      getProduct(id).then((res) => {
        that.productName = res.data.name;
        that.approveStatus = res.data.isApprove;
      });
    },
    handleApproveStatu(isApprove) {
      handleApprove(this.form.id, { isApprove: isApprove }).then((res) => {
        this.$message({
          type: "success",
          message: res.message,
        });
      });
      fetchNotAuthDetail(this.form.id).then((res) => {
        this.form = res.data;
      });
    },
    // 添加商品信息
    addItem() {
      this.form.dynamicItem.push({
        productName: "",
        productDesc: "",
        productStock: "",
        productPics: "",
      });
    },
    // 删除商品信息
    deleteItem(item, index) {
      this.form.dynamicItem.splice(index, 1);
    },
  },
};
</script>

<style>
.form {
  padding: 55px 55px 35px 55px;
  margin: 20px 200px;
  background-color: #fff;
}
.productAdd {
  background: #f6f8fa;
  padding: 20px 40px;
  margin: 20px 0;
}
.productAdd .header {
  display: flex;
  justify-content: space-between;
}
</style>