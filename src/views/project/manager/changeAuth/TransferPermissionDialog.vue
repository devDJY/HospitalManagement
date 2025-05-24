<template>
  <el-dialog v-model="visible" title="转移权限" width="800px" :close-on-click-modal="false">
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
    <div class="action-buttons">
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 人员表格 -->
    <el-table :data="pagedData" border style="width: 100%" class="user-table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="role" label="权限组" width="120" />
      <el-table-column prop="organization" label="单位名称" />
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        background
        layout="prev, pager, next,jumper"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 转移原因 -->
    <div class="section-title">转移原因</div>
    <el-input v-model="transferReason" type="textarea" placeholder="请输入..." :rows="3" class="reason-input" />

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认转移</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { ElMessage } from "element-plus";
interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
}

const visible = ref(false);
const transferReason = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const jumpPage = ref(1);
const selectedUsers = ref<User[]>([]);

// 查询表单数据
const queryForm = reactive({
  name: "",
  organization: ""
});

// 模拟用户数据
const allUsers = ref<User[]>([
  { id: "1", name: "胡永喆", role: "CRA", organization: "长春金赛药业有限责任公司" },
  { id: "2", name: "杨1", role: "CRA", organization: "长春金赛药业有限责任公司" },
  { id: "3", name: "汪果", role: "CRA", organization: "长春金赛药业有限责任公司" },
  { id: "4", name: "齐雪利", role: "CRA", organization: "齐鲁制药有限公司" },
  { id: "5", name: "王亚宁", role: "CRA", organization: "齐鲁制药有限公司" },
  { id: "6", name: "张三", role: "CRA", organization: "长春金赛药业有限责任公司" },
  { id: "7", name: "龚璐", role: "CRA", organization: "齐鲁制药有限公司" },
  { id: "8", name: "张衍杰", role: "CRA", organization: "长春金赛药业有限责任公司" },
  { id: "9", name: "杨文娟", role: "CRA", organization: "齐鲁制药有限公司" }
  // 可以继续添加更多模拟数据...
]);

// 计算属性
const filteredUsers = computed(() => {
  return allUsers.value.filter(user => {
    return (
      (queryForm.name === "" || user.name.includes(queryForm.name)) &&
      (queryForm.organization === "" || user.organization.includes(queryForm.organization))
    );
  });
});

const total = computed(() => filteredUsers.value.length);
const pageCount = computed(() => Math.ceil(total.value / pageSize.value));
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredUsers.value.slice(start, end);
});

// 打开弹窗
const openDialog = () => {
  visible.value = true;
  resetForm();
};

// 重置表单
const resetForm = () => {
  queryForm.name = "";
  queryForm.organization = "";
  transferReason.value = "";
  currentPage.value = 1;
  jumpPage.value = 1;
  selectedUsers.value = [];
};

// 查询
const handleQuery = () => {
  currentPage.value = 1;
  jumpPage.value = 1;
};

// 重置查询
const handleReset = () => {
  resetForm();
};

// 表格选择变化
const handleSelectionChange = (val: User[]) => {
  selectedUsers.value = val;
};

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  jumpPage.value = page;
};

// 跳转页面
const handleJumpPage = (page: number) => {
  currentPage.value = page;
};

// 提交转移
const handleSubmit = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请至少选择一位用户");
    return;
  }

  if (!transferReason.value.trim()) {
    ElMessage.warning("请输入转移原因");
    return;
  }

  console.log("选择的用户:", selectedUsers.value);
  console.log("转移原因:", transferReason.value);
  // 这里可以添加实际转移权限的API调用

  ElMessage.success("权限转移成功");
  visible.value = false;
};

// 暴露方法给父组件
defineExpose({
  openDialog
});
</script>

<style scoped lang="scss">
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  color: #333333;
  div {
    width: 100px;
  }
}

// .query-input {
//   margin-bottom: 15px;
// }
.action-buttons {
  margin-bottom: 20px;
}
.user-table {
  margin-bottom: 15px;
}
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .company-tags {
    .el-tag {
      margin-right: 8px;
    }
  }
  .pagination-info {
    font-size: 14px;
    color: #666666;
  }
  .page-jump {
    display: flex;
    align-items: center;
    span {
      margin: 0 8px;
      font-size: 14px;
    }
    :deep(.el-input-number) {
      width: 80px;
    }
  }
}
.reason-input {
  margin-bottom: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
