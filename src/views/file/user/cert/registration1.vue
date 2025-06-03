<template>
  <el-dialog title="使用登记" v-model="dialogVisible" width="800px" :close-on-click-modal="false" class="registration-dialog">
    <!-- 表单内容 -->
    <el-form label-width="100px" label-position="top">
      <!-- 项目名称 -->
      <el-form-item label="项目名称">
        <el-input v-model="formData.projectName" :value="longProjectName" disabled class="disabled-input" />
      </el-form-item>

      <!-- 文件编码 -->
      <el-form-item label="文件编码">
        <el-input v-model="formData.fileCode" :value="'2024-YW-031-GYJLB'" disabled class="disabled-input" />
      </el-form-item>

      <!-- 文件名 -->
      <el-form-item label="文件名">
        <el-input v-model="formData.fileName" :value="'3肝损左奥-给药记录表'" disabled class="disabled-input" />
      </el-form-item>

      <!-- 文件列表（多选） -->
      <el-form-item label="文件受控编码" required>
        <el-checkbox-group v-model="formData.selectedFiles">
          <el-checkbox v-for="file in fileList" :key="file.id" :label="file.code" class="file-checkbox">
            <div class="file-item">
              <span class="file-label">文件受控编码</span>
              <span class="file-code">{{ file.code }}</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 使用说明 -->
      <el-form-item label="使用说明">
        <el-input v-model="formData.instructions" type="textarea" :rows="4" placeholder="请输入使用说明..." resize="none" class="instructions-input" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="large" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="large" @click="handleSubmit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { fileControllerPrintCertUpdateUsed } from "@/api/modules/fileInfo";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

const dialogVisible = ref(false);

// 文件列表数据
const fileList = ref([
  { id: 1, code: "2024-YW-031-GYJLB-0001" },
  { id: 2, code: "2024-YW-031-GYJLB-0002" }
  // 可以添加更多文件...
]);

// 长项目名称常量
const longProjectName = "一项评价注射用磷酸左奥硝唑酯二钠在肝功能不全受试者中的药代动力学与安全性的开放、平行、单次给药的临床试验";

// 表单数据
const formData = reactive({
  projectName: longProjectName,
  fileCode: "2024-YW-031-GYJLB",
  fileName: "3肝损左奥-给药记录表",
  selectedFiles: [], // 存储选中的文件编码
  instructions: ""
});

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  resetForm();
};

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false;
};

// 取消操作
const handleCancel = () => {
  closeDialog();
};

// 重置表单
const resetForm = () => {
  formData.selectedFiles = [];
  formData.instructions = "";
};

// 提交处理
const handleSubmit = async () => {
  console.log("提交数据:", formData);
  let data = {
    fileControllerIds: formData.selectedFiles,
    remark: formData.instructions
  };
  await fileControllerPrintCertUpdateUsed(data);
  ElMessage.success("操作成功");
  closeDialog();
};

defineExpose({
  openDialog,
  closeDialog
});
</script>

<style scoped lang="scss">
.registration-dialog {
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item {
    margin-bottom: 18px;
    :deep(.el-form-item__label) {
      padding-bottom: 8px;
      font-weight: bold;
      color: #333333;
    }
  }
  .disabled-input {
    :deep(.el-input__inner) {
      color: #606266;
      background-color: #f5f7fa;
    }
  }
  .file-checkbox {
    display: block;
    margin-bottom: 8px;
    .file-item {
      display: flex;
      gap: 10px;
      align-items: center;
      .file-label {
        color: #666666;
      }
      .file-code {
        font-weight: bold;
      }
    }
  }
  .instructions-input {
    :deep(.el-textarea__inner) {
      min-height: 120px;
    }
  }
  .dialog-footer {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    padding-top: 10px;
    .el-button {
      width: 100px;
    }
  }
}
</style>
