<template>
  <div class="file-details-container flex">
    <div style="padding-right: 10px; margin-right: 10px">
      <div style="margin-bottom: 10px">
        <el-button @click="goBack" :icon="ArrowLeftBold" type="primary"> 返回</el-button>
      </div>
      <div>
        <el-button v-if="fileData" @click="isPreview = true" :disabled="fileData.attachmentUrl && fileData.attachmentUrl.length < 1" type="success"> 预览文件 </el-button>
      </div>
    </div>
    <div style="width: 87%">
      <el-button type="primary" plain v-if="fileData.canApprove" style="margin-bottom: 20px" @click="openReview"> 审查 </el-button>
      <el-card shadow="hover" class="details-card" v-if="fileControlData" style="margin-bottom: 10px">
        <!-- 文件基本信息 -->
        <el-descriptions title="文件使用概况" :column="3" border> </el-descriptions>
        <div class="stats-grid" v-if="isManager == 1">
          <div class="stat-item" v-for="stat in stats" :key="stat.name">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-name">{{ stat.name }}</div>
          </div>
        </div>
        <el-table v-if="isManager == 0" :data="fileControlData.fileCertDetailList" border style="width: 100%">
          <el-table-column prop="fileControllerCode" label="文件受控编码" width="220" fixed />
          <el-table-column label="打印" width="100">
            <template #default="{ row }">
              <el-checkbox v-model="row.printed" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="使用" width="100">
            <template #default="{ row }">
              <el-checkbox v-model="row.used" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="回收处理" width="100">
            <template #default="{ row }">
              <el-checkbox v-model="row.recycled" :disabled="true" />
              <!-- <el-select v-model="row.recycleType" placeholder="选择回收类型" size="small">
                <el-option label="污渍" value="stained" />
                <el-option label="破损" value="damaged" />
                <el-option label="剩余" value="remaining" />
                <el-option label="销毁" value="destroyed" />
                <el-option label="其他" value="other" />
              </el-select> -->
            </template>
          </el-table-column>
          <el-table-column label="遗失" width="100">
            <template #default="{ row }">
              <el-checkbox v-model="row.lose" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="作废" width="100">
            <template #default="{ row }">
              <el-checkbox v-model="row.cancel" :disabled="true" />
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%; margin-top: 40px">
          <!-- <el-pagination
            style="width: 100px; margin: 0 auto; text-align: center"
            v-if="fileControlData.attachmentUrl && fileControlData.attachmentUrl.length > 1 && isPreview"
            :current-page="currentPage"
            :page-size="1"
            :total="fileControlData.attachmentUrl.length"
            layout="prev, pager, next"
            :pager-count="5"
            @current-change="handleCurrentChange"
          /> -->
          <!-- <iframe
            v-if="isPreview && isManager == 0"
            style="min-height: 800px; margin-top: 10px"
            :src="fileControlData.attachmentUrl[currentPage - 1]"
            width="100%"
            frameborder="0"
          ></iframe> -->
        </div>
      </el-card>
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
            style="width: 100px; margin: 0 auto; text-align: center"
            v-if="fileData.attachmentUrl && fileData.attachmentUrl.length > 1 && isPreview"
            :current-page="currentPage"
            :page-size="1"
            :total="fileData.attachmentUrl.length"
            layout="prev, pager, next"
            :pager-count="5"
            @current-change="handleCurrentChange"
          />
          <div class="pdf-container" v-if="isPreview">
            <VuePdfEmbed annotation-layer text-layer :source="fileData.attachmentUrl[currentPage - 1]" />
          </div>
        </div>
      </el-card>
      <FileReviewDialog ref="fileReviewDialog" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import VuePdfEmbed from "vue-pdf-embed";
// optional styles
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";
import { fileInfoReviewControlAttachmentManager, fileInfoReviewControlAttachment, fileInfoReviewOriginalAttachment, fileInfoReviewGetFileInfo } from "@/api/modules/fileInfo";
import FileReviewDialog from "../manager/review/FileReviewDialog.vue";
const fileData = ref();
const fileControlData = ref();
const type = ref();
const isManager = ref();
const fileId = ref();
const isPreview = ref(false);
const fileReviewDialog = ref();
// 统计数据
const stats = ref([
  { name: "受控份数", value: 3 },
  { name: "作废份数", value: 0 },
  { name: "打印份数", value: 2 },
  { name: "使用份数", value: 0 },
  { name: "回收份数", value: 0 },
  { name: "销毁份数", value: 0 },
  { name: "遗失份数", value: 0 }
]);
// 分页
// 脚本部分保持不变
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(40);

const handleCurrentChange = val => {
  currentPage.value = val;
};
const openReview = () => {
  fileInfoReviewGetFileInfo({ fileId: fileId.value }).then(res => {
    let applyLogs = res.data.applyLogs[0];
    console.log(applyLogs);
    let data = {
      ...applyLogs,
      ...res.data
    };
    fileReviewDialog.value?.open(data);
  });
};
onMounted(() => {
  const route = useRoute();
  isManager.value = route.query.isManager;
  fileId.value = route.query.fileId;
  // fileId.value = 26;
  type.value = route.query.type;

  if (type.value == 2) {
    if (isManager.value == 1) {
      // 是管理
      fileInfoReviewControlAttachmentManager({ fileId: fileId.value }).then(res => {
        fileControlData.value = res.data;
        stats.value[0].value = res.data.controlCount;
        stats.value[1].value = res.data.cancelCount;
        stats.value[2].value = res.data.printCount;
        stats.value[3].value = res.data.usedCount;
        stats.value[4].value = res.data.recycleCount;
        stats.value[5].value = res.data.destroyCount;
        stats.value[6].value = res.data.loseCount;
        fileData.value = res.data;
      });
    } else {
      fileInfoReviewControlAttachment({ fileId: fileId.value }).then(res => {
        fileData.value = res.data;
        fileControlData.value = res.data;
      });
    }
  } else {
    // if (isManager.value == 1) {
    //   fileInfoReviewOriginalAttachment({ fileId: fileId.value }).then(res => {
    //     fileData.value = res.data;
    //   });
    // } else {
    //   fileInfoReviewControlAttachment({ fileId: fileId.value }).then(res => {
    //     fileData.value = res.data;
    //   });
    // }
    if (isManager.value == 1) {
      fileInfoReviewOriginalAttachment({ fileId: fileId.value, isManager: true }).then(res => {
        fileData.value = res.data;
      });
    } else {
      fileInfoReviewOriginalAttachment({ fileId: fileId.value }).then(res => {
        fileData.value = res.data;
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
/* 隐藏所有工具栏 */
.file-details-container {
  padding: 10px;
  margin: 0 auto;
}
.pdf-container {
  padding: 10px;
  padding-right: 15px;
  background: #333333;
}
.flex {
  display: flex;
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
  margin: 0;
  font-size: 24px;
  color: #333333;
}
.mt-10 {
  margin-top: 10px;
}
.mt-20 {
  margin-top: 20px;
}
.page-info {
  padding: 10px 0;
  font-size: 16px;
  color: #666666;
  text-align: center;
}
.apply-note {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.note-title {
  margin-top: 0;
  font-size: 16px;
  color: #333333;
}
.note-content {
  margin-bottom: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666666;
}

/* 调整Element组件样式 */
:deep(.el-descriptions__title) {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}
:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: normal;
  color: #666666;
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
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}
.stat-item {
  padding: 16px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 6px;
  transition: all 0.3s;
}
.stat-item:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  transform: translateY(-3px);
}
.stat-value {
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}
.stat-name {
  font-size: 14px;
  color: #606266;
}

/* 响应式调整 */
@media (width <= 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width <= 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
