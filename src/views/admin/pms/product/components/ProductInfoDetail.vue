<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      :rules="rules"
      ref="productInfoForm"
      label-width="120px"
      class="form-inner-container"
      size="small"
    >
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-input
          v-model="value.productCategoryName"
          style="width: 300px"
          placeholder="请选择商品类别"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input placeholder="请输入商品名称" v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input
          v-model="value.subTitle"
          placeholder="请填写商品副标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入商品介绍"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input
          placeholder="请输入商品货号"
          v-model="value.productSn"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="price">
        <el-input-number
          v-model="value.price"
          style="width: 300px"
        ></el-input-number>
        <span style="margin-left: 20px">（货币单位：人民币）</span>
      </el-form-item>
      <el-form-item label="商品库存：" prop="stock">
        <el-input-number
          v-model="value.stock"
          style="width: 300px"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="商品重量：">
        <el-input v-model="value.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="商品图册：" prop="productPicList">
        <multi-upload v-model="albumPics" :max-count="5"></multi-upload>
      </el-form-item>
      <el-form-item label="商品认证:" prop="productCertification">
        <single-upload v-model="value.proveImage"></single-upload>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="goback()">返回</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handleNext('productInfoForm')"
          >下一页</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getProduct } from "@/api/product";
import { fetchListWithChildren } from "@/api/productCate";
import SingleUpload from "@/components/Upload/singleUpload";
import MultiUpload from "@/components/Upload/multiUpload";

export default {
  name: "ProductInfoDetail",
  components: {
    MultiUpload,
    SingleUpload,
  },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasEditCreated: false,
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [],
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        productCategoryId: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
        price: [{ required: true, message: "请填写商品售价", trigger: "blur" }],
        stock: [{ required: true, message: "请填写商品售价", trigger: "blur" }],
        productDesc: [
          { required: true, message: "请输入商品介绍", trigger: "blur" },
        ],
        subTitle: [
          { required: true, message: "请输入商品副标题", trigger: "blur" },
        ],
        // productPicList: [
        //   { required: true, message: "请上传商品图册", trigger: "blur" },
        // ],
        requiredProp: [
          { required: true, message: "该项为必填项", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getProductCateList();
  },
  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    },
    // 商品的主图和图册
    albumPics: {
      get: function () {
        let pics = [];
        if (
          this.value.pic === undefined ||
          this.value.pic == null ||
          this.value.pic === ""
        ) {
          return pics;
        }
        pics.push(this.value.pic);
        if (
          this.value.albumPics === undefined ||
          this.value.albumPics == null ||
          this.value.albumPics === ""
        ) {
          return pics;
        }
        let albumPics = this.value.albumPics.split(",");
        for (let i = 0; i < albumPics.length; i++) {
          pics.push(albumPics[i]);
        }
        return pics;
      },
      set: function (newValue) {
        if (newValue == null || newValue.length === 0) {
          this.value.pic = null;
          this.value.albumPics = null;
        } else {
          this.value.pic = newValue[0];
          this.value.albumPics = "";
          if (newValue.length > 1) {
            for (let i = 1; i < newValue.length; i++) {
              this.value.albumPics += newValue[i];
              if (i !== newValue.length - 1) {
                this.value.albumPics += ",";
              }
            }
          }
        }
      },
    },
  },
  watch: {
    productId: function (newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.productCategoryId = newValue[1];
        this.value.productCategoryName = this.getCateNameById(
          this.value.productCategoryId
        );
      } else {
        this.value.productCategoryId = null;
        this.value.productCategoryName = null;
      }
    },
  },
  methods: {
    //处理编辑逻辑
    handleEditCreated() {
      if (this.value.productCategoryId != null) {
        this.selectProductCateValue.push(this.value.cateParentId);
        this.selectProductCateValue.push(this.value.productCategoryId);
      }
      this.hasEditCreated = true;
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
    getCateNameById(id) {
      let name = null;
      for (let i = 0; i < this.productCateOptions.length; i++) {
        for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
          if (this.productCateOptions[i].children[j].value === id) {
            name = this.productCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },
    // 下一页
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    // 返回
    goback() {
      this.$emit("backToList");
    },
  },
};
</script>

<style scoped>
</style>
