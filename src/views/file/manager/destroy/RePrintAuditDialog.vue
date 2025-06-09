<template>
  <el-dialog title="文件销毁" v-model="dialogVisible" width="500px" :close-on-click-modal="false">
    <el-form label-width="100px">
      <el-form-item label="销毁方式" required>
        <el-select v-model="auditStatus" placeholder="请选择销毁方式">
          <el-option label="粉碎机粉碎" value="1" />
          <el-option label="剪烂" value="2" />
          <el-option label="其他" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
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
import { fileControllerDestroyReview } from "@/api/modules/filecontroller";
const dialogVisible = ref(false);
const auditStatus = ref("");
const auditOpinion = ref("");
const fileControllerId = ref(); // 假设你有一个文件ID需要传递给API
// 打开对话框方法
const openDialog = data => {
  fileControllerId.value = data.fileControllerId;
  dialogVisible.value = true;
  auditOpinion.value = "";
};

// 确认提交
const handleConfirm = async () => {
  if (!auditOpinion.value.trim()) {
    ElMessage.warning("请输入审核意见");
    return;
  }
  const statusMap = {
    "1": "粉碎机粉碎",
    "2": "剪烂",
    "3": "其他"
  }
  let obj = {
    fileControllerId: fileControllerId.value,
    remark: auditOpinion.value,
    reviewStatus: statusMap[auditStatus.value]
  };
  await fileControllerDestroyReview(obj);
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
