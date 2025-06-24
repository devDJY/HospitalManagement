<template>
  <el-dialog :title="title" v-model="visible" width="600px" :close-on-click-modal="false">
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="100px" label-position="right">
      <el-form-item label="账号" prop="userName">
        <el-input v-model="formData.userName" placeholder="请输入..." />
      </el-form-item>

      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="nickName">
        <el-input v-model="formData.nickName" placeholder="请输入..." />
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="formData.gender">
          <el-radio label="男" :value="1" />
          <el-radio label="女" :value="2" />
          <el-radio label="保密" :value="0" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" />
      </el-form-item>

      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>

      <el-form-item label="单位类型" prop="companyType" :rules="[{ required: true, message: '请选择单位类型', trigger: 'change' }]">
        <el-select v-model="formData.companyType" placeholder="请选择单位类型">
          <el-option label="临床实验机构" :value="1" />
          <el-option label="合同研究组织" :value="2" />
          <el-option label="申办方" :value="3" />
          <el-option label="SMO" :value="4" />
          <el-option label="其他" :value="5" />
        </el-select>
      </el-form-item>

      <el-form-item label="单位名称" prop="companyNo">
        <el-select v-model="formData.companyNo" filterable remote reserve-keyword placeholder="请输入开始查询单位名称" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in options" :key="item.value" :label="item.companyName" :value="item.id" />
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

      <el-form-item label="权限组" prop="permissionGroupId">
        <el-select v-model="formData.permissionGroupId" placeholder="请选择">
          <el-option label="CRC" :value="1" />
          <el-option label="CRA" :value="2" />
          <el-option label="机构办秘书" :value="3" />
          <el-option label="机构办质控员" :value="4" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="formData.isPermanent">永久用户</el-checkbox>
        <el-checkbox v-model="formData.isSurveySms">接收调研短信</el-checkbox>
      </el-form-item>

      <el-form-item v-if="!formData.isPermanent" label="开始有效期" prop="startTime">
        <el-date-picker v-model="formData.startTime" type="datetime" placeholder="选择日期时间" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <el-form-item v-if="!formData.isPermanent" label="结束有效期" prop="expireTime">
        <el-date-picker v-model="formData.expireTime" type="datetime" placeholder="选择日期时间" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
    <AddUnitDialog :visible="dialogVisible" @update:visible="val => (dialogVisible = val)" @confirm="handleUnitConfirm" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getRegisterGroups, companyInfoList, getVerifyCode, register } from "@/api/modules/register";
import AddUnitDialog from "./AddUnitDialog.vue";
import { registerByManager, updateUserInfo } from "@/api/modules/user";
import { authGroupMenuList } from "@/api/modules/authGroup";
import dayjs from "dayjs";

const rules = {
  permissionGroupId: [{ required: true, message: "请选择申请角色", trigger: "change" }],
  userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  nickName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1(3[0-9]|4[5-9]|5[0-35-9]|6[6]|7[0-8]|8[0-9]|9[8-9])\d{8}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  email: [{ required: true, message: "请输入电子邮箱", trigger: "blur" }],
  companyNo: [{ required: true, message: "请选择单位名称", trigger: "change" }],
  startTime: [{ required: true, message: "请选择开始有效期", trigger: "change" }],
  expireTime: [{ required: true, message: "请选择结束有效期", trigger: "change" }],
  companyType: [{ required: true, message: "请选择单位类型", trigger: "change" }]
};
const visible = ref(false);
const options = ref();
const formRef = ref();
const formData = reactive({
  companyNo: "",
  companyType: "",
  mobile: "",
  email: "",
  expireTime: "",
  gender: 1,
  isPermanent: false,
  isSurveySms: false,
  nickName: "",
  password: "",
  permissionGroupId: "",
  startTime: "",
  userName: "",
  verifyCode: "",
  id: 0
});
const dialogVisible = ref(false);
const companyInfos = ref();
onMounted(() => {
  // getRegisterGroups().then(res => {
  //   registerGroups.value = res.data;
  // });
  companyInfoList({}).then(res => {
    companyInfos.value = res.data;
  });
  // authGroupMenuList({}).then(res => {});
  // list.value = states.map(item => {
  //   return { value: `value:${item}`, label: `label:${item}` };
  // });
});
const loading = ref(false);
const remoteMethod = query => {
  if (query) {
    loading.value = true;
    companyInfoList({}).then((res: any) => {
      loading.value = false;
      options.value = res.data.filter(item => {
        return item.companyName.toLowerCase().includes(query.toLowerCase());
      });
    });
  } else {
    options.value = companyInfos.value;
  }
};
const title = ref("新增用户");
const yesEditing = ref(false);
const initForm = () => {
  let init = {
    companyNo: "",
    companyType: "",
    mobile: "",
    email: "",
    expireTime: "",
    gender: 1,
    isPermanent: false,
    isSurveySms: false,
    nickName: "",
    password: "",
    permissionGroupId: "",
    startTime: "",
    userName: "",
    verifyCode: "",
    id: 0
  };
  Object.assign(formData, init);
};
const open = userData => {
  yesEditing.value = false;
  title.value = "新增用户";
  initForm();
  if (userData) {
    title.value = "编辑用户";
    yesEditing.value = true;
    Object.assign(formData, userData);
  }
  visible.value = true;
};

const handleUnitConfirm = unitData => {
  console.log("新增的单位信息:", unitData);
  // 这里可以处理提交逻辑
};
const emit = defineEmits(["refreshData"]);
const handleSubmit = async () => {
  await formRef.value.validate();
  try {
    if (yesEditing.value && !formData.isPermanent) {
      const _formData = {
        ...formData,
        isPermanent: formData.isPermanent ? 1 : 0,
        isSurveySms: formData.isSurveySms ? 1 : 0,
        userId: formData.id,
        startTime: dayjs(formData.startTime).format("YYYY-MM-DDTHH:mm:ss"),
        expireTime: dayjs(formData.expireTime).format("YYYY-MM-DDTHH:mm:ss")
      };
      await updateUserInfo(_formData);
    } else if (yesEditing.value && formData.isPermanent) {
      const _formData = {
        ...formData,
        isPermanent: formData.isPermanent ? 1 : 0,
        isSurveySms: formData.isSurveySms ? 1 : 0,
        userId: formData.id,
        startTime: undefined,
        expireTime: undefined
      };
      await updateUserInfo(_formData);
    } else if (formData.isPermanent) {
      const _formData = {
        ...formData,
        isPermanent: formData.isPermanent ? 1 : 0,
        isSurveySms: formData.isSurveySms ? 1 : 0,
        userId: formData.id,
        startTime: undefined,
        expireTime: undefined
      };
      await registerByManager(_formData);
    } else {
      const _formData = {
        ...formData,
        isPermanent: formData.isPermanent ? 1 : 0,
        isSurveySms: formData.isSurveySms ? 1 : 0,
        userId: formData.id,
        startTime: dayjs(formData.startTime).format("YYYY-MM-DDTHH:mm:ss"),
        expireTime: dayjs(formData.expireTime).format("YYYY-MM-DDTHH:mm:ss")
      };
      await registerByManager(_formData);
    }
    emit("refreshData");
  } catch (error: any) {
    ElMessage.error(error.message ?? "操作失败");
    return;
  }
  ElMessage.success("操作成功");
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
