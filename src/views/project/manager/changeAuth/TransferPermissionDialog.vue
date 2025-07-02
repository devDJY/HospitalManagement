<template>
  <el-dialog v-model="visible" title="转移权限" width="800px" :close-on-click-modal="false">
    <el-form :model="queryForm" class="query-form">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input v-model="queryForm.nickName" placeholder="请输入..." clearable />
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
    <!-- 人员表格 -->
    <el-table :data="allUsers" border style="width: 100%" height="405px" ref="tableRef" class="user-table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="nickName" label="姓名" width="120" />
      <el-table-column prop="groupName" label="权限组" width="120" />
      <el-table-column prop="companyName" label="单位名称" />
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" background layout="prev, pager, next,jumper" @current-change="handlePageChange" />
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
import { projectMoveAuthMove, projectMoveAuthUserQuery } from "@/api/modules/project";
interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
}

const visible = ref(false);
const transferReason = ref("");
const currentPage = ref(1);
const pageSize = ref(8);
const jumpPage = ref(1);
const tableRef = ref();
const selectedRow = ref(); // 存储当前选中行
// 查询表单数据
const queryForm = reactive({
  nickName: "",
  companyName: ""
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
const total = ref(0);
const initList = () => {
  let pa = {
    groupId: groupId.value,
    userId: userId.value,
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    ...queryForm
  };
  projectMoveAuthUserQuery(pa).then((res: any) => {
    allUsers.value = res.records || [];
    total.value = res.total || 0;
  });
};
// 打开弹窗
const groupId = ref("");
const userId = ref("");
const openDialog = data => {
  groupId.value = data.groupId;
  userId.value = data.userId;
  initList();
  visible.value = true;
  resetForm();
};

// 重置表单
const resetForm = () => {
  queryForm.nickName = "";
  queryForm.companyName = "";
  transferReason.value = "";
  currentPage.value = 1;
  jumpPage.value = 1;
  selectedRow.value = [];
};

// 查询
const handleQuery = () => {
  currentPage.value = 1;
  jumpPage.value = 1;
  initList();
};

// 重置查询
const handleReset = () => {
  resetForm();
  initList();
};

// 表格选择变化
const handleSelectionChange = val => {
  if (val.length > 1) {
    // 如果用户尝试多选，自动取消前一次选择
    const newRow = val[val.length - 1]; // 只保留最后一次选择
    tableRef.value.clearSelection(); // 清空所有选择
    tableRef.value.toggleRowSelection(newRow, true); // 重新选中当前行
    selectedRow.value = newRow;
  } else {
    selectedRow.value = val[0] || null;
  }
  console.log("当前选中行:", selectedRow.value);
};

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  jumpPage.value = page;
  initList();
};
const emit = defineEmits(["refreshData"]);
// 提交转移
const handleSubmit = async () => {
  if (selectedRow.value.length === 0) {
    ElMessage.warning("请至少选择一位用户");
    return;
  }

  if (!transferReason.value.trim()) {
    ElMessage.warning("请输入转移原因");
    return;
  }
  let obj = {
    newUserId: selectedRow.value.userId,
    oldUserId: userId.value,
    remark: transferReason.value
  };
  await projectMoveAuthMove(obj);
  emit("refreshData");
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
