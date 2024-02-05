<template>
  <el-card class="form-container" shadow="never">
    <el-form
      :model="article"
      :rules="rules"
      ref="articleFrom"
      label-width="100px"
    >
      <el-form-item label="文章标题：" prop="articleTitle">
        <el-input
          v-model="article.articleTitle"
          placeholder="请填写文章标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章类别：" prop="articleCategory">
        <el-select v-model="article.articleCategory" placeholder="请选择">
          <el-option
            v-for="item in articleOptions"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
            size="medium"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面：" prop="articlePic">
        <single-upload v-model="article.articlePic"></single-upload>
      </el-form-item>
      <el-form-item label="文章详情：" prop="articleContent">
        <vue-editor
          v-model="article.articleContent"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('articleFrom')"
          >提交</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('articleFrom')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { policy } from "@/api/oss";
import { VueEditor } from "vue2-editor";
import singleUpload from "@/components/Upload/singleUpload.vue";
import {
  createArticle,
  getAirticleDetail,
  updateArticle,
} from "@/api/knowledge";
const defaultarticle = {
  articleTitle: "",
  articleCategory: "",
  articleContent: "",
  articlePic: "",
  showStatus: 1,
};
export default {
  name: "articleDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueEditor,
    singleUpload,
  },

  data() {
    return {
      article: Object.assign({}, defaultarticle),
      selectarticleList: [],
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
      rules: {
        articleTitle: [
          { required: true, message: "请填写文章标题", trigger: "blur" },
        ],
        articleCategory: [
          { required: true, message: "请选择文章类别", trigger: "blur" },
        ],
        // articleContent: [
        //   { required: true, message: "请上传文章封面", trigger: "blur" },
        // ],
        articleContent: [
          { required: true, message: "请填写文章详情", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      getAirticleDetail(this.$route.query.id).then((response) => {
        this.article = response.data;
      });
    } else {
      this.article = Object.assign({}, defaultarticle);
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            if (this.isEdit) {
              updateArticle(this.$route.query.id, this.article).then(
                (response) => {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000,
                  });
                  this.$router.back();
                }
              );
            } else {
              createArticle(this.article).then((response) => {
                this.$refs[formName].resetFields();
                this.resetForm(formName);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000,
                });
              });
            }
          });
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.article = Object.assign({}, defaultarticle);
      this.getSelectarticleList();
      this.filterProductAttrList = [
        {
          value: [],
        },
      ];
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();

      // policy
      policy()
        .then((response) => {
          formData.append("policy", response.data.policy);
          formData.append("signature", response.data.signature);
          formData.append("ossaccessKeyId", response.data.accessKeyId);
          formData.append("key", response.data.dir + "/${filename}");
          formData.append("dir", response.data.dir);
          formData.append("host", response.data.host);
          formData.append("file", file);
          // _self.dataObj.callback = response.data.callback;

          // oss
          Axios({
            url: "http://macro-oss.oss-cn-shenzhen.aliyuncs.com",
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data;charset=UTF-8",
            },
            data: formData,
          })
            .then((result) => {
              const resUrl = result.data.url; // Get url from response
              Editor.insertEmbed(cursorLocation, "image", resUrl);
              resetUploader();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
</style>
