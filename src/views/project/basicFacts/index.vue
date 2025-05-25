<template>
  <div class="home flex" v-if="listdata">
    <div style="width: 79%">
      <div class="card echats mb-10">
        <div classs="title">概况</div>
        <div class="flex item">
          <div>
            <div class="echats-title">文件申请</div>
            <div class="echats-num">1</div>
          </div>
          <div>
            <div class="echats-title">驳回/拒绝申请</div>
            <div class="echats-num">1</div>
          </div>
          <div>
            <div class="echats-title">文件受控</div>
            <div class="echats-num">{{ listdata.certNum }}</div>
          </div>
          <div>
            <div class="echats-title">文件作废</div>
            <div class="echats-num">{{ listdata.certNum }}</div>
          </div>
          <div>
            <div class="echats-title">文件打印</div>
            <div class="echats-num">{{ listdata.certNum }}</div>
          </div>
          <div>
            <div class="echats-title">文件使用</div>
            <div class="echats-num">{{ listdata.certNum }}</div>
          </div>
          <div>
            <div class="echats-title">文件回收</div>
            <div class="echats-num">{{ listdata.certNum }}</div>
          </div>
          <div>
            <div class="echats-title">遗失文件</div>
            <div class="echats-num">{{ listdata.certNum }}</div>
          </div>
        </div>
      </div>
      <div class="card mb-10">
        <div class="title">形式审查</div>
        <el-table :data="listdata.applyList" border style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="applyUserName" label="申请人" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
      <div class="card mb-10">
        <div class="title">文件受控</div>
        <el-table border :data="listdata.certList" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="applyUserName" label="申请人" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
      <div class="card mb-10">
        <div class="title">文件回收</div>
        <el-table border :data="listdata.recycleList" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="address" label="文件受控编码" />
          <el-table-column prop="address" label="回收原因" />
          <el-table-column prop="applyUserName" label="申请人" />
          <el-table-column prop="applyTime" label="申请日期" />
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
      <div class="card mb-10">
        <div class="title">文件销毁</div>
        <el-table border :data="listdata.destroyList" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="fileCode" label="文件编码" />
          <el-table-column prop="fileName" label="文件名" />
          <el-table-column prop="address" label="文件受控编码" />
          <el-table-column prop="address" label="回收原因" />
          <el-table-column prop="applyUserName" label="交件人" />
          <el-table-column prop="applyTime" label="交件日期" />
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
    <div style="width: 20%">
      <div class="card mb-10">
        <div classs="title">最新动态</div>
        <el-timeline style="max-width: 600px">
          <el-timeline-item center timestamp="2018/4/2" placement="top"> Event start </el-timeline-item>
          <el-timeline-item timestamp="2018/4/2" placement="top"> Event end </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { onMounted, ref } from "vue";
import { getHomeInfoForManager, getHomeNews } from "@/api/modules/home";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
const listdata = ref();
const fetchData = async () => {
  try {
    const { data } = await getHomeInfoForManager({ userId: userStore.userInfo.id });
    listdata.value = data || {};
    // 处理数据
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getHomelist = async () => {
  try {
    const { data } = await getHomeNews({ userId: userStore.userInfo.id });
    console.log("Fetched home news:", data);
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
  height: 136px;
}
.echats-title {
  padding-bottom: 10px;
  font-size: 14px;
  color: #333333;
}
.item {
  padding: 20px 40px;
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
