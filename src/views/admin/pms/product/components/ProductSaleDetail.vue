<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      ref="productSaleForm"
      label-position="left"
      label-width="120px"
      class="form-inner-container"
      size="small"
    >
      <el-form-item label="商品上架：">
        <el-switch
          v-model="value.publishStatus"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <el-switch
          v-model="value.recommandStatus"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">7天无理由退换货</el-checkbox>
          <el-checkbox :label="2">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="展示页详情">
        <vue-editor
          v-model="value.detailHtml"
          useCustomImageHandler
          @imageAdded="handleImageAdded"
        ></vue-editor>
      </el-form-item>
      <el-form-item label="商品审核备注：">
        <el-input
          v-model="value.note"
          type="textarea"
          :autoSize="true"
        ></el-input>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一页</el-button>
        <!-- <el-button size="medium" type="primary" @click="handleFinishCommit"
          >通过审核</el-button
        ><el-button size="medium" type="primary" @click="handleNewStatus"
          >通过同源认证</el-button
        > -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { fetchList as fetchMemberLevelList } from "@/api/memberLevel";
import uploadimg from "@/api/oss";
export default {
  name: "ProductSaleDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueEditor,
  },
  data() {
    return {
      rules: {
        publishStatus: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        detailHtml: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.handleEditCreated();
    } else {
      fetchMemberLevelList({ defaultStatus: 0 }).then((response) => {
        let memberPriceList = [];
        for (let i = 0; i < response.data.length; i++) {
          let item = response.data[i];
          memberPriceList.push({
            memberLevelId: item.id,
            memberLevelName: item.name,
          });
        }
        this.value.memberPriceList = memberPriceList;
      });
    }
  },
  computed: {
    //选中的服务保证
    selectServiceList: {
      get() {
        let list = [];
        if (
          this.value.serviceIds === undefined ||
          this.value.serviceIds == null ||
          this.value.serviceIds === ""
        )
          return list;
        let ids = this.value.serviceIds.split(",");
        for (let i = 0; i < ids.length; i++) {
          list.push(Number(ids[i]));
        }
        return list;
      },
      set(newValue) {
        let serviceIds = "";
        if (newValue != null && newValue.length > 0) {
          for (let i = 0; i < newValue.length; i++) {
            serviceIds += newValue[i] + ",";
          }
          if (serviceIds.endsWith(",")) {
            serviceIds = serviceIds.substr(0, serviceIds.length - 1);
          }
          this.value.serviceIds = serviceIds;
        } else {
          this.value.serviceIds = null;
        }
      },
    },
  },
  methods: {
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      uploadimg({ formData }).then((response) => {});
      const res = await this.$http.post("upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
    handleEditCreated() {
      let ids = this.value.serviceIds.split(",");
      console.log("handleEditCreated", ids);
      for (let i = 0; i < ids.length; i++) {
        this.selectServiceList.push(Number(ids[i]));
      }
    },

    // 上一页
    handlePrev() {
      this.$emit("prevStep");
    },
    // 通过审核
    handleFinishCommit() {
      this.$emit("finishCommit", true);
    },
    // 通过同源认证
    handleNewStatus() {
      this.$emit("changeNewStatus");
    },
  },
};
</script>

<style scoped>
.littleMargin {
  margin-top: 10px;
}
</style>
