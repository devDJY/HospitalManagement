<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="userName">
      <el-input v-model="loginForm.userName" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="密码：123456" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
      <div class="bar_te">
        <el-link type="primary" @click="showModal = true" class="login-link">忘记密码</el-link>
        <el-link type="primary" @click="RegisterModal = true" class="login-link">注册账号</el-link>
      </div>
    </el-form-item>
  </el-form>

  <div class="login-btn">
    <ForgetPassword v-model="showModal" />
    <Register v-model="RegisterModal" />
    <!-- <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 {{ showModal }}</el-button> -->
    <el-button style="width: 100%;" :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
// import { getTimeState } from "@/utils";
import { Login } from "@/api/interface";
// import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { useAuthStore } from "@/stores/modules/auth";
// import md5 from "md5";
// @ts-ignore
import ForgetPassword from "./ForgetPassword.vue";
import Register from "./Register.vue";
import { localSet } from "@/utils";
const showModal = ref(false);
const RegisterModal = ref(false);
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  userName: "",
  password: ""
});

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data } = await loginApi({ ...loginForm, password: loginForm.password });
      userStore.setToken(data.token);
      userStore.setUserInfo(data.userInfo);
      const authStore = useAuthStore();
      localSet("routerInfo", data.routerInfo);
      await authStore.getAuthMenuList(data.routerInfo);
      // 2.添加动态路由
      await initDynamicRouter();
      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);
      // 4.跳转到首页
      // router.push(HOME_URL);
      router.push(data.routerInfo[0].children[0].path);
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});

onBeforeUnmount(() => {
  document.onkeydown = null;
});
</script>

<style scoped lang="scss">
@use "../index" as *;
.bar_te {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
}
</style>
