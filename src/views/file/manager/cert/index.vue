<template>
  <div class="table-box">
    <el-radio-group v-model="modeSwitching" size="large" style="margin-bottom: 10px">
      <el-badge :value="0" class="item" v-if="modeSwitching === '1'" color="green">
        <el-radio-button label="待受控" value="1" />
      </el-badge>
      <template v-else>
        <el-radio-button label="待受控" value="1" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '2'" color="green">
        <el-radio-button label="已受控" value="2" />
      </el-badge>
      <template v-else>
        <el-radio-button label="已受控" value="2" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '3'" color="green">
        <el-radio-button label="已打印" value="3" />
      </el-badge>
      <template v-else>
        <el-radio-button label="已打印" value="3" />
      </template>
      <el-badge :value="0" class="item" v-if="modeSwitching === '4'" color="green">
        <el-radio-button label="已作废" value="4" />
      </el-badge>
      <template v-else>
        <el-radio-button label="已作废" value="4" />
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
      <template #attachmentUrl="scope">
        <el-button type="primary" link @click="goToDetails(scope, 1)"> 查看 </el-button>
      </template>
      <template #attachmentUrl2="scope">
        <el-button type="primary" link @click="goToDetails(scope, 2)"> 查看 </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" v-if="modeSwitching == '1'" link :icon="Star" @click="controlledDialog(scope.row)">受控</el-button>
        <el-button type="primary" v-if="modeSwitching == '1'" link :icon="CloseBold" @click="cancelTheControlledDialog(scope.row)">取消受控</el-button>
        <el-button type="primary" v-if="modeSwitching == '2'" link :icon="Delete" @click="openAuditDialog(scope.row)">作废</el-button>
        <!-- <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button> -->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
    <RePrintAuditDialog ref="auditDialog" @refreshData="handleRefresh" />
    <el-dialog v-model="dialogVisible" title="受控" width="500">
      <span>是否确定给该文件加受控编码、水印，并发放使用？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="issuanceAndUse()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="lockDialog" title="取消受控" width="500px">
      <el-tag type="warning" style="margin-bottom: 10px">温馨提示：取消受控后，文件将进入【形式审查-驳回】 列表</el-tag>
      <div class="flex">
        <div class="required-label">取消原因</div>
        <el-input v-model="remark" type="textarea" :rows="4" placeholder="请输入..." resize="none" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="lockDialog = false">取消</el-button>
          <el-button type="primary" @click="lockOK()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
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
import { CirclePlus, Delete, EditPen, Download, Upload, View, Star, CloseBold } from "@element-plus/icons-vue";
import { deleteUser, editUser, addUser, changeUserStatus, resetUserPassWord, exportUserInfo, BatchAddUser, getUserStatus } from "@/api/modules/user";
import { de, pa } from "element-plus/es/locale";
import { fileControllerCancelCertList, fileControllerCertList, fileControllerPrintCertList, fileControllerWaitList } from "@/api/modules/fileInfo";
import dayjs from "dayjs";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import RePrintAuditDialog from "./RePrintAuditDialog.vue";
import { fileControllerFileCert, fileControllerFileCertRevert } from "@/api/modules/filecontroller";
const auditDialog = ref();
const fileControllerIds = ref([]);
const openAuditDialog = (params: any) => {
  auditDialog.value.openDialog(params);
};
const router = useRouter();

// 模式切换
const modeSwitching = ref("1");
const dialogVisible = ref(false);
const lockDialog = ref(false);
const remark = ref("");
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });
const goToDetails = (scope, type: number) => {
  console.log(scope);
  router.push({
    name: "fileDetails", // 路由名称
    query: {
      fileId: scope.row.fileId,
      isManager: 1,
      type: type
    }
  });
};
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
watch(
  () => modeSwitching.value,
  () => {
    proTable.value?.getTableList();
  }
);
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  params.status = modeSwitching.value;
  if (modeSwitching.value == "1") {
    columns.splice(
      0,
      columns.length,
      { type: "selection", fixed: "left", width: 70 },
      { prop: "projectName", label: "项目名称", search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名", width: 80 },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90
      },
      { prop: "fileVersion", label: "版本号" },
      { prop: "versionTime", label: "版本日期", width: 125 },
      { prop: "fileCount", label: "申请份数", width: 90 },
      {
        prop: "checkType",
        label: "受控方式",
        width: 90,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      { prop: "creatorName", label: "申请人", width: 85 },
      {
        prop: "applyTime",
        label: "申请日期",
        width: 120,
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{anyRow.applyTime ? dayjs(anyRow.applyTime).format("YYYY-MM-DD") : ""}</div>;
        }
      },
      { prop: "operation", label: "操作", fixed: "right", width: 120 }
    );
  } else if (modeSwitching.value == "2") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名", width: 80 },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90
      },
      { prop: "fileVersion", label: "版本号" },
      { prop: "versionTime", label: "版本日期", width: 125 },
      {
        prop: "attachmentUrl2",
        label: "受控文件",
        width: 90
      },
      { prop: "fileControllerCode", label: "文件受控码", width: 105 },
      { prop: "fileCount", label: "申请份数", width: 90 },
      {
        prop: "checkType",
        label: "受控方式",
        width: 90,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      {
        prop: "reviewerTime",
        label: "受控日期",
        width: 120,
        render(scope) {
          return <div>{scope.row.reviewerTime ? dayjs(scope.row.reviewerTime).format("YYYY-MM-DD") : ""}</div>;
        }
      },
      // { prop: "creatorName", label: "申请人", width: 85 },
      // {
      //   prop: "applyTime",
      //   label: "申请日期",
      //   width: 120,
      //   render(scope) {
      //     const anyRow = scope.row as any;
      //     return <div>{anyRow.applyTime ? dayjs(anyRow.applyTime).format("YYYY-MM-DD") : ""}</div>;
      //   }
      // },
      { prop: "operation", label: "操作", fixed: "right", width: 120 }
    );
  } else if (modeSwitching.value == "3") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
      { prop: "attachmentName", label: "文件名", width: 80 },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90
      },
      { prop: "fileVersion", label: "版本号" },
      { prop: "versionTime", label: "版本日期", width: 125 },
      {
        prop: "attachmentUrl2",
        label: "受控文件",
        width: 90
      },
      { prop: "fileControllerCode", label: "文件受控码", width: 90 },
      { prop: "fileCount", label: "打印份数", width: 90 },
      {
        prop: "checkType",
        label: "受控方式",
        width: 90,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      { prop: "creatorName", label: "打印人", width: 85 },
      {
        prop: "createTime",
        label: "打印日期",
        width: 120,
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{anyRow.createTime ? dayjs(anyRow.createTime).format("YYYY-MM-DD") : ""}</div>;
        }
      }
    );
  } else if (modeSwitching.value == "4") {
    columns.splice(
      0,
      columns.length,
      { prop: "projectName", label: "项目名称", search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件",
        width: 90
      },
      { prop: "fileVersion", label: "版本号" },
      { prop: "versionTime", label: "版本日期", width: 125 },
      {
        prop: "attachmentUrl2",
        label: "受控文件",
        width: 90
      },
      { prop: "fileControllerCode", label: "文件受控码", width: 105 },
      { prop: "fileCount", label: "作废份数", width: 90 },
      { prop: "remark", label: "作废说明", width: 85 },
      {
        prop: "reviewerTime",
        label: "作废日期",
        width: 120,
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{anyRow.reviewerTime ? dayjs(anyRow.reviewerTime).format("YYYY-MM-DD") : ""}</div>;
        }
      }
    );
  }
  switch (modeSwitching.value) {
    case "1":
      return fileControllerWaitList(params);
      break;
    case "2":
      return fileControllerCertList(params);
      break;
    case "3":
      return fileControllerPrintCertList(params);
      break;
    case "4":
      return fileControllerCancelCertList(params);
      break;
    default:
      return fileControllerWaitList(params);
  }
};
const fileId = ref("");
const controlledDialog = (row: any) => {
  fileId.value = row.fileId;
  dialogVisible.value = true;
};
const cancelTheControlledDialog = (row: any) => {
  fileId.value = row.fileId;
  lockDialog.value = true;
};
const handleRefresh = () => {
  proTable.value?.getTableList();
};
const issuanceAndUse = () => {
  fileControllerFileCert({ fileId: fileId.value }).then((res: any) => {
    ElMessage.success("受控成功");
    dialogVisible.value = false;
    proTable.value?.getTableList();
  });
};
const lockOK = () => {
  if (remark.value == "") {
    ElMessage.error("请输入取消原因");
    return;
  } else {
    fileControllerFileCertRevert({ fileId: fileId.value, remark: remark.value }).then((res: any) => {
      ElMessage.success("取消受控成功");
      lockDialog.value = false;
      remark.value = "";
      proTable.value?.getTableList();
    });
  }
};
// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { prop: "projectName", label: "项目名称", search: { el: "input" } },
  { prop: "fileCode", label: "文件编码", width: 85, search: { el: "input" } },
  { prop: "attachmentName", label: "文件名", width: 80 },
  {
    prop: "attachmentUrl",
    label: "源文件",
    width: 90
  },
  { prop: "fileVersion", label: "版本号" },
  { prop: "versionTime", label: "版本日期", width: 125 },
  { prop: "fileCount", label: "申请份数", width: 90 },
  {
    prop: "checkType",
    label: "受控方式",
    width: 90,
    render(scope) {
      return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
    }
  },
  { prop: "creatorName", label: "申请人", width: 85 },
  {
    prop: "applyTime",
    label: "申请日期",
    width: 120,
    render(scope) {
      const anyRow = scope.row as any;
      return <div>{anyRow.applyTime ? dayjs(anyRow.applyTime).format("YYYY-MM-DD") : ""}</div>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 120 }
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

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
  proTable.value?.getTableList();
};

// 导出用户列表
// const downloadFile = async () => {
//   ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() => useDownload('/user/export',exportUserInfo, "用户列表", proTable.value?.searchParam));
// };

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
<style scoped>
.required-label {
  position: relative;
  width: 90px;
  padding-left: 12px;
}
.required-label::before {
  position: absolute;
  left: 0;
  color: #f56c6c;
  content: "*";
}
</style>
