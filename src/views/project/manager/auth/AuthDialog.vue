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
            <el-input v-model="queryForm.companyName" placeholder="请输入..." clearable />
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
      <el-radio-group v-model="authStatus" @change="initList()">
        <el-radio-button label="authorized" :value="1">已授权</el-radio-button>
        <el-radio-button label="unauthorized" :value="2">未授权</el-radio-button>
      </el-radio-group>
      <div>
        <el-button v-if="authStatus == 0" type="success" @click="handleAuth">批量移除</el-button>
        <el-button v-if="authStatus == 1" type="success" @click="handleAuth">批量授权</el-button>
      </div>
    </div>

    <!-- 授权表格 -->
    <el-table :data="filteredUserList" border style="width: 100%" class="auth-table" @selection-change="handleSelectionChange"
      >>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="nickName" label="姓名" width="120" />
      <el-table-column prop="companyName" label="单位名称" />
      <el-table-column prop="groupName" label="权限组" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="handleAuthStatusChange(scope.row)">
            {{ authStatus == 0 ? "取消授权" : "授权" }}
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
import { ElMessage, type ElTable } from "element-plus";
import { projectAuthorizeUser, projectAuthorizeUserAdd, projectAuthorizeUserDelete } from "@/api/modules/project";

const visible = ref(false);
const authStatus = ref(1);
const multipleSelection = ref([]);

// 查询表单数据
const queryForm = reactive({
  name: "",
  companyName: ""
});

// 模拟用户数据
const userList = ref();
const userIds = ref<number[]>([]);
// 过滤后的用户列表
const filteredUserList = computed(() => {
  return userList.value;
});
const initList = () => {
  projectAuthorizeUser({ auditFlag: authStatus.value, projectId: projectId.value, ...queryForm }).then((res: any) => {
    userList.value = res.records;
  });
};
const projectId = ref();
// 打开弹窗
const openDialog = pa => {
  projectId.value = pa.projectId;
  initList();
  visible.value = true;
};

// 查询
const handleQuery = () => {
  initList();
};

// 重置查询
const handleReset = () => {
  queryForm.name = "";
  queryForm.companyName = "";
  initList();
};
const handleAuthStatusChange = (data: any) => {
  userIds.value = [data.userId];
  handleAuth(data);
};

const emit = defineEmits(["success"]);
// 单个用户授权/取消授权
const handleAuth = user => {
  if (authStatus.value === 0) {
    console.log(projectId.value, userIds.value);
    projectAuthorizeUserDelete({
      projectId: projectId.value,
      userIds: userIds.value
    }).then(() => {
      ElMessage.success("取消授权成功");
      initList();
      emit("success");
    });
  } else {
    projectAuthorizeUserAdd({
      projectId: projectId.value,
      userIds: userIds.value
    }).then(() => {
      ElMessage.success("授权成功");
      initList();
      emit("success");
    });
  }
};
// 单个用户授权/取消授权
const handleSelectionChange = val => {
  userIds.value = val.map(item => item.userId);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
