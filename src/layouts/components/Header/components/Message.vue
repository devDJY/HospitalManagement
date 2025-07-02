<template>
  <div class="message">
    <el-popover placement="bottom" :width="400" trigger="click">
      <template #reference>
        <el-badge :value="huoqu()" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName" @tab-change="handleTabChange">
        <el-tab-pane :label="`未读(${huoqu()})`" name="first">
          <ul class="infinite-list" style="overflow: auto">
            <div class="message-list" v-for="item in records" :key="item.id">
              <div class="message-item" @click="handleRead(item)">
                <img src="@/assets/images/msg02.png" alt="" class="message-icon" />
                <div class="message-content">
                  <span class="message-title">{{ item.msgContext }}</span>
                  <span class="message-date">{{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
                </div>
              </div>
            </div>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="已读" name="second">
          <ul class="infinite-list" style="overflow: auto">
            <div class="message-list" v-for="item in records" :key="item.id">
              <div class="message-item" @click="handleRead(item)">
                <img src="@/assets/images/msg02.png" alt="" class="message-icon" />
                <div class="message-content">
                  <span class="message-title">{{ item.msgContext }}</span>
                  <span class="message-date">{{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
                </div>
              </div>
            </div>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <el-button type="text" v-if="activeName == 'first'" @click="handleReadAll"> 全部已读 </el-button>
    </el-popover>
    <!-- 审批结果弹窗 -->
    <el-dialog v-model="dialogVisible" :title="msgTitle" width="500px" :close-on-click-modal="false">
      <div class="approval-content">
        <div class="approval-time">{{ dayjs(approvalTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
        <div class="approval-message">{{ approvalMessage }}</div>
        <div class="file-info">
          <p><strong>文件编号：</strong>{{ fileNumber }}</p>
          <p><strong>文件名：</strong>{{ fileName }}</p>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { queryHomeNews, updateHomeNews, updateHomeNewsAll } from "@/api/modules/home";
import { useUserStore } from "@/stores/modules/user";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

interface MessageRecord {
  id: number;
  msgContext: string;
  createTime: string;
  fileCode: string;
  fileName: string;
  msgTitle: string;
}

const activeName = ref("first");
const records = ref<MessageRecord[]>([]);
const dialogVisible = ref(false);
const approvalTime = ref("");
const approvalMessage = ref("");
const fileNumber = ref("");
const fileName = ref("");
const msgTitle = ref("");

const getHomeNews = () => {
  records.value = [];
  let obj = {
    msgStatus: activeName.value == "first" ? 0 : 1
  };

  queryHomeNews(obj).then((res: any) => {
    records.value = res.records;
  });
};
const handleTabChange = () => {
  getHomeNews();
};
const handleRead = (item: any) => {
  updateHomeNews({ msgId: [item.id] }).then(() => {
    dialogVisible.value = true;
    approvalTime.value = item.createTime;
    approvalMessage.value = item.msgContext;
    fileNumber.value = item.fileCode;
    fileName.value = item.fileName;
    msgTitle.value = item.msgTitle;
    getHomeNews();
  });
};
const huoqu = () => {
  let num = activeName.value === "first" ? records.value.length : 0;
  return num;
};
const handleReadAll = () => {
  let obj = {
    msgIds: [] as number[]
  };
  records.value.map((item: any) => {
    obj.msgIds.push(item.id);
  });

  updateHomeNewsAll(obj).then(() => {
    getHomeNews();
  });
};
onMounted(() => {
  getHomeNews();
  setInterval(() => {
    const userStore = useUserStore();
    if (userStore.token) {
      getHomeNews();
    }
  }, 10000);
});
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
.message-list {
  display: flex;
  flex-direction: column;
  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        margin-bottom: 5px;
      }
      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
