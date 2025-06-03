<template>
  <el-dialog title="文件回收" v-model="dialogVisible" width="800px" :close-on-click-modal="false" class="file-recycle-dialog">
    <el-form label-width="100px" label-position="top">
      <!-- 项目信息 -->
      <el-form-item label="项目名称">
        <el-input v-model="form.projectName" :value="projectName" disabled />
      </el-form-item>

      <el-form-item label="文件编码">
        <el-input v-model="form.fileCode" :value="'2024-YW-031-GYJLB'" disabled />
      </el-form-item>

      <el-form-item label="文件名">
        <el-input v-model="form.fileName" :value="'3肝损左奥-给药记录表'" disabled />
      </el-form-item>

      <!-- 文件回收表格 -->
      <el-form-item label="* 文件" required>
        <el-table :data="fileList" border style="width: 100%" class="recycle-table">
          <el-table-column width="50">
            <template #default="{ row }">
              <el-checkbox v-model="row.selected" />
            </template>
          </el-table-column>
          <el-table-column prop="controlCode" label="文件受控编码" />
          <el-table-column label="回收原因" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.recyclable" type="success">可回收</el-tag>
              <el-tag v-else type="danger">不可回收</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="回收说明" width="120">
            <template #default="{ row }">
              <el-icon v-if="row.hasDescription" color="#67C23A" :size="20">
                <CircleCheck />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 审核人 -->
      <el-form-item label="* 审核人" required>
        <el-select v-model="form.reviewer" placeholder="请选择..." style="width: 100%">
          <el-option v-for="item in reviewers" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 附件上传 -->
      <el-form-item label="附件">
        <el-upload action="#" :limit="5" :on-exceed="handleExceed" :auto-upload="false">
          <el-button type="primary" plain icon="Plus">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">支持上传PDF、Word、Excel、图片等格式文件</div>
          </template>
        </el-upload>
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
import { CircleCheck } from "@element-plus/icons-vue";

const dialogVisible = ref(false);

// 项目信息
const projectName = "一项评价注射用磷酸左奥硝唑酯二钠在肝功能不全受试者中的药代动力学与安全性的开放、平行、单次给药的临床试验";

// 审核人选项
const reviewers = [
  { value: "1", label: "张三" },
  { value: "2", label: "李四" },
  { value: "3", label: "王五" }
];

// 文件列表数据
const fileList = reactive([
  {
    id: 1,
    controlCode: "2024-YW-031-GYJLB-0001",
    selected: false,
    recyclable: true,
    hasDescription: true
  }
  // 可以添加更多文件...
]);

// 表单数据
const form = reactive({
  projectName: projectName,
  fileCode: "2024-YW-031-GYJLB",
  fileName: "3肝损左奥-给药记录表",
  reviewer: "", // 审核人
  attachments: [] // 附件
});

// 文件上传超出限制
const handleExceed = () => {
  ElMessage.warning("最多上传5个文件");
};

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  resetForm();
};

// 重置表单
const resetForm = () => {
  fileList.forEach(file => (file.selected = false));
  form.reviewer = "";
  form.attachments = [];
};

// 提交表单
const handleSubmit = () => {
  const selectedFiles = fileList.filter(file => file.selected);
  if (selectedFiles.length === 0) {
    ElMessage.warning("请至少选择一个文件");
    return;
  }
  if (!form.reviewer) {
    ElMessage.warning("请选择审核人");
    return;
  }

  console.log("提交文件回收:", {
    ...form,
    selectedFiles
  });
  dialogVisible.value = false;
  ElMessage.success("提交成功");
};

defineExpose({
  openDialog
});
</script>

<style scoped lang="scss">
.file-recycle-dialog {
  .el-dialog__body {
    padding: 20px 25px;
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
  .recycle-table {
    margin-top: 10px;
    :deep(.el-table__cell) {
      padding: 8px 0;
    }
  }
  .el-upload__tip {
    margin-top: 5px;
    font-size: 12px;
    color: #999999;
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
