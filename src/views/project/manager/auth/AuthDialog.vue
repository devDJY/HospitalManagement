<template>
  <el-dialog v-model="visible" title="项目授权" width="800px" :close-on-click-modal="false">
    <!-- 查询表单 -->
    <el-form :model="queryForm" label-width="80px" class="query-form">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input v-model="queryForm.name" placeholder="请输入..." clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位名称">
            <el-input v-model="queryForm.organization" placeholder="请输入..." clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8" class="form-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 授权状态筛选 -->
    <div class="auth-filter">
      <el-radio-group v-model="authStatus">
        <el-radio-button label="authorized">已授权</el-radio-button>
        <el-radio-button label="unauthorized">未授权</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 授权表格 -->
    <el-table :data="filteredUserList" border style="width: 100%" class="auth-table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="organization" label="单位名称" />
      <el-table-column prop="role" label="权限组" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="handleAuth(scope.row)">
            {{ scope.row.authorized ? "取消授权" : "授权" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存授权</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import type { ElTable } from "element-plus";

interface User {
  id: string;
  name: string;
  organization: string;
  role: string;
  authorized: boolean;
}

const visible = ref(false);
const authStatus = ref<"all" | "authorized" | "unauthorized">("all");
const multipleSelection = ref<User[]>([]);

// 查询表单数据
const queryForm = reactive({
  name: "",
  organization: ""
});

// 模拟用户数据
const userList = ref<User[]>([
  { id: "1", name: "黎志立", organization: "CRA", role: "CRA", authorized: false },
  { id: "2", name: "胡永喆", organization: "CRA", role: "CRA", authorized: false },
  { id: "3", name: "张丽", organization: "德阳市人民医院", role: "机构办质控员", authorized: true },
  { id: "4", name: "甘春燕", organization: "德阳市人民医院", role: "机构办质控员", authorized: true },
  { id: "5", name: "杨洛涌", organization: "德阳市人民医院", role: "机构超级管理员", authorized: true }
]);

// 过滤后的用户列表
const filteredUserList = computed(() => {
  return userList.value.filter(user => {
    // 根据授权状态过滤
    const statusMatch =
      authStatus.value === "all" ||
      (authStatus.value === "authorized" && user.authorized) ||
      (authStatus.value === "unauthorized" && !user.authorized);

    // 根据查询条件过滤
    const queryMatch =
      (queryForm.name === "" || user.name.includes(queryForm.name)) &&
      (queryForm.organization === "" || user.organization.includes(queryForm.organization));

    return statusMatch && queryMatch;
  });
});

// 打开弹窗
const openDialog = () => {
  visible.value = true;
};

// 查询
const handleQuery = () => {
  console.log("查询条件:", queryForm);
};

// 重置查询
const handleReset = () => {
  queryForm.name = "";
  queryForm.organization = "";
};

// 表格选择变化
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

// 单个用户授权/取消授权
const handleAuth = (user: User) => {
  user.authorized = !user.authorized;
};

// 提交授权
const handleSubmit = () => {
  console.log("已选择的用户:", multipleSelection.value);
  console.log("授权状态变更:", userList.value);
  visible.value = false;
  // 这里可以添加实际保存授权的API调用
};

// 暴露方法给父组件
defineExpose({
  openDialog
});
</script>

<style scoped lang="scss">
.query-form {
  margin-bottom: 20px;
  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
}
.auth-filter {
  margin-bottom: 15px;
}
.auth-table {
  margin-bottom: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
