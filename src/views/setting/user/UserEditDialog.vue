<template>
  <el-dialog title="编辑用户" v-model="visible" width="600px" :close-on-click-modal="false">
    <el-form :model="formData" label-width="100px" label-position="right">
      <el-form-item label="账号">
        <el-text>{{ formData.account }}</el-text>
      </el-form-item>

      <el-form-item label="真实姓名">
        <el-text>{{ formData.realName }}</el-text>
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="formData.gender">
          <el-radio label="男" />
          <el-radio label="女" />
          <el-radio label="保密" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>

      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>

      <el-form-item label="单位类型">
        <el-select v-model="formData.companyType" placeholder="请选择">
          <el-option label="申办方" value="申办方" />
          <el-option label="CRO" value="CRO" />
          <el-option label="SMO" value="SMO" />
          <el-option label="机构" value="机构" />
        </el-select>
      </el-form-item>

      <el-form-item label="单位名称">
        <el-input v-model="formData.companyName">
          <template #append>
            <el-button type="primary" @click="handleAddCompany" v-if="!formData.companyName"> 添加公司 </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="权限组">
        <el-select v-model="formData.role" placeholder="请选择">
          <el-option label="CRA" value="CRA" />
          <el-option label="PM" value="PM" />
          <el-option label="管理员" value="管理员" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="formData.isPermanent">永久用户</el-checkbox>
        <el-checkbox v-model="formData.receiveSurvey">接收调研短信</el-checkbox>
      </el-form-item>

      <el-form-item label="开始有效期">
        <el-date-picker v-model="formData.startDate" type="datetime" placeholder="选择日期时间" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <el-form-item label="结束有效期">
        <el-date-picker v-model="formData.endDate" type="datetime" placeholder="选择日期时间" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

interface UserForm {
  account: string;
  realName: string;
  gender: "男" | "女" | "保密";
  phone: string;
  email: string;
  companyType: string;
  companyName: string;
  role: string;
  isPermanent: boolean;
  receiveSurvey: boolean;
  startDate: string;
  endDate: string;
}

const visible = ref(false);

const formData = reactive<UserForm>({
  account: "pangwa",
  realName: "黎志立",
  gender: "男",
  phone: "18884337804",
  email: "zhili1.li@qilu-pharma.com",
  companyType: "申办方",
  companyName: "齐鲁制药有限公司",
  role: "CRA",
  isPermanent: true,
  receiveSurvey: true,
  startDate: "2025-05-15 00:00:00",
  endDate: "2028-05-15 23:59:59"
});

const open = (userData?: Partial<UserForm>) => {
  if (userData) {
    Object.assign(formData, userData);
  }
  visible.value = true;
};

const handleAddCompany = () => {
  ElMessage.info("跳转到添加公司页面");
  // 实际项目中这里可以跳转到公司添加页面或打开另一个弹窗
};

const handleSubmit = () => {
  ElMessage.success("用户信息更新成功");
  visible.value = false;
  // 这里可以添加表单提交逻辑
};

defineExpose({
  open
});
</script>

<style scoped>
.el-form-item {
  margin-bottom: 18px;
}
</style>
