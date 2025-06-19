<template>
  <el-dialog title="审核" v-model="dialogVisible" width="500px" :close-on-click-modal="false">
    <el-form label-width="100px">
      <el-form-item label="审核状态" required>
        <el-select v-model="auditStatus" placeholder="请选择审核状态">
          <el-option label="同意" value="1" />
          <el-option label="拒绝" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="auditOpinion" type="textarea" :rows="4" placeholder="请输入..." clearable />
      </el-form-item>
    </el-form>
    <!-- 历史记录 -->
    <div class="history-section">
      <h4>历史记录</h4>
      <div class="history-list">
        <div v-for="(record, index) in historyRecords" :key="index" class="history-item">
          <div class="history-content">
            <span class="history-date">{{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
            <span class="history-operator">{{ record.nickName }}</span>
            <span class="history-action">{{ record.remark }}</span>
          </div>
        </div>
      </div>
    </div>
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
import { fileInfoGetReuseList, fileInfoReuseGetHistory } from "@/api/modules/fileInfo";
import dayjs from "dayjs";
const dialogVisible = ref(false);
const auditStatus = ref("");
const auditOpinion = ref("");
const historyRecords: any = ref([]);
const rePrintId = ref(""); // 假设你有一个文件ID需要传递给API
const fileRePrintId = ref("");
// 打开对话框方法
const openDialog = data => {
  rePrintId.value = data.rePrintId;
  fileRePrintId.value = data.fileRePrintId;
  auditOpinion.value = "";
  auditStatus.value = "";
  fileInfoReuseGetHistory({ fileId: data.fileId }).then((res: any) => {
    historyRecords.value = res.data;
    dialogVisible.value = true;
  });
};
const emit = defineEmits(["refreshData"]);
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
  emit("refreshData");
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
.history-section {
  padding: 10px;
  margin: 20px 0;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.history-section h4 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #606266;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.history-item {
  padding: 8px;
  background-color: white;
  border-left: 3px solid #409eff;
  border-radius: 4px;
}
.history-date {
  color: #909399;
}
.history-operator {
  font-weight: 500;
  color: #303133;
}
.history-action {
  color: #303133;
}
.history-comment {
  padding-left: 12px;
  margin-top: 4px;
  font-size: 13px;
  color: #606266;
}
</style>
