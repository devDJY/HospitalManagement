<template>
  <el-dialog title="授权成员管理" v-model="visible" width="80%">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="用户账号">
        <el-input v-model="searchForm.userName" placeholder="请输入..." clearable />
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="searchForm.nickName" placeholder="请输入..." clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initlist">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 成员表格 -->
    <el-table :data="members" border style="width: 100%">
      <el-table-column prop="userName" label="用户账号" width="180" />
      <el-table-column prop="nickName" label="真实姓名" width="180" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { authGroupDeleteUser, authGroupQueryUser } from "@/api/modules/authGroup";

// 控制弹窗显示
const visible = ref(false);

// 数据状态
const searchForm = reactive({
  userName: "",
  nickName: ""
});

const members = ref([]);

const resetSearch = () => {
  searchForm.userName = "";
  searchForm.nickName = "";
  initlist();
};

const getStatusType = status => {
  switch (status) {
    case 0:
      return "warning";
    case 1:
      return "success";
    case 2:
      return "danger";
    default:
      return "info";
  }
};
//账号状态 0待审核 1正常 2驳回 3过期
const getStatus = status => {
  switch (status) {
    case 0:
      return "待审核";
    case 1:
      return "正常";
    case 2:
      return "驳回";
    case 3:
      return "过期";
    default:
      return "未知状态";
  }
};
const handleDelete = async row => {
  try {
    await ElMessageBox.confirm(`确定要删除成员 ${row.realName} 吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    authGroupDeleteUser({
      groupId: groupId.value,
      userId: row.id
    });
    ElMessage.success("删除成功!");
  } catch {
    ElMessage.info("已取消删除");
  }
};
const groupId = ref();
const initlist = () => {
  authGroupQueryUser({
    groupId: groupId.value,
    ...searchForm
  }).then((res: any) => {
    members.value = res.records || [];
  });
};
// 暴露打开方法
const open = data => {
  console.log("打开授权成员管理弹窗", data);
  groupId.value = data.id;
  initlist();
  visible.value = true;
};

defineExpose({
  open
});
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
