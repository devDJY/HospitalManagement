<template>
  <div class="echarts">
    <div class="title">{{ title }}</div>
    <ECharts :option="option" />
  </div>
</template>

<script setup lang="ts" name="pie">
import { ref } from "vue";
import type { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
// 定义 props 类型
interface Props {
  title: string;
  legend: [string, string];
  data: { reviewedCount: number; total: number; waitReviewCount: number };
}
// 接收父组件传递的 props
const props = defineProps<Props>();
const option = ref({
  title: {
    text: `${props.data.total}\n总计`,
    x: "center",
    y: "center",
    textStyle: {
      color: "#0580f2",
      fontSize: 16 // 修正：数字类型，去掉引号
    }
  },
  color: ["rgba(176, 212, 251, 1)"],
  legend: {
    show: true,
    bottom: 0,
    center: true,
    itemGap: 12,
    data: props.legend
  },
  series: [
    {
      name: "Line 1",
      type: "pie",
      clockwise: true, // 修正：改为小写camelCase
      radius: ["65%", "40%"],
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      hoverAnimation: false,
      data: [
        {
          value: props.data.waitReviewCount,
          name: props.legend[0],
          itemStyle: {
            color: {
              // 直接使用color配置
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "#00cefc"
                },
                {
                  offset: 1,
                  color: "#367bec"
                }
              ]
            }
          }
        },
        {
          value: props.data.reviewedCount,
          name: props.legend[1],
          itemStyle: {
            color: "rgba(176, 212, 251, 1)"
          }
        }
      ]
    }
  ]
});
</script>

<style lang="scss" scoped>
.echarts {
  width: 20%;
  height: 160px;
}
.title {
  width: 100%;
  text-align: center;
}
</style>
