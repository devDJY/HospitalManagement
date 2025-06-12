<template>
  <div class="table-box">
    <div class="flex tops">
      <el-radio-group v-model="modeSwitching" size="large">
        <el-badge :value="0" class="item" v-if="modeSwitching === ''" color="green">
          <el-radio-button label="全部" value="" />
        </el-badge>
        <template v-else>
          <el-radio-button label="全部" value="" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '0'" color="green">
          <el-radio-button label="进行中" value="0" />
        </el-badge>
        <template v-else>
          <el-radio-button label="进行中" value="0" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '1'" color="green">
          <el-radio-button label="锁库" value="1" />
        </el-badge>
        <template v-else>
          <el-radio-button label="锁库" value="1" />
        </template>
      </el-radio-group>
      <el-button type="primary" @click="handleAdd()" style="width: 200px" :icon="Plus"> 新增项目 </el-button>
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
        <el-button type="success" v-if="modeSwitching == '0'" link :icon="Search" @click="resetPass(scope.row)">查看</el-button>
        <!-- <el-button type="primary" v-if="modeSwitching == '0'" link :icon="Edit" @click="editBtn(scope.row)">编辑</el-button>
        <el-button type="warning" v-if="modeSwitching == '0'" link :icon="RemoveFilled" @click="lock(scope.row)">锁库</el-button>
        <el-button type="danger" v-if="modeSwitching == '0'" link :icon="Delete" @click="deletePro(scope.row)">删除</el-button> -->
        <el-button type="success" v-if="modeSwitching == '1'" link :icon="Search" @click="documentTest(scope.row)">查看</el-button>
      </template>
      <!-- <template #append>项目测试
        <span style="color: var(--el-color-primary)">我是插入在表格最后的内容。若表格有合计行，该内容会位于合计行之上。</span>
      </template> -->
    </ProTable>
    <el-dialog v-model="lockDialog" title="锁库" width="500px" :before-close="handleClose">
      <div class="flex">
        <div style="width: 90px">锁库说明：</div>
        <el-input v-model="remark" type="textarea" :rows="4" placeholder="请输入..." resize="none" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="lockDialog = false">取消</el-button>
          <el-button type="primary" @click="lockOK()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <ProjectFormDialog ref="projectFormDialog" :user-options="userList" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="tsx" name="complexProTable">
import { reactive, ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import ProjectFormDialog from "./ProjectFormDialog.vue";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { deleteUser, resetUserPassWord } from "@/api/modules/user";
import { projectList, projectLock, projectDelete, projectMoveAuthUserQuery, projectQueryManager, projectAdd, projectUpdate } from "@/api/modules/project";
import { Search, Delete, Edit, Plus, RemoveFilled } from "@element-plus/icons-vue";
import router from "@/routers";
const lockDialog = ref(false);
const remark = ref("");
const handleClose = () => {
  lockDialog.value = false;
};
const handleCancel = () => {
  lockDialog.value = false;
};
// ProTable 实例
const proTable = ref<ProTableInstance>();
// 模式切换
const modeSwitching = ref("0");
// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
  return <div>{scope.column.label}</div>;
};

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
      { prop: "waitReviewCount", label: "待审查" },
      { prop: "waitControllerCount", label: "待受控" },
      {
        prop: "waitRecycleCount",
        label: "待回收"
      },
      {
        prop: "waitLoseCount",
        label: "遗失待审核"
      }
    ]
  },
  { prop: "operation", label: "操作", fixed: "right", width: 300 }
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
  if (modeSwitching.value == "") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectCode", label: "项目立项号", search: { el: "input", tooltip: "" } },
      { prop: "projectName", label: "项目名称", width: 100, search: { el: "input", tooltip: "" } },
      { prop: "startTime", label: "启动日期" },
      { prop: "applicant", label: "申办方" },
      { prop: "enrollCount", label: "入组列数" },
      { prop: "creatorName", label: "提交人" },
      { prop: "createTime", label: "提交日期" },
      { prop: "projectStat", label: "状态" }
    );
  } else if (modeSwitching.value == "0") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectCode", label: "项目立项号", search: { el: "input", tooltip: "" } },
      { prop: "projectName", label: "项目名称", width: 100, search: { el: "input", tooltip: "" } },
      { prop: "enrollCount", label: "入组列数", width: 100 },
      {
        prop: "base",
        label: "文件",
        headerRender,
        _children: [
          { prop: "waitReviewCount", label: "待审查" },
          { prop: "waitControllerCount", label: "待受控" },
          { prop: "waitUsedCount", label: "待使用" },
          {
            prop: "waitRecycleCount",
            label: "待回收"
          },
          {
            prop: "waitLoseCount",
            label: "遗失待审核"
          }
        ]
      },
      { prop: "managers", label: "管理员", width: 100 },
      { prop: "operation", label: "操作", fixed: "right", width: 300 }
    );
  } else if (modeSwitching.value == "1") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectCode", label: "项目立项号", search: { el: "input", tooltip: "" } },
      { prop: "projectName", label: "项目名称", width: 100, search: { el: "input", tooltip: "" } },
      { prop: "enrollCount", label: "入组列数", width: 100 },
      {
        prop: "base",
        label: "文件",
        headerRender,
        _children: [
          { prop: "recycleCount", label: "已回收" },
          { prop: "loseCount", label: "已遗失" }
        ]
      },
      { prop: "managers", label: "管理员", width: 100 },
      { prop: "lockTime", label: "锁库日期" },
      { prop: "lockRemark", label: "锁库说明" },
      { prop: "operation", label: "操作", fixed: "right", width: 80 }
    );
  }
  params.status = modeSwitching.value;
  params.isManager = false;
  return projectList(params);
};

// 删除项目
const deletePro = async (params: any) => {
  await useHandleData(projectDelete, { projectId: params.projectId }, `删除【${params.projectName}】项目（删除后无法恢复)?`);
  proTable.value?.getTableList();
};
// 编辑项目
const editBtn = (parms: any) => {
  projectId.value = parms.projectId;
  projectFormDialog.value.openEditDialog(parms);
  //projectFormDialog.value.openAddDialog();
  // proTable.value?.getTableList();
};
const projectId = ref("");
// 批量删除用户信息
const lock = async obj => {
  projectId.value = obj.projectId;
  lockDialog.value = true;
};
const lockOK = async () => {
  await projectLock({ projectId: projectId.value, remark: remark.value });
  proTable.value?.getTableList();
  lockDialog.value = false;
};
// 查看项目详情
const resetPass = async params => {
  try {
    await router.push(`/project/basicFacts?projectId=${params.projectId}&isManager=2`);
  } catch (error) {
    ElMessage.error("跳转失败，请稍后再试");
    console.error("路由跳转错误:", error);
  }
  // await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
  // proTable.value?.getTableList();
};
const documentTest = async (params: any) => {
  router.push(`/archive/archivedFile`);
};

const projectFormDialog = ref();
const userList = ref([
  {
    userId: "1",
    nickName: "admin"
  }
]);
// 页面渲染请求
const init = async () => {
  // 获取用户列表
  const { data } = await projectQueryManager({});
  userList.value = (data as { userId: number; nickName: string }[]).map(item => ({
    userId: String(item.userId),
    nickName: item.nickName
  }));
  // 获取项目列表
  proTable.value?.getTableList();
};
onMounted(() => {
  init();
});
// // 新增项目
const handleAdd = () => {
  projectFormDialog.value.openAddDialog();
};

// // 编辑项目
// const handleEdit = row => {
//   projectFormDialog.value.openEditDialog(row);
// };

// 提交表单
const handleSubmit = async formData => {
  // 这里调用API进行保存
  if (projectFormDialog.value.mode === "add") {
    await projectAdd(formData);
  } else {
    await projectUpdate(formData);
  }
  proTable.value?.getTableList();
  ElMessage.success(projectFormDialog.value.mode.value === "add" ? "新增成功" : "编辑成功");
  // 然后刷新列表
};
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
  padding-bottom: 10px;
}
</style>
