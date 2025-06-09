<template>
  <div class="file-details-container flex">
    <div style="margin-right: 10px; padding-right: 10px">
      <div style="margin-bottom: 10px">
        <el-button @click="goBack" :icon="ArrowLeftBold" type="primary"> 返回 </el-button>
      </div>
      <div>
        <el-button @click="goBack" type="success"> 预览文件 </el-button>
      </div>
    </div>
    <el-card shadow="hover" class="details-card">
      <!-- 文件基本信息 -->
      <el-descriptions title="文件详情" :column="3" border>
        <el-descriptions-item label="项目名称" span="12">
          {{ fileData.projectName }}
        </el-descriptions-item>
        <el-descriptions-item label="文件编号" span="12">
          {{ fileData.fileNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="申请份数" span="12">
          {{ fileData.applyTime }}
        </el-descriptions-item>
        <el-descriptions-item label="页数">
          {{ fileData.type }}
        </el-descriptions-item>
        <el-descriptions-item label="版本号">
          {{ fileData.version }}
        </el-descriptions-item>
        <el-descriptions-item label="版本日期">
          {{ fileData.versionDate }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人">
          {{ fileData.applicant1 }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ fileData.phone1 }}
        </el-descriptions-item>
        <el-descriptions-item label="申请日期">
          {{ fileData.applyDate }}
        </el-descriptions-item>
        <el-descriptions-item label="审查人">
          {{ fileData.applicant1 }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ fileData.phone1 }}
        </el-descriptions-item>
        <el-descriptions-item label="审查日期">
          {{ fileData.applyDate }}
        </el-descriptions-item>
        <el-descriptions-item label="受控发放人">
          {{ fileData.applicant1 }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ fileData.phone1 }}
        </el-descriptions-item>
        <el-descriptions-item label="受控发放日期">
          {{ fileData.applyDate }}
        </el-descriptions-item>
        <el-descriptions-item label="申请说明" span="12">
          {{ fileData.applyTime }}
        </el-descriptions-item>
      </el-descriptions>
      <iframe style="margin-top: 10px" src="https://www.baidu.com/" width="100%" frameborder="0"></iframe>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ArrowLeftBold } from "@element-plus/icons-vue";

// 文件数据
const fileData = ref({
  projectName: "重塑全人源防PC360单宽墙抗扰增强（SAL003）在肝功能不全患者可匹配的健康受试者的多中心、前端机、开放、平行对面的现代动力学研究",
  fileNumber: "2024-YW-006-XYCL-L-V11",
  applyTime: "3",
  type: "7",
  version: "V11",
  versionDate: "2024-04-03",
  currentPage: "1/7页",
  applicant1: "杨晶芬",
  phone1: "18792529619",
  applyDate: "2024-07-08 12:20",
  applicant2: "杨浩瀚",
  phone2: "13388124751",
  reviewDate: "2024-07-08 15:17",
  issuer: "杨浩瀚",
  phone3: "13388124751",
  issueDate: "2024-07-08 15:20",
  applyNote: "补充协议提交的受试者，每位受试者将通过活动在线查阅报告一份，获取申请部分。"
});
const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
.file-details-container {
  padding: 10px;
  margin: 0 auto;
}
.flex {
  display: flex;
}
.left {
}
.details-card {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.page-info {
  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 10px 0;
}

.apply-note {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.note-title {
  font-size: 16px;
  color: #333;
  margin-top: 0;
}

.note-content {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
}

/* 调整Element组件样式 */
:deep(.el-descriptions__title) {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: normal;
  color: #666;
}
</style>
