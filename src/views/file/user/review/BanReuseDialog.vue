<template>
  <el-dialog :title="type == 0 ? '申请禁止' : '申请解除禁止'" v-model="dialogVisible" width="600px" :close-on-click-modal="false">
    <div class="confirm-message">
      <el-icon :size="20" color="#F56C6C" class="icon">
        <WarningFilled />
      </el-icon>
      <span> 是否确定{{ type == 0 ? "申请禁止" : "申请解除禁止" }}该文件的复用？ </span>
    </div>

    <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
      <el-form-item label="备注" prop="remark" required>
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入..." show-word-limit maxlength="200" />
      </el-form-item>
    </el-form>

    <!-- 历史记录 -->
    <div class="history-section">
      <h4>历史记录</h4>
      <div class="history-list">
        <div v-for="(record, index) in historyRecords" :key="index" class="history-item">
          <p class="history-time">{{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}，{{ record.nickName }} {{ record.operationName }}</p>
          <p class="history-remark">{{ record.remark }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { WarningFilled } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { fileInfoReuseGetHistory, fileInfoApplyEditReuse } from "@/api/modules/fileInfo";
import dayjs from "dayjs";

interface HistoryRecord {
  date: string;
  operator: string;
  action: string;
  comment?: string;
}

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const submitting = ref(false);

const form = reactive<any>({
  remark: ""
});

const historyRecords = ref();

const rules = reactive<FormRules>({
  remark: [
    { required: true, message: "请输入备注", trigger: "blur" },
    { min: 5, message: "备注不能少于5个字符", trigger: "blur" }
  ]
});
const type = ref(0);
// 打开弹窗方法
const openDialog = (initialData, dialogType) => {
  type.value = Number(dialogType);
  fileInfoReuseGetHistory({ fileId: initialData.fileId }).then((res: any) => {
    historyRecords.value = res.data;
    if (initialData) {
      Object.assign(form, initialData);
    }
    dialogVisible.value = true;
  });
};
const emit = defineEmits(["success"]);
// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    // 这里可以调用API提交表单
    let data = {
      fileId: form.fileId,
      isManager: false,
      remark: form.remark,
      reuseStatus: type.value
    };
    await fileInfoApplyEditReuse(data);
    formRef.value?.resetFields();
    emit("success", data); // 抛出成功事件
    dialogVisible.value = false;
    ElMessage.success("操作成功");
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    submitting.value = false;
  }
};

// 暴露方法给父组件
defineExpose({
  openDialog
});
</script>

<style scoped>
.confirm-message {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;
  color: #f56c6c;
  background-color: #fef0f0;
  border-radius: 4px;
}
.confirm-message .icon {
  margin-right: 10px;
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
.history-time {
  margin: 0 0 5px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
.history-remark {
  padding-left: 20px;
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
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
