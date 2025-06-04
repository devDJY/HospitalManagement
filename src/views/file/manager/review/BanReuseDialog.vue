<template>
  <el-dialog :title="title" v-model="visible" width="500px" :close-on-click-modal="false">
    <div class="ban-reuse-dialog">
      <p class="confirm-text">● {{ title == "禁止复用" ? "是否确定禁止该文件的申请复用？" : "是否确定解除禁止该文件的申请复用？" }}</p>

      <el-form>
        <el-form-item label="备注" label-width="60px">
          <el-input v-model="banData.remark" type="textarea" :rows="3" placeholder="请输入..." />
        </el-form-item>
      </el-form>

      <div class="history-section">
        <p class="history-title">历史记录</p>
        <div class="history-list">
          <div v-for="(record, index) in banData.history" :key="index" class="history-item">
            <p class="history-time">{{ record.createTime }}，{{ record.nickName }} {{ record.operationName }}</p>
            <p class="history-remark">{{ record.remark }}</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { fileInfoApplyEditReuse, fileInfoReuseGetHistory } from "@/api/modules/fileInfo";

interface BanRecord {
  operationName: string;
  createTime: string;
  nickName: string;
  remark: string;
}

interface BanData {
  remark: string;
  history: BanRecord[];
}

const visible = ref(false);
const fileId = ref();
const title = ref("禁止复用");
const banData = reactive<BanData>({
  remark: "",
  history: []
});
const isMultiplexed = ref(0);
// 打开弹窗的方法
const open = (data, t) => {
  isMultiplexed.value = t;
  if (isMultiplexed.value == 1) {
    title.value = "禁止复用";
  } else {
    title.value = "解除禁止复用";
  }
  fileId.value = data;
  fileInfoReuseGetHistory({ fileId: data }).then((res: any) => {
    if (res.data) {
      banData.history = res.data;
      visible.value = true;
    }
  });
};
// 定义可触发的事件（新增）
const emit = defineEmits(["refresh"]);
// 确认禁止复用
const handleConfirm = async () => {
  if (!banData.remark.trim()) {
    ElMessage.warning("请填写备注信息");
    return;
  }
  let obj = {
    fileId: fileId.value,
    isManager: true,
    remark: "string",
    reuseStatus: isMultiplexed.value === 1 ? 0 : 1,
    userId: 0
  };
  try {
    // 这里调用API禁止复用
    await fileInfoApplyEditReuse(obj);
    ElMessage.success("操作成功");
    emit("refresh");
    visible.value = false;
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 暴露open方法给父组件
defineExpose({
  open
});
</script>

<style scoped>
.ban-reuse-dialog {
  padding: 0 10px;
}
.confirm-text {
  margin: 0 0 20px;
  font-size: 15px;
  color: var(--el-color-danger);
}
.history-section {
  padding-top: 15px;
  margin-top: 20px;
  border-top: 1px solid var(--el-border-color);
}
.history-title {
  margin: 0 0 10px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}
.history-item {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px dashed var(--el-border-color);
}
.history-item:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
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
</style>
