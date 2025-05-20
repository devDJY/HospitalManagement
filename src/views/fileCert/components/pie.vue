<template>
  <div class="echarts">
    <ECharts :option="option" />
  </div>
</template>

<script setup lang="ts" name="pie">
import { ref } from "vue";
import type { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";

const option = ref({
  title: {
    text: "80%",
    x: "center",
    y: "center",
    textStyle: {
      fontWeight: "normal",
      color: "#0580f2",
      fontSize: 14 // 修正：数字类型，去掉引号
    }
  },
  color: ["rgba(176, 212, 251, 1)"],
  legend: {
    show: true,
    bottom: 0,
    itemGap: 12,
    data: ["01", "02"]
  },
  series: [
    {
      name: "Line 1",
      type: "pie",
      clockwise: true, // 修正：改为小写camelCase
      radius: ["50%", "66%"],
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      hoverAnimation: false,
      data: [
        {
          value: 80,
          name: "01",
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
          value: 20,
          name: "02",
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
  width: 100%;
  height: 100%;
}
</style>
