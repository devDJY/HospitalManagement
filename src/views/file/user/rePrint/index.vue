<template>
  <div class="table-box">
    <el-radio-group v-model="modeSwitching" size="large" style="margin-bottom: 10px">
      <el-badge :value="0" class="item" v-if="modeSwitching === '0'" color="green">
        <el-radio-button label="待审核" value="0" />
      </el-badge>
      <template v-else>
        <el-radio-button label="待审核" value="0" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '2'" color="green">
        <el-radio-button label="通过" value="2" />
      </el-badge>
      <template v-else>
        <el-radio-button label="通过" value="2" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '1'" color="green">
        <el-radio-button label="驳回" value="1" />
      </el-badge>
      <template v-else>
        <el-radio-button label="驳回" value="1" />
      </template>
    </el-radio-group>
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" @drag-sort="sortTable">
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
        <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
        <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
        <el-button type="primary" plain @click="toDetail">To 子集详情页面</el-button>
      </template> -->
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openAuditDialog(scope.row)">审核</el-button>
        <!-- <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button> -->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
    <RePrintAuditDialog ref="auditDialog" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import { deleteUser, editUser, addUser, changeUserStatus, resetUserPassWord, BatchAddUser } from "@/api/modules/user";
import { fileControllerCertList, fileControllerRePrintList } from "@/api/modules/fileInfo";
import RePrintAuditDialog from "./RePrintAuditDialog.vue";
const auditDialog = ref();
const openAuditDialog = (params: any) => {
  auditDialog.value.openDialog();
};
const router = useRouter();

// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
};
// 模式切换
const modeSwitching = ref("0");
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

watch(
  () => modeSwitching.value,
  () => {
    proTable.value?.getTableList();
  }
);
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  params.reviewStatus = modeSwitching.value;
  params.isManager = true;
  if (modeSwitching.value == "0") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "idCard",
        label: "源文件",
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "address", label: "受控文件", width: 115 },
      { prop: "fileControllerCode", label: "文件受控编码", width: 115, search: { el: "input" } },
      { prop: "printCount", label: "重新打印份数", width: 115 },
      { prop: "applyUserName", label: "申请人", width: 85 },
      { prop: "applyRemark", label: "申请说明", width: 115 },
      { prop: "applyTime", label: "申请日期", width: 85 },
      { prop: "operation", label: "操作", fixed: "right", width: 80 }
    );
  } else if (modeSwitching.value == "2") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "idCard",
        label: "源文件",
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "address", label: "受控文件", width: 115 },
      { prop: "address", label: "文件受控编码", width: 115, search: { el: "input" } },
      { prop: "printCount", label: "重新打印份数", width: 115 },
      { prop: "applyUserName", label: "申请人", width: 85 },
      { prop: "applyRemark", label: "申请说明", width: 115 },
      { prop: "applyTime", label: "申请日期", width: 85 }
    );
  } else if (modeSwitching.value == "1") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "idCard",
        label: "源文件",
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "address", label: "受控文件", width: 115 },
      { prop: "address", label: "文件受控编码", width: 115, search: { el: "input" } },
      { prop: "printCount", label: "重新打印份数", width: 115 },
      { prop: "applyUserName", label: "申请人", width: 85 },
      { prop: "applyRemark", label: "申请说明", width: 115 },
      { prop: "reviewRemark", label: "审核意见", width: 85 },
      { prop: "reviewerTime", label: "审核日期", width: 85 }
    );
  }
  return fileControllerRePrintList(params);
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { prop: "expand", label: "项目名称", width: 85, search: { el: "input" } },
  { prop: "idCard", label: "文件编码", width: 85, search: { el: "input" } },
  { prop: "idCard", label: "文件名" },
  { prop: "idCard", label: "源文件" },
  { prop: "address", label: "受控文件", width: 115 },
  { prop: "address", label: "文件受控编码", width: 115 },
  { prop: "address", label: "重新打印份数", width: 115 },
  { prop: "address", label: "申请人", width: 85 },
  { prop: "address", label: "申请说明", width: 115 },
  { prop: "address", label: "申请日期", width: 85 },
  { prop: "operation", label: "操作", fixed: "right", width: 80 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
  proTable.value?.getTableList();
};

// 导出用户列表
// const downloadFile = async () => {
//   ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() => useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam));
// };

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
// const batchAdd = () => {
//   const params = {
//     title: "用户",
//     tempApi: exportUserInfo,
//     importApi: BatchAddUser,
//     getTableList: proTable.value?.getTableList
//   };
//   dialogRef.value?.acceptParams(params);
// };

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | any>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value!.acceptParams(params);
};
</script>
