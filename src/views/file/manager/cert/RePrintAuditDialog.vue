<template>
  <el-dialog title="作废" v-model="dialogVisible" width="500px" :close-on-click-modal="false">
    <el-form label-width="100px">
      <el-form-item label="作废文件">
        <el-input v-model="auditStatus" disabled type="textarea" :rows="4" placeholder="请输入..." clearable />
      </el-form-item>

      <el-form-item label="作废说明" required>
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
import { ElMessage } from "element-plus";
import { fileControllerCertCancel } from "@/api/modules/filecontroller";
import { fileControllerCancelGetAvailable } from "@/api/modules/fileInfo";
const dialogVisible = ref(false);
const auditStatus = ref("");
const auditOpinion = ref("");
const fileControllerIds = ref([]);
const fileId = ref(""); // 假设你有一个文件ID需要传递给API
// 打开对话框方法
const openDialog = data => {
  getAvailable(data.fileId);
  fileControllerIds.value = data.fileControllerIds;
  fileId.value = data.fileId;
  dialogVisible.value = true;
  auditOpinion.value = "";
  auditStatus.value = "";
};

// 获取可作废文件
const getAvailable = async (fileId: number) => {
  const res = (await fileControllerCancelGetAvailable({ fileId })) as any;
  fileControllerIds.value = res.data.map((item: any) => item.fileControllerId);
  auditStatus.value = res.data.map((item: any) => item.fileControllerCode).join("、");
};
const emit = defineEmits(["refreshData"]);
// 确认提交
const handleConfirm = async () => {
  if (!auditOpinion.value.trim()) {
    ElMessage.warning("请输入作废说明");
    return;
  }
  // 这里可以调用API提交审核意见
  await fileControllerCertCancel({
    fileId: fileId.value,
    remark: auditOpinion.value,
    fileCertIds: fileControllerIds.value
  });
  console.log("作废说明:", auditOpinion.value);
  dialogVisible.value = false;
  emit("refreshData");
  ElMessage.success("作废提交成功");
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
