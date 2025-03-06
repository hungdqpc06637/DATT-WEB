<template>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <div class="bg-transparent shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2 text-white">Đơn hàng theo tháng</h2>
        <v-chart class="chart" :option="orderChartOptions" autoresize />
      </div>
      <div class="bg-transparent shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2 text-white">Phân loại sản phẩm</h2>
        <v-chart class="chart" :option="productChartOptions" autoresize />
      </div>
      <div class="bg-transparent shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2 text-white">Doanh thu theo tháng</h2>
        <v-chart class="chart" :option="revenueChartOptions" autoresize />
      </div>
      <div class="bg-transparent shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2 text-white">Tăng trưởng doanh thu</h2>
        <v-chart class="chart" :option="growthChartOptions" autoresize />
      </div>
      <div class="bg-transparent shadow-md p-4 rounded-lg col-span-2">
        <h2 class="text-lg font-semibold mb-2 text-white">Đơn hàng & Doanh thu</h2>
        <v-chart class="chart" :option="combinedChartOptions" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PieChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, BarChart, PieChart, LineChart, GridComponent, TooltipComponent, LegendComponent]);

const orderChartOptions = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: "axis",
    textStyle: { color: '#000' }
  },
  legend: {
    data: ["Đơn hàng"],
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: "category",
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisLine: { lineStyle: { color: '#fff' } },
    axisLabel: { color: '#fff' }
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: '#fff' } },
    axisLabel: { color: '#fff' }
  },
  series: [{
    name: "Đơn hàng",
    type: "bar",
    data: [10, 15, 8, 20, 18, 25, 30, 22, 19, 24, 28, 35],
    itemStyle: { color: "#1890ff" }
  }]
});

const productChartOptions = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: "item",
    textStyle: { color: '#000' }
  },
  legend: {
    top: "5%",
    left: "center",
    textStyle: { color: '#fff' }
  },
  series: [{
    name: "Phân loại",
    type: "pie",
    radius: "50%",
    data: [
      { value: 40, name: "Áo thun" },
      { value: 30, name: "Quần jeans" },
      { value: 20, name: "Giày thể thao" },
      { value: 10, name: "Túi xách" }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)"
      }
    }
  }]
});

const revenueChartOptions = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: "axis",
    textStyle: { color: '#000' }
  },
  legend: {
    data: ["Doanh thu"],
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: "category",
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisLine: { lineStyle: { color: '#fff' } },
    axisLabel: { color: '#fff' }
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: '#fff' } },
    axisLabel: { color: '#fff' }
  },
  series: [{
    name: "Doanh thu",
    type: "line",
    data: [100, 200, 150, 300, 250, 400, 500, 450, 350, 420, 480, 600],
    itemStyle: { color: "#52c41a" }
  }]
});

const growthChartOptions = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: "axis",
    textStyle: { color: '#000' }
  },
  legend: {
    data: ["Doanh thu"],
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: "category",
    data: ["Q1", "Q2", "Q3", "Q4"],
    axisLine: { lineStyle: { color: '#fff' } },
    axisLabel: { color: '#fff' }
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: '#fff' } },
    axisLabel: { color: '#fff' }
  },
  series: [{
    name: "Doanh thu",
    type: "line",
    areaStyle: {},
    data: [500, 1200, 1800, 2500],
    itemStyle: { color: "#ff4d4f" }
  }]
});

const combinedChartOptions = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: "axis",
    textStyle: { color: '#000' }
  },
  legend: {
    data: ["Đơn hàng", "Doanh thu"],
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: "category",
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisLine: { lineStyle: { color: '#fff' } },
    axisLabel: { color: '#fff' }
  },
  yAxis: [
    {
      type: "value",
      name: "Đơn hàng",
      axisLine: { lineStyle: { color: '#fff' } },
      axisLabel: { color: '#fff' }
    },
    {
      type: "value",
      name: "Doanh thu (VNĐ)",
      axisLine: { lineStyle: { color: '#fff' } },
      axisLabel: { color: '#fff' }
    }
  ],
  series: [
    {
      name: "Đơn hàng",
      type: "bar",
      data: [10, 15, 8, 20, 18, 25, 30, 22, 19, 24, 28, 35],
      itemStyle: { color: "#1890ff" }
    },
    {
      name: "Doanh thu",
      type: "line",
      yAxisIndex: 1,
      data: [100, 200, 150, 300, 250, 400, 500, 450, 350, 420, 480, 600],
      itemStyle: { color: "#faad14" }
    }
  ]
});
</script>

<style>
.chart {
  width: 100%;
  height: 300px;
}
.p-4 {
  overflow-y: auto;
  max-height: 100vh;
}
  
</style>
