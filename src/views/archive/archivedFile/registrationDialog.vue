<template>
  <el-dialog v-model="dialogVisible" title="受控文件登记表" width="1000px">
    <!-- 打印内容区域 -->
    <div class="print-area">
      <div class="header">
        <h2>受控文件登记表</h2>
        <div class="print-time">打印时间：{{ printTime }}</div>
      </div>

      <table class="print-table" border="1" style="border: 1px solid rgb(239, 239, 239)">
        <tr>
          <td class="left-width"><strong>项目名称</strong></td>
          <td class="right-width">{{ fileData.projectName }}</td>
        </tr>
        <tr>
          <td class="left-width"><strontable>项目编码</strontable></td>
          <td class="right-width">{{ fileData.fileCode }}</td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件名</strong></td>
          <td class="right-width">{{ fileData.fileName }}</td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件发放</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="文件受控编码" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border">
                  <td class="w-430">2025-YW-038-SMTZJLB-GX-0001~2025-YW-038-SMTZJLB-GX-0010</td>
                  <td class="w-200">10</td>
                  <td class="w-200">冀兵</td>
                  <td class="w-200">杨洛浠</td>
                  <td class="w-170">2025-06-12 12:32</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件作废</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="文件受控编码" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border">
                  <td class="w-430">2025-YW-038-SMTZJLB-GX-0001~2025-YW-038-SMTZJLB-GX-0010</td>
                  <td class="w-200">10</td>
                  <td class="w-200">冀兵</td>
                  <td class="w-200">杨洛浠</td>
                  <td class="w-170">2025-06-12 12:32</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件打印</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="文件受控编码" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="接收人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="发放人" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="发放日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border" v-for="item in fileData.filePrintList" :key="item.id">
                  <td class="w-430">{{ item.fileControllerCode }}</td>
                  <td class="w-200">{{ item.fileCount }}</td>
                  <td class="w-200">冀兵</td>
                  <td class="w-200">杨洛浠</td>
                  <td class="w-170">2025-06-12 12:32</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件使用</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="文件受控编码" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border">
                  <td class="w-430">2025-YW-038-SMTZJLB-GX-0001~2025-YW-038-SMTZJLB-GX-0010</td>
                  <td class="w-200">10</td>
                  <td class="w-200">冀兵</td>
                  <td class="w-200">杨洛浠</td>
                  <td class="w-170">2025-06-12 12:32</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件回收</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="文件受控编码" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border">
                  <td class="w-430">2025-YW-038-SMTZJLB-GX-0001~2025-YW-038-SMTZJLB-GX-0010</td>
                  <td class="w-200">10</td>
                  <td class="w-200">冀兵</td>
                  <td class="w-200">杨洛浠</td>
                  <td class="w-170">2025-06-12 12:32</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件销毁</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="文件受控编码" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border">
                  <td class="w-430">2025-YW-038-SMTZJLB-GX-0001~2025-YW-038-SMTZJLB-GX-0010</td>
                  <td class="w-200">10</td>
                  <td class="w-200">冀兵</td>
                  <td class="w-200">杨洛浠</td>
                  <td class="w-170">2025-06-12 12:32</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-width"><strong>文件遗失</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="文件受控编码" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border">
                  <td class="w-430">2025-YW-038-SMTZJLB-GX-0001~2025-YW-038-SMTZJLB-GX-0010</td>
                  <td class="w-200">10</td>
                  <td class="w-200">冀兵</td>
                  <td class="w-200">杨洛浠</td>
                  <td class="w-170">2025-06-12 12:32</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-width"><strong>异常记录</strong></td>
          <td class="right-width">
            <table>
              <colgroup>
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
                <col class="" />
              </colgroup>
              <thead class="v-data-table-header">
                <tr>
                  <th role="columnheader" scope="col" aria-label="创建人" class="text-center"><span>创建人</span></th>
                  <th role="columnheader" scope="col" aria-label="备注时间" class="text-center"><span>备注时间</span></th>
                  <th role="columnheader" scope="col" aria-label="备注" class="text-center"><span>备注</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in fileData.fileLogList" :key="item.id" class="no-border">
                  <td>{{ item.creatorName }}</td>
                  <td>{{ item.reviewTime }}</td>
                  <td>{{ item.remark }}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>
    <template #footer>
      <el-button @click="handlePrint">打 印</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { archiveFileDetail } from "@/api/modules/archives";
const dialogVisible = ref(false);
const printTime = ref("");

const fileData = ref({
  projectName: "比较单次口服HSK39297片在肝功能不全和肝功能正常受试者中的药代动力学、安全性和药效动力学特",
  fileCode: "2025-YW-038-SMTZJLB-GX",
  fileType: "试验方案",
  version: "V1.0",
  effectiveDate: "2025-06-15",
  registrant: "张三",
  remark: "此为受控文件，请妥善保管"
});

// 更新打印时间
const updatePrintTime = () => {
  const now = new Date();
  printTime.value = now.toLocaleString();
};

// 打开弹窗
const openDialog = data => {
  if (data) {
    // fileData.value = { ...fileData.value, ...data };
    archiveFileDetail({ printId: data.printId }).then(res => {
      fileData.value = res.data;
    });
  }
  dialogVisible.value = true;
  updatePrintTime();
};

// 打印处理
const handlePrint = () => {
  updatePrintTime();

  const printContent = document.querySelector(".print-area").innerHTML;
  const printWindow = window.open("", "_blank");

  printWindow.document.open();
  printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>受控文件登记表</title>
          <style>
            body { font-family: "Microsoft YaHei", sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h2 { margin: 0 0 10px 0; }
            .print-time { color: #666; margin-bottom: 20px; }
            .left-width {
  background-color: #f0f0f0;
  border: 1px solid #e4e4e4;
  width: 200px;
}
.right-width {
  width: 800px;
}
            table{
                width: 100%;
            }
                table tr td {
  line-height: 16px;
  text-align: center;
  padding: 8px 0 !important;
}
  thead tr th {
  background: #fafafa;
  padding: 10px 0;
}
table th {
  border: 1px solid #efefef;
}
            @page { size: A4; margin: 10mm; }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          <\/script>
        </body>
      </html>
    `);
  printWindow.document.close();
};

// 暴露方法给父组件
defineExpose({
  openDialog
});
</script>

<style scoped>
.file-info-container {
  display: flex;
  margin-bottom: 20px;
}
table tr td {
  line-height: 16px;
  text-align: center;
  padding: 8px 0 !important;
}

.left-width {
  background-color: #f0f0f0;
  border: 1px solid #e4e4e4;
  width: 200px;
}
.right-width {
  width: 800px;
}
.remark-section {
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}
table {
  width: 100%;
}
thead tr th {
  background: #fafafa;
  padding: 10px 0;
}
table th {
  border: 1px solid #efefef;
}
.remark-content {
  margin-top: 5px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0 0 10px 0;
}

.print-time {
  color: #666;
  margin-bottom: 20px;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
