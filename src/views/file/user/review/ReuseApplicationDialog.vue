<template>
  <el-dialog title="申请复用" v-model="dialogVisible" width="700px" :close-on-click-modal="false">
    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <!-- 项目信息展示 -->
      <el-descriptions :column="1" border>
        <el-descriptions-item label="项目名称">
          {{ form.projectName }}
        </el-descriptions-item>
        <el-descriptions-item label="文件编码">
          {{ form.fileCode }}
        </el-descriptions-item>
        <el-descriptions-item label="文件名">
          {{ form.attachmentName }}
        </el-descriptions-item>
        <el-descriptions-item label="页数">
          {{ form.pageCount }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 历史申请记录 -->
      <div class="history-section">
        <h4>申请记录</h4>
        <el-table :data="form.historyRecords" border style="width: 100%">
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

      <!-- 申请表单 -->
      <el-form-item label="份数" prop="fileCount" required>
        <el-input-number v-model="form.fileCount" :min="1" controls-position="right" placeholder="请输入..." />
      </el-form-item>

      <el-form-item label="审核人" prop="reviewer" required>
        <el-select v-model="form.reviewer" placeholder="请选择..." filterable style="width: 100%">
          <el-option v-for="item in reviewerOptions" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>

      <el-form-item label="申请说明" prop="applyReason" required>
        <el-input
          v-model="form.applyReason"
          type="textarea"
          :rows="3"
          placeholder="请描述份数申请说明。例：每位受试者每次访视需使用两份受控文件，预计三个月内将进行5次访视，特申请10份受控文件。"
          show-word-limit
          maxlength="200"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { projectQueryManager } from "@/api/modules/project";
import { fileInfoGetReuseList, fileInfoAddByReuse, fileInfoReviewEditReuse } from "@/api/modules/fileInfo";

// 挂载前初始化（如设置表单默认值）
onBeforeMount(() => {
  init();
});
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();

const form = reactive<any>({ reviewer: "" });

const reviewerOptions = reactive([{ userId: "reviewer1", nickName: "审核人1" }]);
const init = async () => {
  // 获取用户列表
  const { data } = await projectQueryManager({});
  reviewerOptions.splice(
    0,
    reviewerOptions.length,
    ...(data as { userId: number; nickName: string }[]).map(item => ({
      userId: String(item.userId),
      nickName: item.nickName
    }))
  );
  // 获取项目列表
};
const rules = reactive<FormRules>({
  quantity: [
    { required: true, message: "请输入份数", trigger: "blur" },
    { type: "number", min: 1, message: "份数必须大于0", trigger: "blur" }
  ],
  reviewer: [{ required: true, message: "请选择审核人", trigger: "change" }],
  applyReason: [{ required: true, message: "请输入申请说明", trigger: "blur" }]
});

// 打开弹窗方法
const openDialog = (initialData?) => {
  form.value = {
    fileCount: 0,
    applyReason: ""
  };
  fileInfoGetReuseList({ fileId: initialData.fileId }).then((res: any) => {
    if (initialData) {
      initialData.historyRecords = res.data;
      initialData.applyReason = "";
      Object.assign(form, initialData);
    }
    dialogVisible.value = true;
  });
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
  return statusMap[status] || "未知状态";
};
// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    // 这里可以调用API提交表单
    let data = {
      applyReason: form.applyReason,
      fileCount: form.fileCount,
      fileId: form.fileId,
      reviewerId: form.reviewerId,
      applyReuseStatus: 1
    };
    await fileInfoReviewEditReuse(data);
    dialogVisible.value = false;
    ElMessage.success("申请提交成功");
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 暴露方法给父组件
defineExpose({
  openDialog
});
</script>

<style scoped>
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
:deep(.el-descriptions__body) {
  background-color: #f5f7fa;
}
:deep(.el-descriptions__label) {
  width: 100px;
  font-weight: bold;
  color: #606266;
}
:deep(.el-descriptions__content) {
  color: #303133;
}
</style>
