<template>
  <el-dialog title="审查文件" v-model="visible" width="700px" :close-on-click-modal="false">
    <div class="file-review-dialog">
      <!-- 申请记录部分 -->
      <div class="section">
        <h3>申请记录</h3>
        <el-table :data="filteredMembers" border style="width: 100%">
          <el-table-column prop="account" label="份数" width="180" />
          <el-table-column prop="realName" label="申请说明" width="180" />
          <el-table-column prop="status" label="申请日期"></el-table-column>
          <el-table-column prop="申请结果" label="申请结果"></el-table-column>
        </el-table>
      </div>

      <el-divider />

      <!-- 受控方式部分 -->
      <div class="section">
        <h3 class="required">受控方式</h3>
        <el-radio-group v-model="reviewData.controlMethod">
          <el-radio label="线上受控" :value="'线上受控'" />
          <el-radio label="线下受控" :value="'线下受控'" />
        </el-radio-group>
        <p class="hint">（文件中请者选择的[受控方式]为"{{ reviewData.controlMethod }}"）</p>
      </div>

      <el-divider />

      <!-- 审查状态部分 -->
      <div class="section">
        <h3 class="required">审查状态</h3>
        <el-radio-group v-model="reviewData.reviewStatus">
          <el-radio label="通过" />
          <el-radio label="拒绝" />
          <el-radio label="退回修改" />
        </el-radio-group>
      </div>

      <el-divider />

      <!-- 审查意见部分 -->
      <div class="section">
        <h3>审查意见</h3>
        <el-input v-model="reviewData.reviewComment" type="textarea" :rows="4" placeholder="请输入审查意见..." />
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

interface ReviewData {
  quantity: number;
  description: string;
  applyDate: string;
  status: string;
  controlMethod: string;
  reviewStatus: string;
  reviewComment: string;
}

const visible = ref(false);
const filteredMembers = ref([]);

// 默认审查数据
const reviewData = reactive<ReviewData>({
  quantity: 14,
  description: "记录体温高于39度导致的脱水状况",
  applyDate: "2025-06-03 12:11",
  status: "待审查",
  controlMethod: "线下受控",
  reviewStatus: "通过",
  reviewComment: ""
});

// 打开弹窗的方法
const open = (data?: Partial<ReviewData>) => {
  if (data) {
    Object.assign(reviewData, data);
  }
  visible.value = true;
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

// 提交审查结果
const handleSubmit = () => {
  if (!reviewData.reviewStatus) {
    ElMessage.warning("请选择审查状态");
    return;
  }

  ElMessage.success("审查结果提交成功");
  console.log("提交的审查数据:", reviewData);
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
