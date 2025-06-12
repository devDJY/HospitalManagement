<template>
  <div class="table-box">
    <div class="flex tops">
      <el-radio-group v-model="modeSwitching" size="large" style="margin-bottom: 10px">
        <el-badge :value="0" class="item" v-if="modeSwitching === '1'" color="green">
          <el-radio-button label="进行中" value="1" />
        </el-badge>
        <template v-else>
          <el-radio-button label="进行中" value="1" />
        </template>
        <el-badge :value="0" class="item" v-if="modeSwitching === '2'" color="green">
          <el-radio-button label="锁库" value="2" />
        </el-badge>
        <template v-else>
          <el-radio-button label="锁库" value="2" />
        </template>
      </el-radio-group>
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
        <el-button type="success" link :icon="Search" @click="resetPass(scope.row)">查看</el-button>
        <el-button type="success" link :icon="Download" @click="exportFile(scope.row)">导出</el-button>
      </template>
      <!-- <template #append>
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
          <!-- <el-button type="primary" @click="lockOK()"> 确定 </el-button> -->
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="complexProTable">
import { reactive, ref, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { deleteUser, resetUserPassWord } from "@/api/modules/user";
import { projectList, projectLock, projectDelete, projectMoveAuthUserQuery } from "@/api/modules/project";
import { Search, Download } from "@element-plus/icons-vue";
import { archiveExcelReport, archiveFileDownload, archiveList } from "@/api/modules/archives";
import { useDownload } from "@/hooks/useDownload";
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
const modeSwitching = ref("1");
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
      { prop: "projectCode", label: "项目立项号", search: { el: "input", tooltip: "" } },
      { prop: "projectName", label: "项目名称", width: 100, search: { el: "input", tooltip: "" } },
      { prop: "enrollCount", label: "入组列数", width: 100 },
      {
        prop: "base",
        label: "文件",
        headerRender,
        _children: [
          { prop: "saveCount", label: "存档" },
          { prop: "printCount", label: "打印" },
          {
            prop: "usedCount",
            label: "使用"
          },
          {
            prop: "recycleCount",
            label: "回收"
          },
          {
            prop: "destroyCount",
            label: "销毁"
          },
          {
            prop: "loseCount",
            label: "遗失"
          }
        ]
      },
      { prop: "enrollCount", label: "管理员", width: 100 },
      { prop: "operation", label: "操作", fixed: "right", width: 150 }
    );
  } else if (modeSwitching.value == "2") {
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
          { prop: "saveCount", label: "存档" },
          { prop: "printCount", label: "打印" },
          {
            prop: "usedCount",
            label: "使用"
          },
          {
            prop: "recycleCount",
            label: "回收"
          },
          {
            prop: "destroyCount",
            label: "销毁"
          },
          {
            prop: "loseCount",
            label: "遗失"
          }
        ]
      },
      { prop: "enrollCount", label: "管理员", width: 100 },
      { prop: "enrollCount", label: "锁库说明", width: 100 },
      { prop: "enrollCount", label: "锁库日期", width: 100 },
      { prop: "operation", label: "操作", fixed: "right", width: 150 }
    );
  }
  params.projectStatus = Number(modeSwitching.value) - 1;
  return archiveList(params);
};

// 导出项目
const exportFile = async (params: any) => {
  ElMessageBox.confirm("确认导出?", "温馨提示", { type: "warning" }).then(() => useDownload("/archive/excel/report", archiveExcelReport, `${params.projectName}项目详情`, params));
};
// 重置用户密码
const resetPass = async params => {
  router.push(`/archive/archivedFile`);
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
