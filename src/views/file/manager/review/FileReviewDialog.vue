<template>
  <el-dialog title="审查文件" v-model="visible" width="80%" :close-on-click-modal="false">
    <div class="file-review-dialog">
      <!-- 申请记录部分 -->
      <div class="section">
        <h3>申请记录</h3>
        <el-table :data="reviewData.historyRecords" border style="width: 100%">
          <el-table-column prop="fileCount" label="份数" />
          <el-table-column prop="applyReason" label="申请说明" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="fileStatus" label="申请结果">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.fileStatus)" :key="row.fileStatus">
                {{ getStatusText(row.fileStatus) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-divider />

      <!-- 受控方式部分 -->
      <div class="section">
        <h3 class="required">受控方式</h3>
        <el-radio-group v-model="reviewData.checkType">
          <el-radio label="线上受控" :value="0" />
          <el-radio label="线下受控" :value="1" />
        </el-radio-group>
        <p class="hint">（文件中请者选择的[受控方式]为"{{ reviewData.checkType == 0 ? "线上受控" : "线下受控" }}"）</p>
      </div>

      <el-divider />

      <!-- 审查状态部分 -->
      <div class="section">
        <h3 class="required">审查状态</h3>
        <el-radio-group v-model="reviewData.fileStatus">
          <el-radio label="通过" :value="1" />
          <el-radio label="驳回" :value="2" />
          <el-radio label="拒绝" :value="4" />
        </el-radio-group>
      </div>

      <el-divider />

      <!-- 审查意见部分 -->
      <div class="section">
        <h3>审查意见</h3>
        <el-input v-model="reviewData.reviewRemark" type="textarea" :rows="4" placeholder="请输入审查意见..." />
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { fileInfoGetReuseList, fileInfoReview } from "@/api/modules/fileInfo";
import dayjs from "dayjs";

const visible = ref(false);
const filteredMembers = ref([]);
// 首先定义历史记录的类型接口
interface HistoryRecord {
  applyReason: string;
  applyTime: string;
  fileCount: number;
  fileStatus: string;
}
// 默认审查数据
const reviewData = reactive({
  historyRecords: [] as HistoryRecord[],
  fileStatus: 1,
  checkType: 0,
  reviewRemark: ""
});
const fileId = ref("");
// 打开弹窗的方法
const open = (data?: any) => {
  fileId.value = data.fileId;
  reviewData.historyRecords = [] as HistoryRecord[];
  reviewData.fileStatus = 1;
  reviewData.checkType = data.checkType;
  reviewData.reviewRemark = "";
  const infoMap = {
    "待审查": 0,
    "通过": 1,
    "驳回": 2,
    "撤回": 3,
    "拒绝": 4
  }
  let obj: HistoryRecord = {
    applyReason: data.applyReason,
    applyTime: dayjs(data.applyTime).format("YYYY-MM-DD HH:mm:ss"),
    fileCount: data.fileCount,
    fileStatus: infoMap[data.applyResult]
  };
  reviewData.historyRecords.push(obj);
  visible.value = true;
};
// 状态值与标签类型映射
const getTagType = (status: number) => {
  switch (status) {
    case 0:
      return "info"; // 待审查-蓝色
    case 1:
      return "success"; // 通过-绿色
    case 2:
      return "danger"; // 驳回-红色
    case 3:
      return "warning"; // 撤回-黄色
    case 4:
      return "danger"; // 拒绝-红色
    default:
      return "info";
  }
};

// 状态值与显示文本映射
const getStatusText = (status: number) => {
  const statusMap = {
    0: "待审查",
    1: "通过",
    2: "驳回",
    3: "撤回",
    4: "拒绝"
  };
  return statusMap[status] || "待审查";
};
// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case "通过":
      return "success";
    case "拒绝":
      return "danger";
    case "退回修改":
      return "warning";
    case "待审查":
      return "info";
    default:
      return "";
  }
};
const emit = defineEmits(["refreshData"]);
// 提交审查结果
const handleSubmit = async () => {
  if (!reviewData.fileStatus) {
    ElMessage.warning("请选择审查状态");
    return;
  }
  let data = {
    fileId: fileId.value,
    fileStatus: reviewData.fileStatus,
    checkType: reviewData.checkType,
    reviewRemark: reviewData.reviewRemark
  };
  await fileInfoReview(data);
  ElMessage.success("审查结果提交成功");
  emit("refreshData");
  visible.value = false;
  // 这里可以调用API提交审查结果
  // submitReview(reviewData)
};

// 暴露open方法给父组件
defineExpose({
  open
});
</script>

<style scoped>
.file-review-dialog {
  padding: 0 10px;
}
.section {
  margin-bottom: 20px;
}
h3 {
  margin: 0 0 15px;
  font-size: 16px;
}
.required::before {
  margin-right: 4px;
  color: var(--el-color-danger);
  content: "*";
}
.hint {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.el-divider {
  margin: 15px 0;
}
</style>
