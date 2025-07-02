<template>
  <div class="table-box">
    <el-radio-group v-model="modeSwitching" size="large" style="margin-bottom: 10px">
      <el-badge :value="0" class="item" v-if="modeSwitching === '0'" color="green">
        <el-radio-button label="全部" value="0" />
      </el-badge>
      <template v-else>
        <el-radio-button label="全部" value="0" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '1'" color="green">
        <el-radio-button label="下载记录" value="1" />
      </el-badge>
      <template v-else>
        <el-radio-button label="下载记录" value="1" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '2'" color="green">
        <el-radio-button label="作废文件" value="2" />
      </el-badge>
      <template v-else>
        <el-radio-button label="作废文件" value="2" />
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
      <template #attachmentUrl="scope">
        <el-button type="primary" link @click="goToDetails(scope, 1)"> 查看 </el-button>
      </template>
      <template #attachmentUrl2="scope">
        <el-button type="primary" link @click="goToDetails(scope, 2)"> 查看 </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openAuditDialog(scope.row)">文件登记表</el-button>
        <!-- <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button> -->

        <el-button type="primary" link :icon="ChatDotRound" @click="exceptionNotes(scope.row)">异常备注</el-button>
        <el-button type="primary" link :icon="Download" @click="download(scope.row)">下载</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ExceptionNotesDialog ref="exceptionNotesDialog" />
    <registrationDialog ref="registrationDi" />
    <!-- <RePrintAuditDialog ref="auditDialog" /> -->
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
import { CirclePlus, ChatDotRound, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import { deleteUser, editUser, addUser, changeUserStatus, resetUserPassWord, BatchAddUser } from "@/api/modules/user";
import { archiveCancelList, archiveDownloadList, archiveExcelReport, archiveFileDownload, archiveFileList } from "@/api/modules/archives";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import ExceptionNotesDialog from "./ExceptionNotesDialog.vue";
import registrationDialog from "./registrationDialog.vue";
const exceptionNotesDialog = ref();
const registrationDi = ref();
const exceptionNotes = (params: any) => {
  exceptionNotesDialog.value.openDialog(params);
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
const goToDetails = (scope, type: number) => {
  router.push({
    name: "fileDetails", // 路由名称
    query: {
      fileId: scope.row.fileId,
      isManager: 0,
      type: type
    }
  });
};
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
        prop: "attachmentUrl",
        label: "源文件",
        width: 90
      },
      {
        prop: "attachmentUrl2",
        label: "受控文件",
        width: 90
      },
      { prop: "fileControllerCode", label: "文件受控编码", width: 115, search: { el: "input" } },
      { prop: "pageTotal", label: "页数", width: 115 },
      { prop: "printCount", label: "打印页数", width: 85 },
      { prop: "reviewerName", label: "审查人", width: 115 },
      { prop: "controllerName", label: "受控发放人", width: 115 },
      { prop: "operation", label: "操作", fixed: "right", width: 130 }
    );
  } else if (modeSwitching.value == "2") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90
      },
      {
        prop: "attachmentUrl2",
        label: "受控文件",
        width: 90
      },
      { prop: "fileControllerCode", label: "文件受控编码", width: 115, search: { el: "input" } },
      { prop: "pageTotal", label: "页数", width: 115 },
      { prop: "pageTotal", label: "作废份数", width: 85 },
      { prop: "creatorName", label: "作废人", width: 115 },
      { prop: "remark", label: "作废说明", width: 85 },
      { prop: "versionTime", label: "作废日期", width: 115 }
    );
  } else if (modeSwitching.value == "1") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90
      },

      { prop: "fileControllerCode", label: "文件受控编码", width: 115, search: { el: "input" } },
      { prop: "pageTotal", label: "页数", width: 115 },
      { prop: "fileType", label: "文件类型", width: 85 },
      { prop: "versionTime", label: "下载日期", width: 115 }
    );
  }
  switch (modeSwitching.value) {
    case "0":
      return archiveFileList(params);
    case "1":
      return archiveDownloadList(params);
    case "2":
      return archiveCancelList(params);
    default:
      return archiveFileList(params);
  }
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
const download = async (row: any) => {
  await archiveFileDownload(row);
  ElMessageBox.confirm("确认导出?", "温馨提示", { type: "warning" }).then(() =>
    useDownload("archive/excel/report", archiveExcelReport, `${row.projectName}项目详情`, { projectId: row.projectId })
  );
};

// 导出用户列表
const openAuditDialog = async (params: any) => {
  registrationDi.value.openDialog(params);
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);

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
