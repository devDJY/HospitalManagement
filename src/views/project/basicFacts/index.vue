<template>
  <div class="home flex" v-if="listdata">
    <div style="width: 74%">
      <div class="card echats mb-10">
        <div classs="title">概况</div>
        <div class="flex item">
          <div>
            <div class="echats-title">文件申请</div>
            <div class="echats-num">{{ listdata.applyFileCount }}</div>
          </div>
          <div>
            <div class="echats-title">驳回/拒绝申请</div>
            <div class="echats-num">{{ listdata.rejectFileCount }}</div>
          </div>
          <div>
            <div class="echats-title">文件受控</div>
            <div class="echats-num">{{ listdata.fileControllerCount }}</div>
          </div>
          <div>
            <div class="echats-title">文件作废</div>
            <div class="echats-num">{{ listdata.fileCancelCount }}</div>
          </div>
          <div>
            <div class="echats-title">文件打印</div>
            <div class="echats-num">{{ listdata.filePrintCount }}</div>
          </div>
          <div>
            <div class="echats-title">文件使用</div>
            <div class="echats-num">{{ listdata.fileUsedCount }}</div>
          </div>
          <div>
            <div class="echats-title">文件回收</div>
            <div class="echats-num">{{ listdata.fileRecycleCount }}</div>
          </div>
          <div>
            <div class="echats-title">遗失文件</div>
            <div class="echats-num">{{ listdata.fileLoseCount }}</div>
          </div>
        </div>
      </div>
      <div v-if="isManager == '1'">
        <div class="card mb-10">
          <div class="title">文件申请</div>
          <el-table :data="listdata.fileApplyList" border style="width: 100%">
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column prop="pageTotal" label="页数" />
            <el-table-column prop="fileCount" label="份数" />
            <el-table-column prop="applyUserName" label="申请人" />
            <el-table-column prop="applyTime" label="申请日期" />
            <el-table-column prop="status" label="状态" />
          </el-table>
        </div>
        <div class="card mb-10">
          <div class="title">文件受控</div>
          <el-table border :data="listdata.fileCertList" style="width: 100%">
            <el-table-column prop="fileCode" label="文件编码" />
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column prop="pageTotal" label="页数" />
            <el-table-column prop="fileCount" label="份数" />
            <el-table-column prop="applyUserName" label="申请人" />
            <el-table-column prop="applyTime" label="申请日期" />
            <el-table-column prop="status" label="状态" />
          </el-table>
        </div>
        <div class="card mb-10">
          <div class="title">回收申请</div>
          <el-table border :data="listdata.fileRecycleList" style="width: 100%">
            <el-table-column prop="fileCode" label="文件编码" />
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column prop="applyReason" label="回收原因" />
            <el-table-column prop="applyUserName" label="申请人" />
            <el-table-column prop="applyTime" label="申请日期" />
            <el-table-column prop="status" label="状态" />
          </el-table>
        </div>
        <div class="card mb-10">
          <div class="title">遗失申报</div>
          <el-table border :data="listdata.fileLoseList" style="width: 100%">
            <el-table-column prop="fileCode" label="文件编码" />
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column prop="remark" label="遗失说明" />
            <el-table-column prop="applyUserName" label="申报人" />
            <el-table-column prop="applyTime" label="申报日期" />
            <el-table-column prop="status" label="状态" />
          </el-table>
        </div>
        <div class="card mb-10">
          <div class="title">遗失申报</div>
          <el-table border :data="listdata.loseList" style="width: 100%">
            <el-table-column prop="projectName" label="项目名称" />
            <el-table-column prop="fileCode" label="文件编码" />
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column prop="address" label="文件受控编码" />
            <el-table-column prop="applyUserName" label="申报人" />
            <el-table-column prop="applyTime" label="申请日期" />
            <el-table-column prop="status" label="状态" />
          </el-table>
        </div>
      </div>
      <div class="card mb-10" v-if="isManager == '2'">
        <div class="title">文件打印</div>
        <el-table border :data="listdata.printList" style="width: 100%">
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="pageTotal" label="页数" />
          <el-table-column prop="fileCount" label="份数" />
          <el-table-column prop="fileControllerDate" label="受控日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
      <div class="card mb-10" v-if="isManager == '2'">
        <div class="title">文件使用</div>
        <el-table border :data="listdata.printList" style="width: 100%">
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="pageTotal" label="页数" />
          <el-table-column prop="fileCount" label="份数" />
          <el-table-column prop="printDate" label="打印日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
    </div>
    <div style="width: 25%">
      <div class="card mb-10" style="padding-left: 20px; border-radius: 8px; box-shadow: 0 1px 4px rgb(0 0 0 / 10%)">
        <div class="header" style="margin-bottom: 12px">
          <h2 class="project-name" style="margin: 0; font-size: 18px; font-weight: 600; color: #333333">{{ listdata.projectCode }}｜{{ listdata.projectName }}</h2>
        </div>
        <el-divider style="margin: 12px 0" />
        <div class="info-item" style="margin-bottom: 10px">
          <span class="info-label" style="color: #919399">申办方：</span>
          <span class="info-value">{{ listdata.applicant }}</span>
        </div>
        <!-- <div class="info-item" style="margin-bottom: 10px">
          <span class="info-label" style="color: #919399">机构名称：</span>
          <span class="info-value">{{ listdata.projectName }}</span>
        </div> -->
        <div class="info-item" style="margin-bottom: 10px">
          <span class="info-label" style="color: #919399">入组例数：</span>
          <span class="info-value">{{ listdata.enrollCount }}</span>
        </div>
        <div class="info-item" style="margin-bottom: 10px">
          <span class="info-label" style="color: #919399">管理员：</span>
          <span class="info-value">{{ listdata.managerInfo }}</span>
        </div>
        <div class="info-item">
          <span class="info-label" style="color: #919399">启动日期：</span>
          <span class="info-value">{{ dayjs(listdata.startTime).format("YYYY-MM-DD") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { onMounted, ref } from "vue";
import { getHomeInfoForManager, getHomeNews, overviewById, overviewByIdForManager } from "@/api/modules/home";
import { useUserStore } from "@/stores/modules/user";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
const userStore = useUserStore();
const route = useRoute();
const { projectId, isManager } = route.query;

const listdata = ref();
// 获取路由参数
const fetchData = async () => {
  // try {
  //   const { data } = await getHomeInfoForManager({ userId: userStore.userInfo.id });
  //   listdata.value = data || {};
  //   // 处理数据
  //   console.log("Fetched data:", data);
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  // }
};
const getHomelist = async () => {
  let data;
  if (isManager == "1") {
    data = await overviewByIdForManager({ projectId: projectId });
  } else {
    data = await overviewById({ projectId: projectId });
  }
  listdata.value = data.data || {};
};
// 组件挂载时调用
onMounted(() => {
  // fetchData();
  getHomelist();
});
</script>

<style scoped lang="scss">
.echats {
  height: 136px;
}
.echats-title {
  padding-bottom: 10px;
  font-size: 14px;
  color: #333333;
}
.item {
  padding: 10px 40px 0;
  text-align: center;
}
.echats-num {
  font-size: 20px;
  font-weight: bold;
}
.title {
  width: 100%;
  font-size: 16px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
