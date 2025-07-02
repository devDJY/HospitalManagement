<template>
  <div class="table-box">
    <el-radio-group v-model="modeSwitching" size="large" style="margin-bottom: 10px">
      <el-badge :value="total" class="item" v-if="modeSwitching === '1'" color="green">
        <el-radio-button label="受控中" value="1" />
      </el-badge>
      <template v-else>
        <el-radio-button label="受控中" value="1" />
      </template>
      <el-badge :value="total" class="item" v-if="modeSwitching === '2'" color="green">
        <el-radio-button label="已受控" value="2" />
      </el-badge>
      <template v-else>
        <el-radio-button label="已受控" value="2" />
      </template>
      <el-badge :value="total" class="item" v-if="modeSwitching === '3'" color="green">
        <el-radio-button label="已打印" value="3" />
      </el-badge>
      <template v-else>
        <el-radio-button label="已打印" value="3" />
      </template>
      <el-badge :value="total" class="item" v-if="modeSwitching === '5'" color="green">
        <el-radio-button label="已使用" value="5" />
      </el-badge>
      <template v-else>
        <el-radio-button label="已使用" value="5" />
      </template>
      <el-badge :value="total" class="item" v-if="modeSwitching === '4'" color="green">
        <el-radio-button label="已作废" value="4" />
      </el-badge>
      <template v-else>
        <el-radio-button label="已作废" value="4" />
      </template>
    </el-radio-group>
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" @drag-sort="sortTable" :total="dataCallback">
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
        <el-dropdown placement="bottom-end" v-if="modeSwitching == '3'">
          <el-icon><Grid /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="operate(scope.row, 1)">使用登记</el-dropdown-item>
              <el-dropdown-item @click="operate(scope.row, 2)">遗失审核</el-dropdown-item>
              <el-dropdown-item @click="operate(scope.row, 3)">文件回收</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.checkType === 0" @click="operate(scope.row, 4)">重新打印</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="primary" v-if="modeSwitching != '3' && scope.row.checkType == 0" link :icon="Printer" @click="openAuditDialog(scope.row)">打印</el-button>
        <!-- <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button> -->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
    <RePrintAuditDialog ref="auditDialog" />
    <registration1 ref="registration1s" />
    <registration2 ref="registration2s" />
    <registration3 ref="registration3s" />
    <registration4 ref="registration4s" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive, watch, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh, Printer } from "@element-plus/icons-vue";
import { deleteUser, editUser, addUser, changeUserStatus, resetUserPassWord, exportUserInfo, BatchAddUser, getUserStatus } from "@/api/modules/user";
import { da, de, pa } from "element-plus/es/locale";
import { fileControllerCancelCertList, fileControllerCertList, fileControllerPrintCertList, fileControllerUsedCertList, fileControllerWaitList } from "@/api/modules/fileInfo";
import dayjs from "dayjs";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import RePrintAuditDialog from "./RePrintAuditDialog.vue";
import registration1 from "./registration1.vue";
import registration2 from "./registration2.vue";
import registration3 from "./registration3.vue";
import registration4 from "./registration4.vue";
const auditDialog = ref();
const registration1s = ref();
const registration2s = ref();
const registration3s = ref();
const registration4s = ref();
const total = ref(0);
const openAuditDialog = (params: any) => {
  auditDialog.value.openDialog(params);
};
const router = useRouter();

// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
};
// 模式切换
const modeSwitching = ref("1");
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  total.value = data;
};
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
      { prop: "projectName", label: "项目名称", search: { el: "input" } },
      { prop: "fileCode", label: "文件编码", search: { el: "input" } },
      { prop: "attachmentName", label: "文件名" },
      {
        prop: "attachmentUrl",
        label: "源文件"
      },
      { prop: "fileVersion", label: "版本号" },
      { prop: "versionTime", label: "版本日期", width: 125 },
      { prop: "fileCount", label: "申请份数" }
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
      { prop: "fileControllerCode", label: "文件受控码", search: { el: "input" } },
      { prop: "fileCount", label: "申请份数", width: 90 },
      {
        prop: "checkType",
        label: "受控方式",
        width: 90,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      { prop: "reviewerName", label: "受控发放人" },
      {
        prop: "reviewerTime",
        label: "受控发放日期",
        width: 120,
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{anyRow.reviewerTime ? dayjs(anyRow.reviewerTime).format("YYYY-MM-DD") : ""}</div>;
        }
      },
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
      { prop: "fileControllerCode", label: "文件受控码", search: { el: "input" } },
      { prop: "fileCount", label: "打印份数", width: 90 },
      {
        prop: "checkType",
        label: "受控方式",
        width: 90,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      {
        prop: "createTime",
        label: "打印日期",
        width: 120,
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{anyRow.createTime ? dayjs(anyRow.createTime).format("YYYY-MM-DD") : "--"}</div>;
        }
      },
      { prop: "operation", label: "操作", fixed: "right", width: 120 }
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
      { prop: "fileControllerCode", label: "文件受控码", search: { el: "input" }, width: 105 },
      { prop: "fileCount", label: "作废份数", width: 90 },
      { prop: "reviewerName", label: "作废人", width: 90 },
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
  } else if (modeSwitching.value == "5") {
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
      { prop: "fileControllerCode", label: "文件受控码", width: 105, search: { el: "input" } },
      { prop: "fileCount", label: "使用份数", width: 90 },
      {
        prop: "checkType",
        label: "受控方式",
        width: 90,
        render(scope) {
          return <div>{(scope.row as any).checkType === 0 ? "线上受控" : "线下受控"}</div>;
        }
      },
      {
        prop: "reviewTime",
        label: "使用登记日期",
        width: 120,
        render(scope) {
          const anyRow = scope.row as any;
          return <div>{anyRow.reviewTime ? dayjs(anyRow.revieweTime).format("YYYY-MM-DD") : ""}</div>;
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
    case "5":
      return fileControllerUsedCertList(params);
      break;
    default:
      return fileControllerWaitList(params);
  }
};
onMounted(() => {
  const route = useRoute();
  modeSwitching.value = String(route.query.step || "1");
});
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
const operate = async (params, index) => {
  switch (index) {
    case 1:
      registration1s.value.openDialog(params);
      break;
    case 2:
      registration2s.value.openDialog(params);
      break;
      break;
    case 3:
      registration3s.value.openDialog(params);
      break;
    case 4:
      registration4s.value.openDialog(params);
      break;
  }
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
