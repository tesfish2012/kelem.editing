<template>
  <Pie
    :id="pieChartId"
    :key="pieChartId"
    :options="chartOptions"
    :data="chartData"
    class="my-chart"
  />
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

defineProps({
  chartOptions: {
    type: Object,
    default: null
  },
  chartData: {
    type: Object,
    default: null
  },
  pieChartId: {
    type: String,
    default: 'pie'
  }
})
</script>