<template>
   
  <div class="product-form">
    <el-card class="form-container" shadow="never">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品展示页"></el-step>
      </el-steps>
      <product-info-detail
        v-show="showStatus[0]"
        v-model="productParam"
        :is-edit="isEdit"
        @nextStep="nextStep"
        @backToList="backToList"
      >
      </product-info-detail>
      <product-attr-detail
        v-show="showStatus[1]"
        v-model="productParam"
        :is-edit="isEdit"
        @nextStep="nextStep"
        @prevStep="prevStep"
      >
      </product-attr-detail>
      <product-sale-detail
        v-show="showStatus[2]"
        v-model="productParam"
        :is-edit="isEdit"
        @prevStep="prevStep"
        @changeNewStatus="handleNewStatus"
        @finishCommit="finishCommit"
      >
      </product-sale-detail>
    </el-card>
  </div>
</template>
<script>
import ProductInfoDetail from "./ProductInfoDetail";
import ProductSaleDetail from "./ProductSaleDetail";
import ProductAttrDetail from "./ProductAttrDetail";
import { createProduct, getProduct, updateProduct } from "@/api/product";
import store from "@/store";

const defaultProductParam = {
  //   productCategoryId: null,
  //   productCategoryName: "",
  //   name: "",
  //   description: "",
  //   productSn: "",
  //   price: 0,
  //   stock: 0,
  //   publishStatus: 0,
  //   albumPics: "",
  //   proveImage: "",
  //   publishStatus: 1,
  //   recommendStatus: 0,
  //   serviceIds: "",
  //   detailHtml: "",
  //   note: "",
  //   sort: 0,
  //   subTitle: "",
  //   unit: "",
  //   weight: 0,
  //   promotionStartTime: "",
  //   promotionEndTime: "",
  //   promotionPerLimit: 0,
  //   productAttributeCategoryId: null,
  //   //商品属性相关{productAttributeId: 0, value: ''}
  //   productAttributeValueList: [],
  //   //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
  //   skuStockList: [],
  //   deleteStatus: 0,
  //   detailDesc: "",
  //   detailMobileHtml: "",
  //   detailTitle: "",
  //   feightTemplateId: 0,
  //   flashPromotionCount: 0,
  //   flashPromotionId: 0,
  //   flashPromotionPrice: 0,
  //   flashPromotionSort: 0,
  //   giftPoint: 0,
  //   giftGrowth: 0,
  //   keywords: "",
  //   lowStock: 0,
  //   newStatus: 0,
  //   originalPrice: 0,
  //   pic: "",
  //   //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
  //   memberPriceList: [],
  //   //商品满减
  //   productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
  //   //商品阶梯价格
  //   productLadderList: [{ count: 0, discount: 0, price: 0 }],
  //   previewStatus: 0,
  //   //商品相关专题{subjectId: 0}
  //   subjectProductRelationList: [],
  //   //商品相关优选{prefrenceAreaId: 0}
  //   prefrenceAreaProductRelationList: [],
  //   promotionPrice: null,
  //   promotionStartTime: "",
  //   promotionType: 0,
  //   publishStatus: 0,
  //   recommandStatus: 0,
  //   sale: 0,
  //   usePointLimit: 0,
  //   verifyStatus: nullw,

  verifyStatus: 1,
};
export default {
  name: "ProductDetail",
  components: {
    ProductInfoDetail,
    ProductSaleDetail,
    ProductAttrDetail,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: 0,
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false, false, false],
    };
  },
  created() {
    if (this.isEdit) {
      getProduct(this.$route.query.id).then((response) => {
        this.productParam = response.data;
      });
    }
  },
  methods: {
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    // 上一页
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    // 下一页
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    // 返回列表页
    backToList() {
      this.$router.back();
    },
    // 通过同源认证
    handleNewStatus() {
      this.$confirm("是否通过该商品的通过认证", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.productParam.newStatus = 1;
        this.productParam.isApprove = null;
        updateProduct(this.$route.query.id, this.productParam).then(
          (response) => {
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000,
            });
            // this.$router.back();
          }
        );
      });
    },
    // 通过审核
    finishCommit(isEdit) {
      this.$confirm("是否通过该商品的审核", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.productParam.brandId = store.getters.id;
        this.productParam.brandName = store.getters.nickName;
        if (isEdit) {
          this.productParam.verifyStatus = 1;
          this.productParam.isApprove = null;
          updateProduct(this.$route.query.id, this.productParam).then(
            (response) => {
              this.$message({
                type: "success",
                message: "提交成功",
                duration: 1000,
              });
              this.$router.back();
            }
          );
        } else {
          createProduct(this.productParam).then((response) => {
            console.log(this.productParam);
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000,
            });
            location.reload();
          });
        }
      });
    },
  },
};
</script>
<style>
/* .product-form {
  height: 120vh;
} */
.form-container {
  width: 960px;
}
.form-inner-container {
  width: 800px;
}
</style>


