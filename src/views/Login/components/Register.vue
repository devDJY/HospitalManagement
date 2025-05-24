<template>
  <el-dialog
    title="新用户注册"
    width="80%"
    class="forget-password-dialog"
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <div class="dec">请填写基本信息 提交注册请求后需等待机构管理员审批，审批时长为1个工作日</div>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-row :gutter="20">
        <!-- 第一行 -->
        <el-col :span="12">
          <el-form-item label="申请角色" prop="role" :rules="[{ required: true, message: '请选择申请角色', trigger: 'change' }]">
            <el-select v-model="form.role" placeholder="请选择...">
              <el-option label="角色1" value="role1" />
              <el-option label="角色2" value="role2" />
              <el-option label="角色3" value="role3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"></el-col>

        <!-- 第二行 -->
        <el-col :span="8">
          <el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
            <el-input v-model="form.account" placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input type="password" v-model="form.password" placeholder="请输入密码" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="确认密码"
            prop="confirmPassword"
            :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]"
          >
            <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码" />
          </el-form-item>
        </el-col>

        <!-- 第三行 -->
        <el-col :span="12">
          <el-form-item
            label="单位类型"
            prop="companyType"
            :rules="[{ required: true, message: '请选择单位类型', trigger: 'change' }]"
          >
            <el-select v-model="form.companyType" placeholder="请选择单位类型">
              <el-option label="企业" value="enterprise" />
              <el-option label="事业单位" value="institution" />
              <el-option label="政府机关" value="government" />
              <el-option label="社会团体" value="organization" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="单位名称"
            prop="companyName"
            :rules="[{ required: true, message: '请选择单位名称', trigger: 'change' }]"
          >
            <el-select
              v-model="form.companyName"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入开始查询单位名称"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              <template #loading>
                <svg class="circular" viewBox="0 0 50 50">
                  <circle class="path" cx="25" cy="25" r="20" fill="none" />
                </svg>
              </template>
            </el-select>

            <span style="display: flex">（未搜索到公司名称，点击 </span>
            <el-text class="mx-1" @click="dialogVisible = true" type="danger">此处</el-text>
            <span style="display: flex"> 添加）</span>
          </el-form-item>
        </el-col>

        <!-- 第四行 -->
        <el-col :span="8">
          <el-form-item label="真实姓名" prop="userName" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
            <el-input v-model="form.userName" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电子邮箱" prop="email" :rules="[{ required: true, message: '请输入电子邮箱', trigger: 'blur' }]">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="8"> </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="phone" :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>

        <!-- 第五行 -->
        <el-col :span="12">
          <el-form-item
            label="验证码"
            prop="verificationCode"
            :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
            style="display: flex; align-items: center"
          >
            <el-input v-model="form.verificationCode" placeholder="请输入手机验证码" style="width: 50%; margin-right: 10px" />
            <el-button @click="getVerificationCode" :disabled="countdown > 0">
              {{ countdown > 0 ? countdown + "秒后重发" : "获取验证码" }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">注册</el-button>
        <el-button @click="resetForm">返回 </el-button>
      </el-form-item>
    </el-form>
    <AddUnitDialog :visible="dialogVisible" @update:visible="val => (dialogVisible = val)" @confirm="handleUnitConfirm" />
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import AddUnitDialog from "./AddUnitDialog.vue";
defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);
const dialogVisible = ref(false);
const options = ref([]);
const formRef = ref();
const form = reactive({
  role: "",
  account: "",
  companyType: "",
  password: "",
  userName: "",
  confirmPassword: "",
  phone: "",
  email: "",
  companyName: "",
  verificationCode: ""
});

const loading = ref(false);
// 验证密码一致性
const validatePass = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const rules = {
  role: [{ required: true, message: "请选择申请角色", trigger: "change" }],
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { validator: validatePass, trigger: "blur" }
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入电子邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }
  ],
  verificationCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};

const countdown = ref(0);
let timer = null;

const getVerificationCode = () => {
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
const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];
const list = ref([]);
onMounted(() => {
  list.value = states.map(item => {
    return { value: `value:${item}`, label: `label:${item}` };
  });
});

const handleUnitConfirm = unitData => {
  console.log("新增的单位信息:", unitData);
  // 这里可以处理提交逻辑
};
const remoteMethod = query => {
  if (query) {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      options.value = list.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase());
      });
    }, 3000);
  } else {
    options.value = [];
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    // 验证通过，提交表单
    ElMessage.success("注册成功");
    resetForm();
    emit("update:modelValue", false);
  } catch (error) {
    ElMessage.error("请填写完整的表单信息");
  }
};

const resetForm = () => {
  formRef.value?.resetFields();
  clearInterval(timer);
  countdown.value = 0;
  emit("update:modelValue", false);
};

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.dec {
  width: 80%;
  margin-bottom: 10px;
  font-size: 12px;
  color: #9e9e9e;
}
.el-form-item {
  margin-bottom: 20px;
}
.mx-1 {
  cursor: pointer;
}
</style>
