<template>
  <el-dialog title="重新打印申请" v-model="dialogVisible" width="800px" :close-on-click-modal="false" class="registration-dialog">
    <!-- 表单内容 -->
    <el-form label-width="100px" label-position="top">
      <!-- 项目名称 -->
      <el-form-item label="项目名称">
        <el-input :value="formData.projectName" disabled class="disabled-input" />
      </el-form-item>

      <!-- 文件编码 -->
      <el-form-item label="文件编码">
        <el-input :value="formData.fileCode" disabled class="disabled-input" />
      </el-form-item>

      <!-- 文件名 -->
      <el-form-item label="文件名">
        <el-input :value="formData.fileName" disabled class="disabled-input" />
      </el-form-item>

      <!-- 文件列表（多选） -->
      <el-form-item label="文件" required>
        <el-table :data="fileList" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="fileControllerCode" label="文件受控编码" align="center" />
        </el-table>
        <el-checkbox-group v-model="formData.selectedFiles">
          <!-- <el-checkbox v-for="file in fileList" :key="file.id" :label="file.code" class="file-checkbox">
            <div class="file-item">
              <span class="file-label">文件受控编码</span>
              <span class="file-code">{{ file.code }}</span>
            </div>
          </el-checkbox> -->
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="审核人" required>
        <el-select v-model="formData.reviewerId" placeholder="请选择..." filterable style="width: 100%">
          <el-option v-for="item in reviewerOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 使用说明 -->
      <el-form-item label="申请说明" required>
        <el-input v-model="formData.instructions" type="textarea" :rows="4" placeholder="请输入申请说明..." resize="none" class="instructions-input" />
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
import { fileControllerPrintCertGetWaitFile } from "@/api/modules/filecontroller";
import { fileControllerPrintCertUpdateUsed, fileInfoAddGetReviewerList } from "@/api/modules/fileInfo";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

const dialogVisible = ref(false);

// 文件列表数据
const fileList = ref();
const reviewerOptions: any = ref([]);

// 长项目名称常量

// 表单数据
const formData = reactive({
  projectName: "",
  fileCode: "",
  fileName: "",
  reviewerId: "", // 审核人ID
  selectedFiles: [], // 存储选中的文件编码
  instructions: ""
});
// 用户ID列表
const handleSelectionChange = val => {
  formData.selectedFiles = val.map(item => item.fileControllerId);
};
// 打开弹窗
const openDialog = data => {
  Object.assign(formData, {
    projectName: data.projectName || "",
    fileCode: data.fileCode || "",
    fileName: data.attachmentName || "" // 注意字段名对应
  });
  fileControllerPrintCertGetWaitFile({ filePrintId: data.filePrintId }).then(res => {
    fileList.value = res.data;
  });
  fileInfoAddGetReviewerList({ projectId: data.projectId }).then((response: any) => {
    reviewerOptions.value = response.data.map((item: any) => ({
      value: item.userId,
      label: item.nickName
    }));
  });
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
  if (formData.selectedFiles.length === 0) {
    ElMessage.warning("请至少选择一个文件受控码");
    return;
  }
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
