<template>
  <el-dialog
    title="忘记密码？"
    :model-value="dialogVisible"
    @update:model-value="
      val => {
        dialogVisible = val;
        emit('update:modelValue', val);
      }
    "
    width="450px"
    class="forget-password-dialog"
  >
    <el-form :model="form" :rules="rules" ref="resetFormRef" label-width="80px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="form.code" placeholder="请输入手机验证码" style="width: 200px; margin-right: 10px" />
        <el-button @click="sendCode" :disabled="countdown > 0">
          {{ countdown > 0 ? countdown + "秒后重发" : "获取验证码" }}
        </el-button>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleReset">提交</el-button>
        <el-button @click="cancelReset">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";

// 接收父组件传来的 `modelValue`
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

// 触发父组件更新 `modelValue`
const emit = defineEmits(["update:modelValue"]);

const dialogVisible = ref(props.modelValue); // 控制弹窗的显示与隐藏
const countdown = ref(0); // 验证码倒计时
let timer: any;
watch(
  () => props.modelValue,
  val => {
    dialogVisible.value = val;
  }
);
const form = reactive({
  phone: "",
  code: "",
  password: "",
  confirmPassword: ""
});

const rules = {
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

const resetFormRef = ref<FormInstance>();

// 发送验证码
const sendCode = () => {
  if (!form.phone) {
    ElMessage.error("请先输入手机号");
    return;
  }
  ElMessage.success("验证码已发送");
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
};

// 提交重置密码
const handleReset = () => {
  resetFormRef.value?.validate(valid => {
    if (!valid) return;
    ElMessage.success("密码重置成功");
    emit("update:modelValue", false); // 关闭弹窗
  });
};

// 取消按钮，关闭弹窗
const cancelReset = () => {
  console.log("点击取消，发出关闭事件");
  emit("update:modelValue", false);
};
</script>

<style scoped lang="scss">
.forget-password-dialog {
  width: 400px;
}
</style>
