<template>
  <div class="table-box">
    <div class="flex tops">
      <el-radio-group v-model="modeSwitching" size="large">
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
          <el-radio-button label="撤回" value="3" />
        </el-badge>
        <template v-else>
          <el-radio-button label="撤回" value="3" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '4'" color="green">
          <el-radio-button label="拒绝" value="4" />
        </el-badge>
        <template v-else>
          <el-radio-button label="拒绝" value="4" />
        </template>
      </el-radio-group>
      <el-button type="primary" @click="handleAdd()" style="width: 200px" :icon="Plus"> 文件申请 </el-button>
    </div>
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
        <el-button type="primary" link icon="Delete" v-if="modeSwitching == '0'" @click="deleteAccount(scope.row)">撤回</el-button>
        <div v-if="modeSwitching == '1'">
          <div v-if="scope.row.reuseApplyStatus">
            {{ scope.row.reuseApplyStatus == 1 ? "禁止复用申请中" : "恢复复用申请中" }}
          </div>
          <div v-else>
            <el-button type="primary" link :icon="Refresh" @click="applicationForReuse(scope.row)">申请复用</el-button>
            <el-button type="danger" link icon="CircleCloseFilled" @click="reuseProhibited(scope.row)">禁止复用</el-button>
          </div>
        </div>
        <el-button v-if="modeSwitching == '2'" type="primary" link :icon="EditPen" @click="handleAdd(scope.row)"></el-button>

        <!-- <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button> -->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
    <ReuseApplicationDialog ref="reuseDialog" />
    <BanReuseDialog ref="banReuseDialog" />
    <FileApplicationDialog ref="fileApplicationDialog" />
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
import { CirclePlus, Delete, Plus, Download, CircleCloseFilled, View, Refresh, EditPen } from "@element-plus/icons-vue";
import { getUserList, editUser, addUser, changeUserStatus, resetUserPassWord, exportUserInfo, BatchAddUser, getUserStatus } from "@/api/modules/user";
import { fileInfoList, fileInfoRevoke } from "@/api/modules/fileInfo";
import { el, pa } from "element-plus/es/locale";
import ReuseApplicationDialog from "./ReuseApplicationDialog.vue";
import BanReuseDialog from "./BanReuseDialog.vue";
import FileApplicationDialog from "./FileApplicationDialog.vue";
const fileApplicationDialog = ref();
const banReuseDialog = ref();
const reuseDialog = ref();
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
  params.fileStatus = modeSwitching.value;
  if (modeSwitching.value == "1") {
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
      {
        prop: "checkType",
        label: "受控方式",
        width: 105,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      { prop: "reviewerName", label: "审查人", width: 115 },
      { prop: "reviewRemark", label: "审查意见", width: 115 },
      { prop: "reviewTime", label: "申请日期", width: 85 },
      { prop: "reuseApplyStatus", label: "受控状态", width: 105 },
      {
        prop: "reuseStatus",
        label: "复用状态",
        width: 85,
        render(scope) {
          return <div>{(scope.row as any).reuseStatus === 0 ? "禁用" : "复用"}</div>;
        }
      },
      { prop: "operation", label: "操作", fixed: "right", width: 205 }
    );
  } else if (modeSwitching.value == "2") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", width: 85, search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "rejectAttachmentUrl",
        label: "源文件",
        width: 90,
        render(scope) {
          return (
            <a style="color: #3878df" href={(scope.row as any).rejectAttachmentUrl} target="_blank">
              查看
            </a>
          );
        }
      },
      { prop: "fileCount", label: "份数", width: 85 },
      {
        prop: "fileStatus",
        label: "受控方式",
        width: 105,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      { prop: "reviewerName", label: "审查人", width: 115 },
      { prop: "reviewRemark", label: "审查意见", width: 115 },
      { prop: "reviewTime", label: "审查日期", width: 85 },
      { prop: "reviewTime", label: "附件", width: 105 },
      { prop: "remark", label: "备注", width: 105 },
      { prop: "operation", label: "操作", fixed: "right", width: 80 }
    );
  } else if (modeSwitching.value == "3") {
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
      {
        prop: "fileStatus",
        label: "受控方式",
        width: 105,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      { prop: "reviewTime", label: "撤回日期", width: 85 },
      { prop: "operation", label: "操作", fixed: "right", width: 80 }
    );
  } else if (modeSwitching.value == "4") {
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
      { prop: "fileStatus", label: "受控方式", width: 105 },
      { prop: "reviewerName", label: "审查人", width: 115 },
      { prop: "reviewRemark", label: "审查意见", width: 115 },
      { prop: "reviewTimev", label: "审查日期", width: 85 },
      { prop: "operation", label: "操作", fixed: "right", width: 80 }
    );
  } else {
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
      { prop: "reviewTime", label: "申请日期", width: 85 },
      {
        prop: "fileStatus",
        label: "受控方式",
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      { prop: "reviewerName", label: "审查人", width: 115 },
      { prop: "operation", label: "操作", fixed: "right", width: 80 }
    );
  }
  return fileInfoList(params);
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
  { prop: "fileCount", label: "份数", width: 85 },
  { prop: "reviewTime", label: "申请日期", width: 85 },
  {
    prop: "fileStatus",
    label: "受控方式",
    render(scope) {
      return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
    }
  },
  { prop: "reviewerName", label: "审查人", width: 115 },
  { prop: "operation", label: "操作", fixed: "right", width: 80 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async params => {
  await useHandleData(fileInfoRevoke, { fileId: params.fileId }, `撤回${params.projectName}】用户`);
  proTable.value?.getTableList();
};
const applicationForReuse = params => {
  reuseDialog.value.openDialog(params);
};

// 切换用户状态
const reuseProhibited = async (row: User.ResUserList) => {
  banReuseDialog.value.openDialog(row);
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
const handleAdd = (params?: any) => {
  if (params) {
    fileApplicationDialog.value.openDialog(params);
  } else {
    fileApplicationDialog.value.openDialog({});
  }
};
</script>
<style scoped>
.flex {
  display: flex;
}
.tops {
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}
</style>
