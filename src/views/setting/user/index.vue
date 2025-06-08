<template>
  <div class="table-box">
    <div class="flex tops">
      <el-radio-group v-model="modeSwitching" size="large" style="margin-bottom: 10px">
        <el-badge :value="getTableList.length" class="item" v-if="modeSwitching === ''" color="green">
          <el-radio-button label="全部" value="" />
        </el-badge>
        <template v-else>
          <el-radio-button label="全部" value="" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '1'" color="green">
          <el-radio-button label="待审核" value="1" />
        </el-badge>
        <template v-else>
          <el-radio-button label="待审核" value="1" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '2'" color="green">
          <el-radio-button label="正常" value="2" />
        </el-badge>
        <template v-else>
          <el-radio-button label="正常" value="2" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '3'" color="green">
          <el-radio-button label="驳回" value="3" />
        </el-badge>
        <template v-else>
          <el-radio-button label="驳回" value="3" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '4'" color="green">
          <el-radio-button label="已失效" value="4" />
        </el-badge>
        <template v-else>
          <el-radio-button label="已失效" value="4" />
        </template>
      </el-radio-group>
      <el-button type="primary" @click="showAddDialog()" style="width: 200px" :icon="Plus">新增用户</el-button>
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
      @row-click="rowClick"
    >
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="proTable?.element?.toggleAllSelection">全选 / 全不选</el-button>
        <el-button type="primary" :icon="Pointer" plain @click="setCurrent">选中第五行</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除用户
        </el-button>
      </template> -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="success" link :icon="Edit" @click="showAddDialog(scope.row)">编辑</el-button>
        <!-- <el-button type="warning" v-if="modeSwitching == '1'" link :icon="Plus" @click="joinAnOrganization(scope.row)">加入组织</el-button> -->
        <el-button type="info" v-if="modeSwitching !== '1' && modeSwitching !== '4'" link :icon="Refresh" @click="resetPass(scope.row)">重置</el-button>
        <el-button type="info" v-if="modeSwitching == '1'" link :icon="Refresh" @click="openDialog(scope.row)">审核</el-button>
        <el-button type="danger" link :icon="Delete" @click="deletePro(scope.row)">删除</el-button>
      </template>
      <template #roleId>
        <span style="color: var(--el-color-primary)">我是插入在表格最后的内容。若表格有合计行，该内容会位于合计行之上。</span>
      </template>
    </ProTable>
    <el-dialog v-model="lockDialog" title="锁库" width="500px" :before-close="handleClose">
      <div class="flex" style="margin-bottom: 10px">
        <div style="width: 90px">审核状态</div>
        <el-select v-model="formData.permissionGroupId" placeholder="请选择">
          <el-option label="通过" :value="1" />
          <el-option label="驳回" :value="2" />
        </el-select>
      </div>
      <div class="flex">
        <div style="width: 90px">备注</div>
        <el-input v-model="formData.remark" type="textarea" :rows="4" placeholder="请输入..." resize="none" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="lockDialog = false">取消</el-button>
          <el-button type="primary" @click="lockOK()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <UserEditDialog ref="UserEdit" />
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
import { deleteUser, deleteUserInfo, getUserInfoList, resetUserPassword, updateUserAudit } from "@/api/modules/user";
import { Search, Delete, Edit, Plus, Refresh } from "@element-plus/icons-vue";
import UserEditDialog from "./UserEditDialog.vue";
const lockDialog = ref(false);
const remark = ref("");
const UserEdit = ref();
const handleClose = () => {
  lockDialog.value = false;
};
const formData = reactive({
  permissionGroupId: "",
  remark: "",
  userId: ""
});
// ProTable 实例
const proTable = ref<ProTableInstance>();
// 模式切换
const modeSwitching = ref("1");
// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
  return <div>{scope.column.label}</div>;
};
const roleTypes = ref([
  { value: 0, label: "无" },
  { value: 1, label: "专业秘书" },
  { value: 2, label: "专业负责人" },
  { value: 3, label: "机构主任" },
  { value: 4, label: "机构办主任" },
  { value: 5, label: "机构办副主任" }
]);
// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { prop: "projectCode", label: "项目立项号", search: { el: "input", tooltip: "" } },
  { prop: "projectName", label: "项目名称", width: 100, search: { el: "input", tooltip: "" } },
  { prop: "enrollCount", label: "入组列数", width: 100 },
  {
    prop: "base",
    label: "文件",
    headerRender,
    _children: [
      { prop: "waitReviewCount", label: "存档" },
      { prop: "waitControllerCount", label: "打印" },
      {
        prop: "waitRecycleCount",
        label: "使用"
      },
      {
        prop: "waitLoseCount",
        label: "回收"
      },
      {
        prop: "waitLoseCount",
        label: "销毁"
      },
      {
        prop: "waitLoseCount",
        label: "遗失"
      }
    ]
  },
  { prop: "enrollCount", label: "管理员", width: 100 },
  { prop: "operation", label: "操作", fixed: "right", width: 220 }
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
  ElMessage.success("当前行被点击了！");
};
watch(
  () => modeSwitching.value,
  () => {
    proTable.value?.getTableList();
  }
);
const getTableList = (params?: any) => {
  if (modeSwitching.value == "1") {
    columns.splice(
      0,
      columns.length,
      { prop: "id", label: "账号", search: { el: "input", tooltip: "" } },
      { prop: "nickName", label: "真实姓名", width: 100, search: { el: "input", tooltip: "" } },
      {
        prop: "gender",
        label: "性别",
        render(scope) {
          const anyRow = scope.row as any;
          let arr = ["保密", "男", "女"];
          return <div>{arr[anyRow.gender]}</div>;
        }
      },
      { prop: "mobile", label: "手机号" },
      { prop: "email", label: "电子邮箱" },
      { prop: "companyName", label: "单位名称" },
      {
        prop: "roleId",
        label: "角色",
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{roleTypes.value[anyRow.roleId].label || "未知"}</div>;
        }
      },
      { prop: "permissionGroupName", label: "权限组" },
      { prop: "registerTime", label: "注册日期" },
      { prop: "operation", label: "操作", fixed: "right", width: 200 }
    );
  } else {
    columns.splice(
      0,
      columns.length,
      { prop: "id", label: "账号", search: { el: "input", tooltip: "" } },
      { prop: "nickName", label: "真实姓名", width: 100, search: { el: "input", tooltip: "" } },
      {
        prop: "gender",
        label: "性别",
        render(scope) {
          const anyRow = scope.row as any;
          let arr = ["保密", "男", "女"];
          return <div>{arr[anyRow.gender]}</div>;
        }
      },
      { prop: "mobile", label: "手机号" },
      { prop: "email", label: "电子邮箱" },
      { prop: "companyName", label: "单位名称" },
      {
        prop: "roleId",
        label: "角色",
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{roleTypes.value[anyRow.roleId].label}</div>;
        }
      },
      { prop: "permissionGroupName", label: "权限组" },
      { prop: "registerTime", label: "注册日期" },
      { prop: "operation", label: "操作", fixed: "right", width: 220 }
    );
  }
  params.status = Number(modeSwitching.value) - 1;
  return getUserInfoList(params);
};

// 删除项目
const deletePro = async (params: any) => {
  await useHandleData(deleteUserInfo, { userId: params.id }, `删除【${params.nickName}】用户（删除后无法恢复)?`);
  proTable.value?.getTableList();
};
const projectId = ref("");
// 重置用户密码
const resetPass = async params => {
  await useHandleData(resetUserPassword, { userId: params.id, password: "000000" }, `重置【${params.nickName}】用户密码,重置密码：000000`);
  proTable.value?.getTableList();
};
const dialogVisible = ref(true);
const currentEditData = ref(null);

// 新增用户
const showAddDialog = (row?) => {
  UserEdit.value.open(row);
};

// 编辑用户
const showEditDialog = user => {
  currentEditData.value = user;
  dialogVisible.value = true;
};

// 审核处理
const openDialog = data => {
  formData.userId = data.id;
  lockDialog.value = true;
};
const lockOK = async () => {
  if (!formData.permissionGroupId) {
    ElMessage.error("请选择审核状态");
    return;
  }
  updateUserAudit({
    userId: formData.userId,
    auditFlag: formData.permissionGroupId,
    remark: formData.remark
  }).then(() => {
    ElMessage.success("操作成功");
    lockDialog.value = false;
    proTable.value?.getTableList();
  });
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
}
</style>
