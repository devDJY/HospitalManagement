<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="600px" draggable>
    <el-form :model="form" label-width="100px">
      <el-form-item label="账号">
        <el-input v-model="form.account" disabled />
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="form.realName" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="男" />
          <el-radio label="女" />
          <el-radio label="保密" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="单位类型">
        <el-input v-model="form.organization" />
      </el-form-item>
      <el-form-item label="权限组">
        <el-switch v-model="form.hasPermissionGroup" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="永久用户">
        <el-switch v-model="form.isPermanent" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="注册日期">
        <el-input v-model="form.registerDate" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

interface UserInfo {
  account: string;
  realName: string;
  gender: string;
  mobile: string;
  email: string;
  organization: string;
  hasPermissionGroup: boolean;
  isPermanent: boolean;
  registerDate: string;
}

const dialogVisible = ref(false);
const form = reactive<UserInfo>({
  account: "",
  realName: "",
  gender: "保密",
  mobile: "",
  email: "",
  organization: "",
  hasPermissionGroup: false,
  isPermanent: false,
  registerDate: ""
});

const openDialog = (userData?: Partial<UserInfo>) => {
  if (userData) {
    Object.assign(form, userData);
  }
  dialogVisible.value = true;
};

const submitForm = () => {
  // Here you would typically call an API to save the user info
  console.log("Form submitted:", form);
  ElMessage.success("个人信息保存成功");
  dialogVisible.value = false;
};

defineExpose({ openDialog });
</script>
