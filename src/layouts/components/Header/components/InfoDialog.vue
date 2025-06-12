<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="600px" draggable>
    <el-form :model="form" label-width="100px">
      <el-form-item label="账号">
        <el-input v-model="form.userName" disabled />
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="男" :value="1" />
          <el-radio label="女" :value="2" />
          <el-radio label="保密" :value="0" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="单位类型">
        <el-select v-model="form.companyType" placeholder="请选择单位类型">
          <el-option label="临床实验机构" :value="1" />
          <el-option label="合同研究组织" :value="2" />
          <el-option label="申办方" :value="3" />
          <el-option label="SMO" :value="4" />
          <el-option label="其他" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限组">
        <el-input v-model="form.permissionGroupName" disabled />
      </el-form-item>
      <el-form-item label="永久用户">
        <el-switch v-model="form.isPermanent" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="注册日期">
        <el-input v-model="form.registerTime" disabled />
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
import { useUserStore } from "@/stores/modules/user";
import { updateSelfInfo } from "@/api/modules/user";
const userStore = useUserStore();

const dialogVisible = ref(false);
const form = reactive({
  userName: "",
  nickName: "",
  gender: "保密",
  mobile: "",
  email: "",
  organization: "",
  permissionGroupName: "",
  isPermanent: false,
  registerTime: "",
  companyType: ""
});

const openDialog = () => {
  console.log("Opening dialog with user data:", userStore.userInfo);
  Object.assign(form, userStore.userInfo);
  dialogVisible.value = true;
};

const submitForm = async () => {
  // Here you would typically call an API to save the user info
  console.log("Form submitted:", form);
  let obj = {
    ...form,
    isPermanent: form.isPermanent ? 1 : 0
  };
  await updateSelfInfo(obj);
  ElMessage.success("个人信息保存成功");
  dialogVisible.value = false;
};

defineExpose({ openDialog });
</script>
