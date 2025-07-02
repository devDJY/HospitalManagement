<template>
  <el-dialog v-model="dialogVisible" title="打印份数设置" width="500px" :close-on-click-modal="false">
    <div class="print-copies-dialog">
      <div class="tips">
        <p>温馨提示：为减少打印机压力，份数纸张太多时，请分开多次打印。</p>
        <p>首次或在新环境下使用请使用【逐份打印】。</p>
        <p>使用【不间断打印】请在网络、打印机通畅，打印纸张充足的情况下使用，如遇到问题，请改用【逐份打印】。</p>
      </div>

      <el-divider />

      <div class="copies-input">
        <span class="label">份数</span>
        <el-input-number v-model="copies" :min="1" :max="remainingCopies" controls-position="right" />
        <span class="remaining">剩余打印份数：{{ remainingCopies }}</span>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :disabled="remainingCopies == 0" @click="handleContinuousPrint"> 不间断打印 </el-button>
      <el-button type="success" :disabled="remainingCopies == 0" @click="handleSequentialPrint"> 逐份打印 </el-button>
    </template>
    <Applicant ref="applicantRef" @closeDialog="handleCancel" />
  </el-dialog>
</template>

<script setup lang="ts">
import { fileControllerCertPrintQueryCount, fileControllerCertPrint } from "@/api/modules/fileInfo";
import { ref } from "vue";
import Applicant from "@/views/file/printPreview/applicant.vue";
const dialogVisible = ref(false);
const copies = ref(1);
const remainingCopies = ref(3);
const auditOpinion = ref("");
const applicantRef = ref();
const pa = ref({
  fileId: ""
});

// 打开对话框方法
const openDialog = data => {
  pa.value = { ...data };
  dialogVisible.value = true;
  auditOpinion.value = "";
  fileControllerCertPrintQueryCount({ fileId: pa.value.fileId }).then((res: any) => {
    remainingCopies.value = res.data;
    copies.value = Math.min(1, res.data); // Default to 2 or remaining if less
  });
};

// 不间断打印
const handleContinuousPrint = async () => {
  //dialogVisible.value = false;
  applicantRef.value.openDialog({ fileCount: copies.value, fileId: pa.value.fileId, isFinite: 1 });
};
const handleCancel = () => {
  dialogVisible.value = false;
};
// 逐份打印
const handleSequentialPrint = () => {
  //dialogVisible.value = false;
  applicantRef.value.openDialog({ fileCount: copies.value, fileId: pa.value.fileId, isFinite: 0 });
};

// 暴露方法给父组件调用
defineExpose({
  openDialog
});
</script>

<style scoped>
.print-copies-dialog {
  padding: 0 10px;
}
.tips {
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.5;
  color: #666666;
}
.copies-input {
  display: flex;
  gap: 15px;
  align-items: center;
}
.label {
  min-width: 60px;
  font-size: 16px;
  font-weight: bold;
}
.remaining {
  margin-left: auto;
  font-size: 14px;
  color: #888888;
}
</style>
