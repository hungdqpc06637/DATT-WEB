<template>
  <div class="p-4">
    <p class="text-2xl font-bold text-purple-700 animate-fade-in">
      🚀 CHÚC ÔNG CHỦ MAY MẮN NHÉ!
    </p>

    <!-- Biểu đồ thống kê -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <!-- Biểu đồ cột - Số lượng đơn hàng theo tháng -->
      <div class="bg-white shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Đơn hàng theo tháng</h2>
        <v-chart class="chart" :option="orderChartOptions" autoresize />
      </div>

      <!-- Biểu đồ tròn - Phân loại sản phẩm -->
      <div class="bg-white shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Phân loại sản phẩm</h2>
        <v-chart class="chart" :option="productChartOptions" autoresize />
      </div>

      <!-- Biểu đồ đường - Doanh thu theo tháng -->
      <div class="bg-white shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Doanh thu theo tháng</h2>
        <v-chart class="chart" :option="revenueChartOptions" autoresize />
      </div>

      <!-- Biểu đồ khu vực - Tăng trưởng doanh thu theo quý -->
      <div class="bg-white shadow-md p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Tăng trưởng doanh thu</h2>
        <v-chart class="chart" :option="growthChartOptions" autoresize />
      </div>

      <!-- Biểu đồ kết hợp - Số lượng đơn hàng & Doanh thu -->
      <div class="bg-white shadow-md p-4 rounded-lg col-span-2">
        <h2 class="text-lg font-semibold mb-2">Đơn hàng & Doanh thu</h2>
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

// Cấu hình ECharts
use([CanvasRenderer, BarChart, PieChart, LineChart, GridComponent, TooltipComponent, LegendComponent]);

// Biểu đồ cột - Số lượng đơn hàng theo tháng
const orderChartOptions = ref({
  tooltip: { trigger: "axis" },
  legend: { data: ["Đơn hàng"] },
  xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
  yAxis: { type: "value" },
  series: [{ name: "Đơn hàng", type: "bar", data: [10, 15, 8, 20, 18, 25, 30, 22, 19, 24, 28, 35], itemStyle: { color: "#1890ff" } }]
});

// Biểu đồ tròn - Phân loại sản phẩm
const productChartOptions = ref({
  tooltip: { trigger: "item" },
  legend: { top: "5%", left: "center" },
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
    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" } }
  }]
});

// Biểu đồ đường - Doanh thu theo tháng
const revenueChartOptions = ref({
  tooltip: { trigger: "axis" },
  legend: { data: ["Doanh thu"] },
  xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
  yAxis: { type: "value" },
  series: [{ name: "Doanh thu", type: "line", data: [100, 200, 150, 300, 250, 400, 500, 450, 350, 420, 480, 600], itemStyle: { color: "#52c41a" } }]
});

// Biểu đồ khu vực - Tăng trưởng doanh thu theo quý
const growthChartOptions = ref({
  tooltip: { trigger: "axis" },
  legend: { data: ["Doanh thu"] },
  xAxis: { type: "category", data: ["Q1", "Q2", "Q3", "Q4"] },
  yAxis: { type: "value" },
  series: [{ name: "Doanh thu", type: "line", areaStyle: {}, data: [500, 1200, 1800, 2500], itemStyle: { color: "#ff4d4f" } }]
});

// Biểu đồ kết hợp - Đơn hàng & Doanh thu
const combinedChartOptions = ref({
  tooltip: { trigger: "axis" },
  legend: { data: ["Đơn hàng", "Doanh thu"] },
  xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
  yAxis: [{ type: "value", name: "Đơn hàng" }, { type: "value", name: "Doanh thu (VNĐ)" }],
  series: [
    { name: "Đơn hàng", type: "bar", data: [10, 15, 8, 20, 18, 25, 30, 22, 19, 24, 28, 35], itemStyle: { color: "#1890ff" } },
    { name: "Doanh thu", type: "line", yAxisIndex: 1, data: [100, 200, 150, 300, 250, 400, 500, 450, 350, 420, 480, 600], itemStyle: { color: "#faad14" } }
  ]
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 300px;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-in-out;
}
</style>
