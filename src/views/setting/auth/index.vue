<template>
  <div class="table-box">
    <div class="flex tops">
      <el-button type="primary" icon="Plus" @click="openCreateDialog">新增权限组</el-button>
    </div>
    <ProTable
      ref="proTable"
      title="用户列表"
      highlight-current-row
      :columns="columns"
      :request-api="getTableList"
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      :show-summary="false"
    >
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="proTable?.element?.toggleAllSelection">全选 / 全不选</el-button>
        <el-button type="primary" :icon="Pointer" plain @click="setCurrent">选中第五行</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除用户
        </el-button>
      </template> -->
      <!-- Expand -->
      <template #authorizedMembers="scope">
        <el-button link @click="showDialog(scope.row)">
          <el-icon>
            <Avatar />
          </el-icon>
          组成员
        </el-button>
      </template>
      <template #isRegisterDisplay="scope">
        <el-switch v-model="scope.row.isRegisterDisplay" @click.stop="tabState(1, scope.row)" :active-value="1" :inactive-value="0" />
      </template>
      <template #isAudit="scope">
        <el-switch v-model="scope.row.isAudit" @click.stop="tabState(2, scope.row)" :active-value="1" :inactive-value="0" />
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="success" v-if="modeSwitching == '1'" link :icon="Edit" @click="openEditDialog(scope.row)">编辑</el-button>
        <!-- <el-button type="primary" v-if="modeSwitching == '1'" link :icon="Edit" @click="editBtn(scope.row)">编辑</el-button>
        <el-button type="warning" v-if="modeSwitching == '1'" link :icon="RemoveFilled" @click="lock(scope.row)">锁库</el-button> -->
        <el-button type="danger" v-if="modeSwitching == '1'" link :icon="Delete" @click="deletePro(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <PermissionGroupDialog ref="permissionDialog" @refreshData="refreshData" />
    <MemberAuthorizationDialog ref="memberDialog" />
  </div>
</template>

<script setup lang="tsx" name="complexProTable">
import { reactive, ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { deleteUser, resetUserPassWord } from "@/api/modules/user";
import { projectList, projectLock, projectDelete, projectMoveAuthUserQuery } from "@/api/modules/project";
import { Search, Delete, Edit, Plus, RemoveFilled, Avatar } from "@element-plus/icons-vue";
import { authGroupDeleteGroup, authGroupList, authGroupUpdateAuditFlag, authGroupUpdateDisplayFlag } from "@/api/modules/authGroup";
import PermissionGroupDialog from "./PermissionGroupDialog.vue";
import MemberAuthorizationDialog from "./MemberAuthorizationDialog.vue";

const memberDialog = ref();
const permissionDialog = ref();
const showDialog = data => {
  memberDialog.value.open(data);
};
const editData = ref({
  id: 1,
  name: "管理员组",
  description: "系统管理员权限组",
  menus: [],
  showOnRegister: false,
  isReviewGroup: true
});

const openCreateDialog = parms => {
  permissionDialog.value.openCreateDialog();
};

const openEditDialog = data => {
  permissionDialog.value.openEditDialog(data);
};
// ProTable 实例
const proTable = ref<ProTableInstance>();
// 模式切换
const modeSwitching = ref("1");
// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
  return <div>{scope.column.label}</div>;
};
const refreshData = () => {
  proTable.value?.getTableList();
};
// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { prop: "groupName", label: "权限组", search: { el: "input", tooltip: "" } },
  { prop: "groupDesc", label: "描述" },
  {
    prop: "authorizedMembers",
    label: "授权成员"
  },
  {
    prop: "isRegisterDisplay",
    label: "用户注册时显示"
  },
  { prop: "isAudit", label: "是否是审核组" },
  { prop: "operation", label: "操作", fixed: "right", width: 150 }
]);

interface SpanMethodProps {
  row: User.ResUserList;
  column: TableColumnCtx<User.ResUserList>;
  rowIndex: number;
  columnIndex: number;
}
const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  // if (columnIndex === 3) {
  //   if (rowIndex % 2 === 0) return { rowspan: 2, colspan: 1 };
  //   else return { rowspan: 0, colspan: 0 };
  // }
};
// 设置列样式
const tableRowClassName = ({ rowIndex }: { row: User.ResUserList; rowIndex: number }) => {
  if (rowIndex === 2) return "warning-row";
  if (rowIndex === 6) return "success-row";
  return "";
};

// 单击行
const rowClick = (row: User.ResUserList, column: TableColumnCtx<User.ResUserList>) => {
  if (column.property == "radio" || column.property == "operation") return;
};
watch(
  () => modeSwitching.value,
  () => {
    proTable.value?.getTableList();
  }
);
const getTableList = (params?: any) => {
  params.status = modeSwitching.value;
  return authGroupList(params);
};

// 删除项目
const deletePro = async (params: any) => {
  await useHandleData(authGroupDeleteGroup, { groupId: params.id }, `删除【${params.groupName}】权限组（删除后无法恢复)?`);
  proTable.value?.getTableList();
};
//
const tabState = async (state, params: any) => {
  if (state == 1) {
    authGroupUpdateDisplayFlag({
      groupId: params.id,
      displayFlag: params.isRegisterDisplay ? 1 : 0
    }).then(() => {
      ElMessage.success("操作成功");
    });
  } else {
    authGroupUpdateAuditFlag({
      groupId: params.id,
      auditFlag: params.isAudit ? 1 : 0
    }).then(() => {
      ElMessage.success("操作成功");
    });
  }
};
// 页面渲染请求
const init = async () => {
  // 获取用户列表
  // const { data } = await projectMoveAuthUserQuery();
  // userList.value = data;
  // 获取项目列表
  proTable.value?.getTableList();
};
onMounted(() => {
  init();
});
</script>

<style lang="scss">
.el-table .warning-row,
.el-table .warning-row .el-table-fixed-column--right,
.el-table .warning-row .el-table-fixed-column--left {
  background-color: var(--el-color-warning-light-9);
}
.el-table .success-row,
.el-table .success-row .el-table-fixed-column--right,
.el-table .success-row .el-table-fixed-column--left {
  background-color: var(--el-color-success-light-9);
}
.lock-library-dialog {
  display: flex;
}
.flex {
  display: flex;
}
.tops {
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
