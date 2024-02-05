<template>
  <el-card class="form-container" shadow="never">
    <el-form
      :model="activity"
      :rules="rules"
      ref="activityFrom"
      label-width="100px"
    >
      <el-form-item label="活动标题：" prop="activityTitle">
        <el-input
          v-model="activity.activityTitle"
          placeholder="请填写活动标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="邀请专家：" prop="activityExpert">
        <el-input
          v-model="activity.activityExpert"
          placeholder="请填写专家名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动时间：" prop="activityTime">
        <el-date-picker
          v-model="activity.activityTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动地点：" prop="activityPlace">
        <el-input
          v-model="activity.activityPlace"
          placeholder="请填写活动地点"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动封面：" prop="activityPic">
        <!-- <el-input v-model="activity.activityPic"></el-input> -->
        <single-upload v-model="activity.activityPic"></single-upload>
      </el-form-item>
      <el-form-item label="活动详情：" prop="activityContent">
        <vue-editor
          v-model="activity.activityContent"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('activityFrom')"
          >提交</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('activityFrom')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import Axios from "axios";
import { VueEditor } from "vue2-editor";
import singleUpload from "@/components/Upload/singleUpload.vue";
import {
  createActivity,
  getActivityDetail,
  updateActivity,
} from "@/api/activity";
import { policy } from "@/api/oss";
const defaultactivity = {
  activityTitle: "",
  activityCategory: "",
  activityPic: "",
  activityContent: " ",
  activityTime: "",
  showStatus: 1,
};
export default {
  name: "activityDetail",
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
      activity: Object.assign({}, defaultactivity),
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
        // callback:'',
      },
      rules: {
        activityTitle: [
          { required: true, message: "请填写活动标题", trigger: "blur" },
        ],
        activityExpert: [
          { required: true, message: "请填写邀请专家", trigger: "blur" },
        ],
        activityTime: [
          { required: true, message: "请填写活动时间", trigger: "blur" },
        ],
        // activityPic: [
        //   { required: true, message: "请上传活动封面", trigger: "blur" },
        // ],
        activityPlace: [
          { required: true, message: "请填写活动地点", trigger: "blur" },
        ],
        activityContent: [
          { required: true, message: "请填写活动详情", trigger: "blur" },
        ],
        articleShowStatus: [
          { required: true, message: "请填写是否显示", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      getActivityDetail(this.$route.query.id).then((response) => {
        this.activity = response.data;
      });
    } else {
      this.activity = Object.assign({}, defaultactivity);
    }
  },
  methods: {
    // 提交
    onSubmit(formName) {
      this.$confirm("是否提交数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          updateActivity(this.$route.query.id, this.activity).then(
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
          createActivity(this.activity).then((response) => {
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
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.activity = Object.assign({}, defaultactivity);
      this.getSelectactivityList();
      this.filterProductAttrList = [
        {
          value: [],
        },
      ];
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
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
