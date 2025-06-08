<template>
  <el-dialog title="重新打印审核" v-model="dialogVisible" width="500px" :close-on-click-modal="false">
    <el-form label-width="100px">
      <el-form-item label="审核状态" required>
        <el-select v-model="auditStatus" placeholder="请选择审核状态">
          <el-option label="驳回" value="1" />
          <el-option label="通过" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="审核意见">
        <el-input v-model="auditOpinion" type="textarea" :rows="4" placeholder="请输入..." clearable />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fileControllerRePrintReview } from "@/api/modules/filecontroller";
const dialogVisible = ref(false);
const auditStatus = ref("");
const auditOpinion = ref("");
const rePrintId = ref(""); // 假设你有一个文件ID需要传递给API
const fileRePrintId = ref('');
// 打开对话框方法
const openDialog = data => {
  rePrintId.value = data.rePrintId;
  fileRePrintId.value = data.fileRePrintId;
  dialogVisible.value = true;
  auditOpinion.value = "";
};

// 确认提交
const handleConfirm = async () => {
  if (!auditOpinion.value.trim()) {
    ElMessage.warning("请输入审核意见");
    return;
  }
  let obj = {
    rePrintId: rePrintId.value,
    remark: auditOpinion.value,
    reviewStatus: auditStatus.value,
    fileRePrintId: fileRePrintId.value
  };
  await fileControllerRePrintReview(obj);
  dialogVisible.value = false;
  ElMessage.success("审核提交成功");
};

// 暴露方法给父组件调用
defineExpose({
  openDialog
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.el-tag {
  margin-left: 10px;
}
.el-textarea {
  width: 100%;
}
</style>
