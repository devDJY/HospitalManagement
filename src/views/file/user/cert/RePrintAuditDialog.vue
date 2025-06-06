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
      <el-button type="primary" @click="handleContinuousPrint"> 不间断打印 </el-button>
      <el-button type="success" @click="handleSequentialPrint"> 逐份打印 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const dialogVisible = ref(false);
const copies = ref(1);
const remainingCopies = ref(3);
const auditOpinion = ref("");

// 打开对话框方法
const openDialog = () => {
  dialogVisible.value = true;
  auditOpinion.value = "";
};

// 不间断打印
const handleContinuousPrint = () => {
  // 这里可以调用API提交审核意见
  console.log("作废说明:", auditOpinion.value);
  dialogVisible.value = false;
  ElMessage.success("作废提交成功");
};
const handleCancel = () => {
  dialogVisible.value = false;
};
// 逐份打印
const handleSequentialPrint = () => {
  console.log("作废说明:", auditOpinion.value);
  dialogVisible.value = false;
  ElMessage.success("作废提交成功");
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
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.copies-input {
  display: flex;
  align-items: center;
  gap: 15px;
}

.label {
  font-size: 16px;
  font-weight: bold;
  min-width: 60px;
}

.remaining {
  color: #888;
  font-size: 14px;
  margin-left: auto;
}
</style>
