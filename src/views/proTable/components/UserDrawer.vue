<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form
      ref="formRef"
      label-width="100px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <!-- 头像上传 -->
      <el-form-item label="用户头像" prop="avatar">
        <!-- <UploadImg v-model:image-url="drawerProps.row.avatar" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip>头像大小不能超过 3M</template>
        </UploadImg> -->
      </el-form-item>

      <!-- 照片上传 -->
      <el-form-item label="用户照片" prop="photo">
        <!-- <UploadImgs v-model:file-list="drawerProps.row.photo" height="140px" width="140px" border-radius="50%">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip>照片大小不能超过 5M</template>
        </UploadImgs> -->
      </el-form-item>

      <!-- 基本信息字段 -->
      <el-form-item label="用户姓名" prop="username">
        <el-input v-model="drawerProps.row.username" placeholder="请填写用户姓名" clearable />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="drawerProps.row.gender" placeholder="请选择性别" clearable>
          <el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="drawerProps.row.idCard" placeholder="请填写身份证号" clearable />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row.email" placeholder="请填写邮箱" clearable />
      </el-form-item>

      <el-form-item label="居住地址" prop="address">
        <el-input v-model="drawerProps.row.address" placeholder="请填写居住地址" clearable />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance, type UploadUserFile } from "element-plus";
import { Avatar, Picture } from "@element-plus/icons-vue";
import { genderType } from "@/utils/dict";
import type { User } from "@/api/interface";
import UploadImg from "@/components/Upload/Img.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList> & {
    photo?: UploadUserFile[];
  };
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

// 表单验证规则
const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  photo: [{ required: true, message: "请上传用户照片" }],
  username: [{ required: true, message: "请填写用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  idCard: [
    { required: true, message: "请填写身份证号" },
    { pattern: /^\d{17}[\dXx]$/, message: "请输入正确的身份证号" }
  ],
  email: [
    { required: true, message: "请填写邮箱" },
    { type: "email", message: "请输入正确的邮箱格式" }
  ],
  address: [{ required: true, message: "请填写居住地址" }]
});

const drawerVisible = ref(false);
const formRef = ref<FormInstance>();
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {
    photo: [] // 初始化照片数组
  }
});

/**
 * 接收父组件参数并打开抽屉
 */
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = {
    ...drawerProps.value, // 保留默认值
    ...params,
    row: {
      photo: [], // 确保photo有默认值
      ...params.row
    }
  };
  drawerVisible.value = true;
};

/**
 * 提交表单数据
 */
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    if (!drawerProps.value.api) {
      throw new Error("缺少提交API");
    }

    await drawerProps.value.api(drawerProps.value.row);
    ElMessage.success(`${drawerProps.value.title}用户成功！`);

    drawerProps.value.getTableList?.();
    drawerVisible.value = false;
  } catch (error) {
    console.error("提交失败:", error);
  }
};

defineExpose({ acceptParams });
</script>

<style scoped>
/* 可以添加一些自定义样式 */
.el-form-item {
  margin-bottom: 22px;
}
</style>
