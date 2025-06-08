<template>
  <div class="table-box">
    <el-radio-group v-model="modeSwitching" size="large" style="margin-bottom: 10px">
      <el-badge :value="0" class="item" v-if="modeSwitching === '0'" color="green">
        <el-radio-button label="待审查" value="0" />
      </el-badge>
      <template v-else>
        <el-radio-button label="待审查" value="0" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '1'" color="green">
        <el-radio-button label="通过" value="1" />
      </el-badge>
      <template v-else>
        <el-radio-button label="通过" value="1" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '2'" color="green">
        <el-radio-button label="驳回" value="2" />
      </el-badge>
      <template v-else>
        <el-radio-button label="驳回" value="2" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '3'" color="green">
        <el-radio-button label="拒绝" value="4" />
      </el-badge>
      <template v-else>
        <el-radio-button label="拒绝" value="4" />
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
        <div v-if="modeSwitching == '0'">
          <el-button type="primary" link :icon="Coordinate" @click="handleReview(scope.row)">审查</el-button>
          <el-button type="success" link :icon="Download" @click="exportTab(scope.row)">导出</el-button>
        </div>
        <div v-if="modeSwitching == '1'">
          <el-button type="primary" link v-if="scope.row.reuseStatus == 1" :icon="RemoveFilled" @click="handleBanReuse(scope.row)">禁止复用</el-button>
          <el-button type="primary" link v-if="scope.row.reuseStatus == 0" :icon="RemoveFilled" @click="liftingTheProhibitionOnReuse(scope.row)">解除禁止复用</el-button>
        </div>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
    <FileReviewDialog ref="fileReviewDialog" />
    <BanReuseDialog ref="banReuseDialog" @refresh="handleRefresh" />
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
import { CirclePlus, Delete, EditPen, Download, Upload, View, RemoveFilled, Coordinate } from "@element-plus/icons-vue";
import { getUserList, deleteUser, editUser, addUser, changeUserStatus, resetUserPassWord, exportUserInfo, BatchAddUser, getUserStatus } from "@/api/modules/user";
import FileReviewDialog from "./FileReviewDialog.vue";
import BanReuseDialog from "./BanReuseDialog.vue";
import { fileInfoList } from "@/api/modules/fileInfo";
import { pa } from "element-plus/es/locale";
const router = useRouter();

// 模式切换
const modeSwitching = ref("0");
const fileReviewDialog = ref();
const banReuseDialog = ref();
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });
// 审查文件操作
const handleReview = (params: any) => {
  // 可以传入审查数据（可选）
  fileReviewDialog.value?.open(params);
};
// 禁止复用操作
const handleBanReuse = (params: any) => {
  // 传入文件ID
  banReuseDialog.value?.open(params.fileId, 1); // file123是示例文件ID
};
const liftingTheProhibitionOnReuse = (params: any) => {
  // 传入文件ID
  banReuseDialog.value?.open(params.fileId, 2); // file123是示例文件ID
};
watch(
  () => modeSwitching.value,
  () => {
    proTable.value?.getTableList();
  }
);

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  params.fileStatus = modeSwitching.value;
  if (modeSwitching.value == "0") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90,
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "fileVersion", label: "版本号" },
      { prop: "versionTime", label: "版本日期", width: 85 },
      { prop: "fileCount", label: "份数", width: 85 },
      { prop: "creatorName", label: "申请人", width: 115 },
      { prop: "reviewTime", label: "申请日期", width: 85 },
      { prop: "fileStatus", label: "受控方式", render(scope) {
        const _fileStatus = (scope.row as any).fileStatus;
        return <el-tag type={_fileStatus === 0 ? "success" : "danger"}>{_fileStatus === 0 ? "线上" : "线下"}</el-tag>;
      } },
      { prop: "operation", label: "操作", fixed: "right", width: 180 }
    );
  } else if (modeSwitching.value == "1") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90,
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "fileCount", label: "份数", width: 85 },
      { prop: "creatorName", label: "申请人", width: 115 },
      {
        prop: "checkType",
        label: "受控方式",
        render(scope) {
          const status = (scope.row as any).reuseStatus;
          const tagType = status === 1 ? "success" : "danger";
          return <el-tag type={tagType}>{status === 0 ? "线上" : "线下"}</el-tag>;
        }
      },
      { prop: "reviewRemark", label: "审查意见", width: 85 },
      { prop: "reviewTime", label: "审查日期", width: 85 },
      {
        prop: "reuseStatus",
        label: "复用状态",
        width: 85,
        render(scope) {
          const status = (scope.row as any).reuseStatus;
          const tagType = status === 1 ? "success" : "danger";
          return <el-tag type={tagType}>{status === 1 ? "不复用" : "可复用"}</el-tag>;
        }
      },
      { prop: "operation", label: "操作", fixed: "right", width: 180 }
    );
  } else if (modeSwitching.value == "2") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90,
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "fileCount", label: "份数", width: 85 },
      { prop: "creatorName", label: "申请人", width: 115 },
      { prop: "fileStatus", label: "受控方式",render(scope) {
        const _fileStatus = (scope.row as any).fileStatus;
        return <el-tag type={_fileStatus === 0 ? "success" : "danger"}>{_fileStatus === 0 ? "线上" : "线下"}</el-tag>;
      } },
      { prop: "reviewTime", label: "审查意见", width: 85 },
      { prop: "reviewTime", label: "附件", width: 85 },
      { prop: "reviewTime", label: "审查日期", width: 85 },
      { prop: "reviewTime", label: "备注", width: 85 }
    );
  } else if (modeSwitching.value == "2") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90,
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "fileCount", label: "份数", width: 85 },
      { prop: "creatorName", label: "申请人", width: 115 },
      { prop: "fileStatus", label: "受控方式",render(scope) {
        const _fileStatus = (scope.row as any).fileStatus;
        return <el-tag type={_fileStatus === 0 ? "success" : "danger"}>{_fileStatus === 0 ? "线上" : "线下"}</el-tag>;
      } },
      { prop: "reviewTime", label: "审查意见", width: 85 },
      { prop: "reviewTime", label: "审查日期", width: 85 }
    );
  }
  return fileInfoList(params);
};
const handleRefresh = () => {
  proTable.value?.getTableList();
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
  return (
    <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
  { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
  { prop: "attachmentName", label: "文件名" },
  {
    prop: "attachmentUrl",
    label: "源文件",
    width: 90,
    render(scope) {
      return (
        <a style="color: #3878df" href={(scope.row as any).attachmentUrl} target="_blank">
          查看
        </a>
      );
    }
  },
  { prop: "fileVersion", label: "版本号" },
  { prop: "versionTime", label: "版本日期", width: 85 },
  { prop: "fileCount", label: "份数", width: 85 },
  { prop: "creatorName", label: "申请人", width: 115 },
  { prop: "reviewTime", label: "申请日期", width: 85 },
  { prop: "fileStatus", label: "受控方式",render(scope) {
        const _fileStatus = (scope.row as any).fileStatus;
        return <el-tag type={_fileStatus === 0 ? "success" : "danger"}>{_fileStatus === 0 ? "线上" : "线下"}</el-tag>;
      } },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 导出表
const exportTab = async params => {
  const link = document.createElement('a');
  link.href = params.attachmentUrl;
  link.download = params.attachmentName || '文件下载'; // 使用文件名作为下载文件名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 导出用户列表
// const downloadFile = async () => {
//   ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
//     useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
//   );
// };

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

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
