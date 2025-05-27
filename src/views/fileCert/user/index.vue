<template>
  <div class="home flex" v-if="listdata">
    <div style="width: 79%">
      <div class="card echats mb-10">
        <div classs="title">概况</div>
        <div class="flex">
          <Pie ref="pieRef" :title="'文件申请'" :legend="['待审查' + listdata.applyCnt.waitReviewCount, '已审查' + listdata.applyCnt.reviewedCount]" :data="listdata.applyCnt" />
          <Pie ref="pieRef" :title="'受控文件'" :legend="['待受控' + listdata.certCnt.waitReviewCount, '已受控' + listdata.certCnt.reviewedCount]" :data="listdata.certCnt" />
          <Pie
            ref="pieRef"
            :title="'回收申请'"
            :legend="['待回收' + listdata.recycleCnt.waitReviewCount, '已回收' + listdata.recycleCnt.reviewedCount]"
            :data="listdata.recycleCnt"
          />
          <Pie ref="pieRef" :title="'遗失申报'" :legend="['待审核' + listdata.loseCnt.waitReviewCount, '已审核' + listdata.loseCnt.reviewedCount]" :data="listdata.loseCnt" />
        </div>
      </div>
      <div class="card mb-10">
        <div class="title">文件申请</div>
        <el-table :data="listdata.applyList" border style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
      <div class="card mb-10">
        <div class="title">受控文件</div>
        <el-table border :data="listdata.certList" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
      <div class="card mb-10">
        <div class="title">回收申请</div>
        <el-table border :data="listdata.recycleList" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="fileControllerCode" label="文件受控编码" width="120" />
          <el-table-column prop="applyReason" label="回收原因" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
      <div class="card mb-10">
        <div class="title">遗失申报</div>
        <el-table border :data="listdata.loseList" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="fileControllerCode" label="文件受控编码" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
    </div>
    <div style="width: 20%">
      <div class="card mb-10">
        <div classs="title">最新动态</div>
        <el-timeline style="max-width: 600px">
          <el-timeline-item center :timestamp="dayjs(item.updateTime).format('YYYY-MM-DD')" placement="top" v-for="(item, index) in newsData" :key="index">
            <div>{{ item.creatorName }}的[{{ item.fileName }}]{{ item.msgTitle }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { onMounted, ref } from "vue";
import Pie from "../components/pie.vue";
import { getHomeInfo, getHomeNews } from "@/api/modules/home";
import { useUserStore } from "@/stores/modules/user";
import dayjs from "dayjs";
const userStore = useUserStore();
const listdata = ref();
const newsData = ref();
const fetchData = async () => {
  try {
    const data = await getHomeInfo({ userId: userStore.userInfo.id });
    listdata.value = data.data || {};
    // 处理数据
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getHomelist = async () => {
  try {
    const data: any = await getHomeNews({ userId: userStore.userInfo.id });
    newsData.value = data.records;
  } catch (error) {
    console.error("Error fetching home news:", error);
  }
};
// 组件挂载时调用
onMounted(() => {
  fetchData();
  getHomelist();
});
</script>

<style scoped lang="scss">
.echats {
  height: 236px;
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
