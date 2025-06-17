<template>
  <el-dialog v-model="dialogVisible" title="请填写打印份数" width="400px" :close-on-click-modal="false">
    <div class="print-dialog">
      <div class="tip">
        温馨提示：为减少打印机压力，份数纸张太多请分多次少份打印
        <div class="remaining">剩余打印份数：{{ remainingCopies }}</div>
      </div>
      <span>份数</span><el-input-number v-model="copies" :min="1" :max="remainingCopies" controls-position="right" class="copies-input" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
    <Applicant ref="applicantRef" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";
import Applicant from "@/views/file/printPreview/applicant.vue";
import { fileControllerRePrintQueryCount } from "@/api/modules/filecontroller";

const dialogVisible = ref(false);
const copies = ref(1);
const remainingCopies = ref(5);
const params = ref({});
const applicantRef = ref();
const openDialog = (pa: any) => {
  params.value = pa;
  fileControllerRePrintQueryCount({ fileRePrintId: pa.fileRePrintId }).then((res: any) => {
    remainingCopies.value = res.data;
    copies.value = Math.min(1, res.data); // Default to 2 or remaining if less
  });
  // remainingCopies.value = 1;
  // copies.value = Math.min(2, 2); // Default to 2 or remaining if less
  dialogVisible.value = true;
};

const handleConfirm = async () => {
  if (copies.value <= 0) {
    ElMessage.error("剩余打印份数不能为0");
    return;
  }
  // Here you would call your print API
  let data: any = {
    fileCount: copies.value,
    ...params.value
  };
  applicantRef.value.openDialog({ fileCount: copies.value, fileId: data.fileId, isFinite: 3, rePrint: true, fileRePrintId: data.fileRePrintId });
  dialogVisible.value = false;
};

defineExpose({ openDialog });
</script>

<style scoped>
.print-dialog {
  padding: 10px 20px;
}
.tip {
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: #666666;
}
.remaining {
  margin-top: 8px;
  font-weight: bold;
  color: #f56c6c;
}
.copies-input {
  width: 150px;
  margin-left: 10px;
}
.copies-input :deep(.el-input__inner) {
  text-align: center;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
