<template>
  <el-dialog title="授权成员管理" v-model="visible" width="80%">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="用户账号">
        <el-input v-model="searchForm.account" placeholder="请输入..." clearable />
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="searchForm.realName" placeholder="请输入..." clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 成员表格 -->
    <el-table :data="filteredMembers" border style="width: 100%">
      <el-table-column prop="account" label="用户账号" width="180" />
      <el-table-column prop="realName" label="真实姓名" width="180" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ $index, row }">
          <el-button size="small" type="danger" @click="handleDelete($index, row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

interface Member {
  account: string;
  realName: string;
  status: "正常" | "待审核" | "失效";
}

// 控制弹窗显示
const visible = ref(false);

// 数据状态
const searchForm = reactive({
  account: "",
  realName: ""
});

const members = reactive<Member[]>([
  { account: "13550767266", realName: "肖溢", status: "待审核" },
  { account: "17738283410", realName: "蒋胜兰", status: "正常" },
  { account: "Huangyu", realName: "黄羽", status: "正常" },
  { account: "15881439896", realName: "谢骏雅", status: "正常" },
  { account: "15583992465", realName: "柳秋宇", status: "正常" },
  { account: "Cinderella", realName: "刘鑫怡", status: "失效" },
  { account: "pengziang", realName: "彭子昂", status: "失效" }
]);

// 计算属性
const filteredMembers = computed(() => {
  return members.filter(member => {
    const accountMatch = member.account.toLowerCase().includes(searchForm.account.toLowerCase());
    const nameMatch = member.realName.toLowerCase().includes(searchForm.realName.toLowerCase());
    return accountMatch && nameMatch;
  });
});

// 方法
const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
};

const resetSearch = () => {
  searchForm.account = "";
  searchForm.realName = "";
};

const getStatusType = (status: Member["status"]) => {
  switch (status) {
    case "正常":
      return "success";
    case "待审核":
      return "warning";
    case "失效":
      return "danger";
    default:
      return "info";
  }
};

const handleDelete = async (index: number, row: Member) => {
  try {
    await ElMessageBox.confirm(`确定要删除成员 ${row.realName} 吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    members.splice(index, 1);
    ElMessage.success("删除成功!");
  } catch {
    ElMessage.info("已取消删除");
  }
};

// 暴露打开方法
const open = () => {
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
