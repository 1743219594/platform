<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="menu" :rules="rules" ref="menuFrom" label-width="150px">
      <el-form-item label="会员编号：" prop="title">
        <el-input v-model="menu.id"></el-input>
      </el-form-item>
      <el-form-item label="会员名称：" prop="title">
        <el-input v-model="menu.name"></el-input>
      </el-form-item>
      <el-form-item label="上级会员：">
        <el-select v-model="menu.parentId" placeholder="请选择会员">
          <el-option v-for="item in selectMenuList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('menuFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('menuFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
const defaultMenu = {
  parentId: "无上级会员",
  name: '',
  id: 0
};
export default {
  name: "MenuDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menu: Object.assign({}, defaultMenu),
      selectMenuList: [],
      rules: {
        name: [
          { required: true, message: '请输入会员名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    if (this.isEdit) {
      getMenu(this.$route.query.id).then(response => {
        this.menu = response.data;
      });
    } else {
      this.menu = Object.assign({}, defaultMenu);
    }
    this.getSelectMenuList();
  },
  methods: {
    getSelectMenuList() {
      fetchList(0, { pageSize: 100, pageNum: 1 }).then(response => {
        this.selectMenuList = response.data.list;
        this.selectMenuList.unshift({ id: 0, title: '无上级会员' });
      });
    },
    // 提交表单
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateMenu(this.$route.query.id, this.menu).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              createMenu(this.menu).then(response => {
                this.$refs[formName].resetFields();
                this.resetForm(formName);
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            }
          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.menu = Object.assign({}, defaultMenu);
      this.getSelectMenuList();
    },
  }
}
</script>

<style scoped></style>
