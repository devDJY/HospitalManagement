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
                <el-option label="单面" value="1" />
                <el-option label="双面-长边翻转" value="2" />
                <el-option label="双面-短边翻转" value="3" />
              </el-select>
            </el-form-item>

            <el-form-item label="纸张大小">
              <el-select v-model="printSettings.paperSize" style="width: 100px">
                <el-option label="A4" value="9" />
                <el-option label="A5" value="11" />
              </el-select>
            </el-form-item>

            <el-form-item label="方向">
              <el-select v-model="printSettings.orientation" style="width: 100px">
                <el-option label="纵向" :value="0" />
                <el-option label="横向" :value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="缩放">
              <el-select v-model="printSettings.scale" style="width: 180px">
                <el-option label="默认不缩放" value="0" />
                <el-option label="无失真缩放至匹配纸张" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item label="颜色">
              <el-select v-model="printSettings.color" style="width: 100px">
                <el-option label="黑白" value="1" />
                <el-option label="彩色" value="2" />
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
      <div class="final-warning mt-20">
        <el-alert title="请先进行打印测试，正式打印仅可打印一次！" type="error" :closable="false" show-icon />
      </div>
      <div>
        <el-button @click="dialogVisible = false">取消打印</el-button>
        <el-button @click="isPreview = true" type="success"> 预览文件 </el-button>
        <el-button type="primary" @click="handlePrintTest">打印测试</el-button>
        <el-button type="primary" @click="handleConfirmPrint">确认打印</el-button>
      </div>
      <div style="width: 100%; margin-top: 40px">
        <el-pagination
          style="width: 100px; margin: 0 auto; text-align: center"
          v-if="printSettings.attachmentUrl.length > 1 && isPreview"
          :current-page="currentPage"
          :page-size="1"
          :total="printSettings.attachmentUrl.length"
          layout="prev, pager, next"
          :pager-count="1"
          @current-change="handleCurrentChange"
        />
        <iframe v-if="isPreview" style="min-height: 800px; margin-top: 10px" :src="printSettings.attachmentUrl[currentPage - 1]" width="100%" frameborder="0"></iframe>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { fileControllerPrintCertQueryFile } from "@/api/modules/filecontroller";
import { fileControllerCertPrint } from "@/api/modules/fileInfo";
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
  side: "1", // 单面/双面
  paperSize: "9", // 纸张大小
  orientation: 0, // 打印方向
  scale: "0", // 缩放设置
  color: "1", // 打印颜色
  attachmentUrl: []
});
const params = ref({ fileCount: 1, fileId: 0, isFinite: 1 });
const printerList = ref(["HP LaserJet Pro MFP M130fw", "Canon PIXMA TR4520", "Microsoft Print to PDF", "Foxit Reader PDF Printer"]);

const openDialog = data => {
  dialogVisible.value = true;
  if (data.isFinite == 1) {
    title.value = "本次打印为【不间断打印】，离开此页面即可中止打印，未打印的部分可重新发起打印！";
  } else {
    title.value = "本次打印为【逐份打印】，离开此页面即可中止打印，未打印的部分可重新发起打印！";
  }
  fileControllerPrintCertQueryFile({ fileId: data.fileId, fileCount: data.fileCount }).then((res: any) => {
    printSettings.value.attachmentUrl = res.data;
    console.log(printSettings.value.attachmentUrl);
  });
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
  // 打印PDF
  // printJS("https://yang-oss-test.oss-cn-hangzhou.aliyuncs.com/upload/20250608/20250608213416851658.pdf");
  fileControllerCertPrint({
    fileCount: params.value.fileCount,
    fileId: params.value.fileId
  }).then((res: any) => {
    printPDF();
    ElMessage.success("打印任务已提交");
  });
  dialogVisible.value = false;
};

function Printers2List(json: any) {
  //将（打天下打印服务能访问到的）打印机填充到下拉列表组合框SelPrinter中
  //填充列表
  const prns: Array<{ name_original: string; name: string; print2file: boolean; default: boolean }> = json.val;
  // 打印机相关信息 默认显示default为true的
  console.log(prns); // 输出：[{name_original: 'Fax', name: 'Fax', print2file: false},{name_original: 'L8180 Series(网络)', name: 'L8180 Series(网络)', print2file: false, default: true}]
  const defaultprn = prns.find(e => e.default);
  selectedPrinter.value = defaultprn?.name ?? "";
  printerList.value = prns.map(e => e.name);
}

function viewPDF() {
  const printJson = {
    action: "previewfile",
    content: printSettings.value.attachmentUrl[currentPage.value],
    format: "pdf_url"
  };
  // @ts-ignore
  var pw = GetPrintWorld(); //获取一个打天下对象。不提供URL参数，意为本机的打天下打印服务器（"ws://127.0.0.1:8888"）。
  if (!pw.Act(printJson)) {
    //数据发送失败
    alert(pw.GetLastError());
  }
  pw.Act(printJson);
}

function printPDF() {
  const printJson = {
    action: "printfile",
    content: printSettings.value.attachmentUrl[currentPage.value],
    format: "pdf_url",
    // 下面是可选字段:
    papersize: printSettings.value.paperSize, // 指定输出纸张类型。整数值，8为A3；9为A4；11为A5等等
    /**
     * zoom 参数：
     * 0，缩放至指定尺寸大小输出。
     * 1，按照文档原稿尺寸输出在指定大小的纸张上。
     * 2，文档被无失真缩放至可以刚好被指定的纸张全部包容。
     * 3，文档被无失真缩放至其宽度可以刚好被指定纸张的宽度包容。
     * 4，文档被无失真缩放至其高度可以刚好被指定纸张的高度包容。
     */
    zoom: printSettings.value.scale, // 整数值，其值可以为1、2、3或者4。缺省为0。
    copies: copies, // 打印份数
    swap: printSettings.value.orientation == 0 ? true : false, // 为true，则打印页面横向/纵向切换
    colorful: printSettings.value.color, // 2，彩色打印；1，黑白打印；-1，系统默认
    duplex: printSettings.value.side // 1，不双面打印；2，双面打印，长边翻转；3，双面打印，短边翻转；4，自洽翻转，即纵向打印则长边反转、横向打印则短边反转。缺省为0，意为由打印机决定是否双面打印。
  };
  // @ts-ignore
  var pw = GetPrintWorld(); //获取一个打天下对象。不提供URL参数，意为本机的打天下打印服务器（"ws://127.0.0.1:8888"）。
  if (!pw.Act(printJson)) {
    //数据发送失败
    alert(pw.GetLastError());
  }
  pw.Act(printJson);
}

onMounted(() => {
  var json = {
    action: "12",
    refresh: true,
    defaultprn: true
  };
  json.action = "printers";
  json.refresh = true; //为true，则可确保返回刚刚添加的打印机。
  json.defaultprn = true; //是否包含缺省打印机信息
  // @ts-ignore
  var pw = GetPrintWorld(); //获取一个打天下对象。不提供URL参数，意为本机的打天下打印服务器（"ws://127.0.0.1:8888"）。
  var downloadUrl = "https://hospital-dy.oss-cn-hangzhou.aliyuncs.com/soft/打天下打印插件安装包-v1.8.24.1116(综合版).zip"; //把（32位）安装包放在你自己的web服务器上，然后这里指向它。
  // @ts-ignore
  if (IsX64Windows()) {
    downloadUrl = "https://hospital-dy.oss-cn-hangzhou.aliyuncs.com/soft/打天下打印插件安装包-v1.8.24.1116(综合版).zip"; //把（64位）安装包放在你自己的web服务器上，然后这里指向它。
  }
  pw.DownloadUrlForPdfPrint(downloadUrl); //指定打天下安装包（综合版）下载地址
  // @ts-ignore
  pw.CallbackOnPrinterList(Printers2List); //指定回调函数
  if (!pw.Act(json)) {
    //调用（异步发送JSON数据到）打天下打印服务器
    alert(pw.GetLastError()); //出错，显示错误信息。
  }
});
// 暴露方法给父组件
defineExpose({
  openDialog
});
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
  padding: 10px;
  margin-top: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.print-settings h4 {
  margin: 0 0 10px;
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
  padding: 10px;
  margin: 15px 0;
  background: #f8f8f8;
  border-radius: 4px;
}
.demo-form-inline {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  align-items: center;
}
.demo-form-inline :deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

/* 响应式调整 - 在小屏幕上换行 */
@media (width <= 768px) {
  .demo-form-inline {
    flex-wrap: wrap;
  }
}
:deep(.el-alert) {
  margin-bottom: 15px;
}
</style>
