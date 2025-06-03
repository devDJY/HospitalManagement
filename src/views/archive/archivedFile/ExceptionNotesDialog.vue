<template>
  <el-dialog title="异常备注" v-model="dialogVisible" width="600px" :close-on-click-modal="false" class="exception-notes-dialog">
    <!-- 新增按钮 -->
    <div class="add-button">
      <el-button type="primary" plain icon="Plus" @click="openRemarks">新增</el-button>
    </div>
    <!-- 异常列表 -->
    <el-table :data="exceptionNotes" style="width: 100%" empty-text="暂无异常备注" class="exception-table">
      <el-table-column prop="creatorName" label="创建人" width="120" />
      <el-table-column prop="createTime" label="创建日期" width="150" />
      <el-table-column prop="remark" label="异常内容" />
    </el-table>

    <!-- 新增异常备注弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增异常备注" width="500px" append-to-body>
      <el-form :model="newNote" label-width="80px">
        <el-form-item label="异常内容" required>
          <el-input v-model="newNote.content" type="textarea" :rows="4" placeholder="请输入异常内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addExceptionNote">确定</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { archiveFileAddLog, archiveFileQueryLog } from "@/api/modules/archives";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";

const dialogVisible = ref(false);
const addDialogVisible = ref(false);

// 添加异常备注
const addExceptionNote = async () => {
  if (!newNote.content.trim()) {
    ElMessage.warning("请输入异常内容");
    return;
  }
  archiveFileAddLog({
    printId: printId.value,
    remark: newNote.content
  });
  ElMessage.success("添加成功");
  addDialogVisible.value = false;
};
// 异常备注数据
const exceptionNotes = ref([
  // {
  //   id: 1,
  //   creator: '张三',
  //   createDate: '2023-05-15',
  //   content: '文件编号重复'
  // },
  // 更多数据...
]);
// 新增备注表单
const newNote = reactive({
  content: ""
});
const printId = ref("");
const openDialog = async (params: any) => {
  printId.value = params.printId;
  await init();
  dialogVisible.value = true;
};
// 打开弹窗
const openRemarks = () => {
  addDialogVisible.value = true;
};
const init = async () => {
  let data: any = await archiveFileQueryLog({ printId: printId.value });
  exceptionNotes.value = data.records as [];
};
defineExpose({
  openDialog
});
</script>

<style scoped lang="scss">
.exception-notes-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .exception-list {
    margin-bottom: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .exception-header {
    display: flex;
    padding: 12px 15px;
    font-weight: bold;
    color: #333333;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    .header-item {
      flex: 1;
      text-align: center;
      &:first-child {
        text-align: left;
      }
    }
  }
  .exception-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    .item-content,
    .item-creator,
    .item-date {
      flex: 1;
      &:first-child {
        text-align: left;
      }
    }
    .item-content {
      font-weight: 500;
      color: #f56c6c;
    }
    .item-creator,
    .item-date {
      color: #606266;
      text-align: center;
    }
  }
  .add-button {
    margin-bottom: 10px;
    text-align: right;
  }
}
</style>
