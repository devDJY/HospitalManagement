<template>
  <el-dialog v-model="dialogVisible" title="打印确认" width="100%" :close-on-click-modal="false">
    <div class="print-confirm-container">
      <!-- 警示信息 -->
      <div class="print-warning">
        <el-alert :title="title" type="warning" :closable="false" show-icon />
      </div>

      <!-- 打印设置 -->
      <div class="print-settings">
        <h4>打印设置：</h4>
        <!-- 打印设置 - 横向排列 -->
        <div class="print-settings-horizontal">
          <el-form :inline="true" label-width="80px" size="small" class="demo-form-inline">
            <el-form-item label="打印方式">
              <el-select v-model="printSettings.side" style="width: 140px">
                <el-option label="单面" value="single" />
                <el-option label="双面-长边" value="double_long" />
                <el-option label="双面-短边" value="double_short" />
              </el-select>
            </el-form-item>

            <el-form-item label="纸张大小">
              <el-select v-model="printSettings.paperSize" style="width: 100px">
                <el-option label="A4" value="A4" />
                <el-option label="A5" value="A5" />
                <el-option label="B5" value="B5" />
              </el-select>
            </el-form-item>

            <el-form-item label="方向">
              <el-select v-model="printSettings.orientation" style="width: 100px">
                <el-option label="纵向" value="portrait" />
                <el-option label="横向" value="landscape" />
              </el-select>
            </el-form-item>

            <el-form-item label="缩放">
              <el-select v-model="printSettings.scale" style="width: 180px">
                <el-option label="默认不缩放" value="default" />
                <el-option label="匹配纸张" value="fit" />
              </el-select>
            </el-form-item>

            <el-form-item label="颜色">
              <el-select v-model="printSettings.color" style="width: 100px">
                <el-option label="黑白" value="grayscale" />
                <el-option label="彩色" value="color" />
              </el-select>
            </el-form-item>

            <el-form-item label="打印机">
              <el-select v-model="selectedPrinter" placeholder="选择打印机" style="width: 180px" filterable>
                <el-option v-for="printer in printerList" :key="printer" :label="printer" :value="printer" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 二次确认 -->
      <div class="final-warning mt-20">
        <el-alert title="请先进行打印测试，正式打印仅可打印一次！" type="error" :closable="false" show-icon />
      </div>
      <div style="width: 100%; margin-top: 40px">
        <el-pagination
          style="margin: 0 auto; width: 100px; text-align: center"
          :hide-on-single-page="value"
          v-if="printSettings.attachmentUrl.length > 1 && isPreview"
          :current-page="currentPage"
          :page-size="1"
          :total="printSettings.attachmentUrl.length"
          layout="prev, pager, next"
          :pager-count="1"
          @current-change="handleCurrentChange"
        />
        <iframe v-if="isPreview" style="margin-top: 10px; min-height: 800px" :src="printSettings.attachmentUrl[currentPage - 1]" width="100%" frameborder="0"></iframe>
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取消打印</el-button>
      <el-button type="primary" @click="handlePrintTest">打印测试</el-button>
      <el-button type="primary" @click="handleConfirmPrint">确认打印</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";

const dialogVisible = ref(false);
const selectedPrinter = ref("");
const copies = ref(1);
const isPreview = ref(false); // 实际使用时应该从props传入
// 脚本部分保持不变
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(40);
const title = ref("");
const printSettings = ref({
  side: "single", // 单面/双面
  paperSize: "A4", // 纸张大小
  orientation: "portrait", // 打印方向
  scale: "default", // 缩放设置
  color: "grayscale", // 打印颜色
  attachmentUrl: []
});
const params = ref({ fileCount: copies.value, fileId: pa.value.fileId, isFinite: 1 });
const printerList = ref(["HP LaserJet Pro MFP M130fw", "Canon PIXMA TR4520", "Microsoft Print to PDF", "Foxit Reader PDF Printer"]);

const openDialog = data => {
  dialogVisible.value = true;
  if (data.isFinite == 1) {
    title.value = "本次打印为【不间断打印】，离开此页面即可中止打印，未打印的部分可重新发起打印！";
  } else {
    title.value = "本次打印为【逐份打印】，离开此页面即可中止打印，未打印的部分可重新发起打印！";
  }
  params.value = data;
};
const handleCurrentChange = val => {
  currentPage.value = val;
  // 获取新数据逻辑
  console.log(currentPage);
};
const handlePrintTest = () => {
  // 打印测试逻辑
  console.log("打印测试", printSettings.value, selectedPrinter.value);
  ElMessage.success("已发送打印测试任务");
};

const handleConfirmPrint = () => {
  // 正式打印逻辑
  console.log("正式打印", printSettings.value, selectedPrinter.value, copies.value);
  ElMessage.success("打印任务已提交");
  dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({ openDialog });
</script>

<style scoped>
.print-confirm-container {
  padding: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.mt-15 {
  margin-top: 15px;
}

.mt-20 {
  margin-top: 20px;
}

.print-settings {
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.print-settings h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #606266;
}

.print-copies {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.print-copies span {
  margin-right: 10px;
}
/* 横向排列样式 */
.print-settings-horizontal {
  margin: 15px 0;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}

.demo-form-inline {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
}

.demo-form-inline :deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

/* 响应式调整 - 在小屏幕上换行 */
@media (max-width: 768px) {
  .demo-form-inline {
    flex-wrap: wrap;
  }
}
:deep(.el-alert) {
  margin-bottom: 15px;
}
</style>
