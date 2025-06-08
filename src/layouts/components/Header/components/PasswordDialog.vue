<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable>
    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号码" :disabled="true" />
      </el-form-item>
      <el-form-item label="原密码" prop="oldPwd">
        <el-input v-model="form.oldPwd" placeholder="请输入原密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="form.newPwd" placeholder="请输入新密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" placeholder="请再次输入新密码" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { changePasswordApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const userStore = useUserStore();
const form = reactive({
  mobile: "",
  oldPwd: "",
  newPwd: "",
  confirmPassword: ""
});

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== form.newPwd) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  mobile: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  oldPwd: [
    { required: true, message: "请输入原密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6-20个字符", trigger: "blur" }
  ],
  newPwd: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6-20个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" }
  ]
});

const openDialog = () => {
  dialogVisible.value = true;
  // Reset form when opening
  if (formRef.value) {
    formRef.value.resetFields();
  }
  form.mobile = userStore.userInfo.mobile || "";
};

const submitForm = () => {
  if (!formRef.value) return;

  formRef.value.validate(valid => {
    if (valid) {
      // Here you would typically call an API to change the password
      changePasswordApi(form)
        .then(() => {
          ElMessage.success("密码修改成功");
          dialogVisible.value = false;
        })
        .catch(() => {
          ElMessage.error("密码修改失败");
        });
      dialogVisible.value = false;
    } else {
      ElMessage.warning("请填写正确的表单信息");
    }
  });
};

defineExpose({ openDialog });
</script>
