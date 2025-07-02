<template>
  <el-dialog v-model="dialogVisible" title="受控文件登记表" width="1000px">
    <!-- 打印内容区域 -->
    <div class="print-area">
      <div class="header">
        <h2>受控文件登记表</h2>
        <div class="print-time">打印时间：{{ printTime }}</div>
      </div>

      <table class="print-table" border="1" style="border: 1px solid rgb(239 239 239)">
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
                  <th role="columnheader" scope="col" aria-label="接收人" style="width: 100px" class="text-center"><span>接收人</span></th>
                  <th role="columnheader" scope="col" aria-label="发放人" style="width: 100px" class="text-center"><span>发放人</span></th>
                  <th role="columnheader" scope="col" aria-label="发放日期" class="text-center"><span>发放日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border">
                  <td class="w-430">{{ fileData.fileControllerInfo.fileControllerCode }}</td>
                  <td class="w-200">{{ fileData.fileControllerInfo.fileCount }}</td>
                  <td class="w-200">{{ fileData.fileControllerInfo.creatorName }}</td>
                  <td class="w-200">{{ fileData.fileControllerInfo.reviewerName }}</td>
                  <td class="w-170">{{ dayjs(fileData.fileControllerInfo.reviewTime).format("YYYY-MM-DD") }}</td>
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
                  <th role="columnheader" scope="col" aria-label="文件受控编码" style="width: 300px" class="text-center"><span>文件受控编码</span></th>
                  <th role="columnheader" scope="col" aria-label="份数" style="width: 100px" class="text-center"><span>份数</span></th>
                  <th role="columnheader" scope="col" aria-label="作废人" style="width: 100px" class="text-center"><span>作废人</span></th>
                  <th role="columnheader" scope="col" aria-label="作废说明" style="width: 100px" class="text-center"><span>作废说明</span></th>
                  <th role="columnheader" scope="col" aria-label="作废日期" class="text-center"><span>作废日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border" v-for="item in fileData.fileCancelList" :key="item.fileControllerCode">
                  <td class="w-130">{{ item.fileControllerCode }}</td>
                  <td class="w-200">{{ item.fileCount }}</td>
                  <td class="w-200">{{ item.creatorName }}</td>
                  <td class="w-200">{{ item.remark }}</td>
                  <td class="w-230">{{ dayjs(item.reviewTime).format("YYYY-MM-DD") }}</td>
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
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>打印人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>打印说明</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>打印日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border" v-for="item in fileData.filePrintList" :key="item.id">
                  <td class="w-430">{{ item.fileControllerCode }}</td>
                  <td class="w-200">{{ item.fileCount }}</td>
                  <td class="w-200">{{ item.creatorName }}</td>
                  <td class="w-200">{{ item.remark }}</td>
                  <td class="w-170">{{ dayjs(item.reviewTime).format("YYYY-MM-DD") }}</td>
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
                  <th role="columnheader" scope="col" aria-label="使用人" style="width: 100px" class="text-center"><span>使用人</span></th>
                  <th role="columnheader" scope="col" aria-label="使用说明" style="width: 100px" class="text-center"><span>使用说明</span></th>
                  <th role="columnheader" scope="col" aria-label="使用登记日期" class="text-center"><span>使用登记日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border" v-for="item in fileData.fileUseList" :key="item.id">
                  <td class="w-430">{{ item.fileControllerCode }}</td>
                  <td class="w-200">{{ item.fileCount }}</td>
                  <td class="w-200">{{ item.creatorName }}</td>
                  <td class="w-200">{{ item.remark }}</td>
                  <td class="w-170">{{ dayjs(item.reviewTime).format("YYYY-MM-DD") }}</td>
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
                  <th role="columnheader" scope="col" aria-label="回收原因" style="width: 100px" class="text-center"><span>回收原因</span></th>
                  <th role="columnheader" scope="col" aria-label="交件人" style="width: 100px" class="text-center"><span>交件人</span></th>
                  <th role="columnheader" scope="col" aria-label="回收人" style="width: 100px" class="text-center"><span>回收人</span></th>
                  <th role="columnheader" scope="col" aria-label="回收日期" class="text-center"><span>回收日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border" v-for="item in fileData.fileRecycleList" :key="item.id">
                  <td class="w-430">{{ item.fileControllerCode }}</td>
                  <td class="w-100">{{ item.fileCount }}</td>
                  <td class="w-100">{{ item.remark }}</td>
                  <td class="w-200">{{ item.creatorName }}</td>
                  <td class="w-200">{{ item.reviewerName }}</td>
                  <td class="w-170">{{ dayjs(item.reviewTime).format("YYYY-MM-DD") }}</td>
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
                  <th role="columnheader" scope="col" aria-label="回收原因" style="width: 100px" class="text-center"><span>回收原因</span></th>
                  <th role="columnheader" scope="col" aria-label="页数" style="width: 100px" class="text-center"><span>页数</span></th>
                  <th role="columnheader" scope="col" aria-label="执行人" style="width: 100px" class="text-center"><span>执行人</span></th>
                  <th role="columnheader" scope="col" aria-label="销毁方式" style="width: 100px" class="text-center"><span>销毁方式</span></th>
                  <th role="columnheader" scope="col" aria-label="销毁日期" class="text-center"><span>销毁日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border" v-for="item in fileData.fileDestroyList" :key="item.fileControllerCode">
                  <td class="w-430">{{ item.fileControllerCode }}</td>
                  <td class="w-200">{{ item.destroyReason }}</td>
                  <td class="w-200">{{ item.fileCount }}</td>
                  <td class="w-100">{{ item.creatorName }}</td>
                  <td class="w-100">{{ item.destroyMethod }}</td>
                  <td class="w-170">{{ dayjs(item.reviewTime).format("YYYY-MM-DD") }}</td>
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
                  <th role="columnheader" scope="col" aria-label="打印人" style="width: 100px" class="text-center"><span>遗失人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印说明" style="width: 100px" class="text-center"><span>核实人</span></th>
                  <th role="columnheader" scope="col" aria-label="打印日期" class="text-center"><span>遗失日期</span></th>
                </tr>
              </thead>
              <tbody>
                <tr class="no-border" v-for="item in fileData.fileLoseList" :key="item.fileControllerCode">
                  <td class="w-430">{{ item.fileControllerCode }}</td>
                  <td class="w-200">{{ item.fileCount }}</td>
                  <td class="w-200">{{ item.creatorName }}</td>
                  <td class="w-200">{{ item.reviewerName }}</td>
                  <td class="w-170">{{ dayjs(item.reviewTime).format("YYYY-MM-DD") }}</td>
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
                  <th role="columnheader" scope="col" aria-label="异常" class="text-center"><span>异常</span></th>
                  <th role="columnheader" scope="col" aria-label="记录人" class="text-center"><span>记录人</span></th>
                  <th role="columnheader" scope="col" aria-label="记录时间" class="text-center"><span>记录时间</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in fileData.fileLogList" :key="item.id" class="no-border">
                  <td>{{ item.remark }}</td>
                  <td>{{ item.creatorName }}</td>
                  <td>{{ dayjs(item.reviewTime).format("YYYY-MM-DD") }}</td>
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
import dayjs from "dayjs";

const dialogVisible = ref(false);
const printTime = ref("");

const fileData = ref({
  projectName: "初始测试流程",
  fileCode: "PPP-8701-V1",
  fileName: "创建API模块.pdf",
  fileControllerInfo: {
    fileControllerCode: "PPP-8701-V1-0001~PPP-8701-V1-0015",
    fileCount: 15,
    creatorName: "chcha",
    reviewerName: "admin1",
    reviewTime: "2025-06-08T21:37:59"
  },
  fileCancelList: [
    {
      fileControllerCode: "FF_CODE_V4-0006,FF_CODE_V4-0007,FF_CODE_V4-0008,FF_CODE_V4-0009,FF_CODE_V4-0010",
      fileCount: 5,
      creatorName: "admin1",
      reviewTime: "2025-06-08T22:21:00"
    }
  ],
  filePrintList: [
    {
      fileControllerCode: "DJFI01-V1-0001~DJFI01-V1-0011",
      fileCount: 2,
      creatorName: "chcha",
      remark: null,
      reviewTime: "2025-06-09T12:04:27"
    }
  ],
  fileUseList: [
    {
      fileControllerCode: "PPP-8701-V1-0002",
      fileCount: 1,
      creatorName: "admin1",
      remark: null,
      reviewTime: "2025-06-09T12:25:16"
    }
  ],
  fileRecycleList: [
    {
      fileControllerCode: "PPP-8701-V1-0010",
      fileCount: 3,
      creatorName: "chcha",
      reviewerName: "admin1",
      remark: "损坏",
      reviewTime: "2025-06-14T23:52:46"
    }
  ],
  fileDestroyList: [
    {
      fileControllerCode: "PPP-8701-V1-0012",
      fileCount: 3,
      creatorName: "admin1",
      destroyReason: "污渍",
      destroyMethod: "其他",
      reviewTime: "2025-06-14T23:56:10"
    }
  ],
  fileLoseList: [
    {
      fileControllerCode: "PPP-8701-V1-0011",
      fileCount: 1,
      creatorName: "chcha",
      reviewerName: "admin1",
      reviewTime: "2025-06-14T23:53:57"
    }
  ],
  fileLogList: [
    {
      remark: "12321",
      creatorName: "admin1",
      reviewTime: "2025-06-13T01:33:47"
    },
    {
      remark: "12321",
      creatorName: "admin1",
      reviewTime: "2025-06-13T01:33:55"
    }
  ]
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
  padding: 8px 0 !important;
  line-height: 16px;
  text-align: center;
}
.left-width {
  width: 200px;
  background-color: #f0f0f0;
  border: 1px solid #e4e4e4;
}
.right-width {
  width: 800px;
}
.remark-section {
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}
table {
  width: 100%;
}
thead tr th {
  padding: 10px 0;
  background: #fafafa;
}
table th {
  border: 1px solid #efefef;
}
.remark-content {
  padding: 10px;
  margin-top: 5px;
  background: #f5f7fa;
  border-radius: 4px;
}
.header {
  margin-bottom: 20px;
  text-align: center;
}
.header h2 {
  margin: 0 0 10px;
}
.print-time {
  margin-bottom: 20px;
  color: #666666;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
