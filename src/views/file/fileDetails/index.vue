<template>
  <div class="file-details-container flex">
    <div style="margin-right: 10px; padding-right: 10px">
      <div style="margin-bottom: 10px">
        <el-button @click="goBack" :icon="ArrowLeftBold" type="primary"> 返回 </el-button>
      </div>
      <div>
        <el-button @click="isPreview = true" type="success"> 预览文件 </el-button>
      </div>
    </div>
    <el-card shadow="hover" class="details-card" v-if="fileData">
      <!-- 文件基本信息 -->
      <el-descriptions title="文件详情" :column="3" border>
        <el-descriptions-item label="项目名称" span="12">
          {{ fileData.projectName }}
        </el-descriptions-item>
        <el-descriptions-item label="文件编号" span="12">
          {{ fileData.fileCode }}
        </el-descriptions-item>
        <el-descriptions-item label="申请份数" span="12">
          {{ fileData.fileCount }}
        </el-descriptions-item>
        <el-descriptions-item label="页数">
          {{ fileData.pageTotal }}
        </el-descriptions-item>
        <el-descriptions-item label="版本号">
          {{ fileData.fileVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="版本日期">
          {{ fileData.versionTime }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人">
          {{ fileData.applyUserName }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ fileData.applyUserMobile }}
        </el-descriptions-item>
        <el-descriptions-item label="申请日期">
          {{ fileData.applyTime }}
        </el-descriptions-item>
        <el-descriptions-item label="审查人">
          {{ fileData.reviewUserName }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ fileData.reviewUserMobile }}
        </el-descriptions-item>
        <el-descriptions-item label="审查日期">
          {{ fileData.reviewTime }}
        </el-descriptions-item>
        <el-descriptions-item label="受控发放人">
          {{ fileData.reviewControllerName }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ fileData.reviewControllerMobile }}
        </el-descriptions-item>
        <el-descriptions-item label="受控发放日期">
          {{ fileData.reviewControlTime }}
        </el-descriptions-item>
        <el-descriptions-item label="申请说明" span="12">
          {{ fileData.applyReason }}
        </el-descriptions-item>
      </el-descriptions>
      <div style="width: 100%; margin-top: 40px">
        <el-pagination
          style="margin: 0 auto; width: 100px; text-align: center"
          :hide-on-single-page="value"
          v-if="fileData.attachmentUrl.length > 1 && isPreview"
          :current-page="currentPage"
          :page-size="1"
          :total="fileData.attachmentUrl.length"
          layout="prev, pager, next"
          :pager-count="1"
          @current-change="handleCurrentChange"
        />
        <iframe v-if="isPreview" style="margin-top: 10px; min-height: 800px" :src="fileData.attachmentUrl[currentPage - 1]" width="100%" frameborder="0"></iframe>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { fileInfoReviewControlAttachmentManager, fileInfoReviewControlAttachment, fileInfoReviewOriginalAttachment } from "@/api/modules/fileInfo";
const fileData = ref();
const type = ref();
const isManager = ref();
const fileId = ref();
const isPreview = ref(false);
// 分页
// 脚本部分保持不变
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(40);

const handleCurrentChange = val => {
  currentPage.value = val;
  // 获取新数据逻辑
  console.log(currentPage);
};
onMounted(() => {
  const route = useRoute();
  isManager.value = route.query.isManager;
  fileId.value = route.query.fileId;
  type.value = route.query.type;
  console.log(type.value);
  if (type.value == 1) {
    fileInfoReviewOriginalAttachment({ fileId: fileId.value }).then(res => {
      fileData.value = res.data;
    });
  } else {
    if (isManager.value == 1) {
      // 是管理
      fileInfoReviewControlAttachmentManager({ fileId: fileId.value }).then(res => {
        fileData;
      });
    } else {
      fileInfoReviewControlAttachment({ fileId: fileId.value }).then(res => {
        console.log(res);
      });
    }
  }
});

// 文件数据
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
  width: 100%;
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
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 自定义样式 */
:deep(.custom-pagination-prev),
:deep(.custom-pagination-next) {
  padding: 0 12px;
}

:deep(.custom-pagination-info) {
  padding: 0 16px;
  color: #606266;
}

/* 禁用状态的样式 */
:deep(.el-pagination button.is-disabled) {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
