<template>
  <el-dialog title="重新打印申请" v-model="dialogVisible" width="700px" :close-on-click-modal="false" class="reprint-dialog">
    <!-- 顶部文件信息 -->
    <div class="file-header">
      <span class="file-name">3肝损左奥-给药记录表</span>
      <div class="file-actions">
        <el-button link type="primary" size="small">查看</el-button>
        <el-button link type="primary" size="small">查看</el-button>
        <span class="file-code">2024-YW-031-GY.IL</span>
      </div>
    </div>

    <el-divider />

    <!-- 表单内容 -->
    <el-form label-width="100px">
      <!-- 项目名称 -->
      <el-form-item label="项目名称">
        <el-input v-model="form.projectName" :value="projectName" disabled />
      </el-form-item>

      <!-- 文件编码 -->
      <el-form-item label="文件编码">
        <el-input v-model="form.fileCode" :value="'2024-YW-031-GY.ILB'" disabled />
      </el-form-item>

      <!-- 文件名 -->
      <el-form-item label="文件名">
        <el-input v-model="form.fileName" :value="'3肝损左奥-给药记录表'" disabled />
      </el-form-item>

      <!-- 文件选择 -->
      <el-form-item label="* 文件" required>
        <div class="file-selection">
          <el-checkbox-group v-model="form.selectedFiles">
            <el-checkbox label="文件受控编码" class="file-label" />
            <el-checkbox :label="'2024-YW-031-GY.ILB-0001'" class="file-code" />
          </el-checkbox-group>
        </div>
      </el-form-item>

      <!-- 审核人 -->
      <el-form-item label="* 审核人" required>
        <el-select v-model="form.reviewer" placeholder="请选择..." style="width: 100%">
          <el-option v-for="item in reviewers" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 申请说明 -->
      <el-form-item label="* 申请说明" required>
        <el-input v-model="form.applicationNote" type="textarea" :rows="3" placeholder="请输入..." resize="none" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);

// 项目信息
const projectName = "一项评价注射用磷酸左奥硝唑酯二钠在肝功能不全受试者中的药代动力学与安全性的开放、平行、单次给药的临床试验";

// 审核人选项
const reviewers = [
  { value: "1", label: "张三" },
  { value: "2", label: "李四" },
  { value: "3", label: "王五" }
];

// 表单数据
const form = reactive({
  projectName: projectName,
  fileCode: "2024-YW-031-GY.ILB",
  fileName: "3肝损左奥-给药记录表",
  selectedFiles: [], // 选中的文件
  reviewer: "", // 审核人
  applicationNote: "" // 申请说明
});

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  resetForm();
};

// 重置表单
const resetForm = () => {
  form.selectedFiles = [];
  form.reviewer = "";
  form.applicationNote = "";
};

// 提交表单
const handleSubmit = () => {
  if (form.selectedFiles.length === 0) {
    ElMessage.warning("请选择文件");
    return;
  }
  if (!form.reviewer) {
    ElMessage.warning("请选择审核人");
    return;
  }
  if (!form.applicationNote.trim()) {
    ElMessage.warning("请输入申请说明");
    return;
  }

  console.log("提交重新打印申请:", form);
  dialogVisible.value = false;
  ElMessage.success("申请已提交");
};

defineExpose({
  openDialog
});
</script>

<style scoped lang="scss">
.reprint-dialog {
  .el-dialog__body {
    padding: 15px 25px;
  }
  .file-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .file-name {
      font-size: 16px;
      font-weight: bold;
    }
    .file-actions {
      display: flex;
      gap: 15px;
      align-items: center;
      .file-code {
        font-family: monospace;
        color: #666666;
      }
    }
  }
  .el-form-item {
    margin-bottom: 18px;
    :deep(.el-form-item__label) {
      font-weight: bold;
      color: #333333;
      &::before {
        margin-right: 4px;
        color: #f56c6c;
        content: "*";
      }
    }
  }
  .file-selection {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .file-label {
      margin-right: 15px;
    }
    .file-code {
      :deep(.el-checkbox__label) {
        font-family: monospace;
      }
    }
  }
  .dialog-footer {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    .el-button {
      width: 100px;
    }
  }
}
</style>
