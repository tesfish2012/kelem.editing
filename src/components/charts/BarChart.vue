<template>
  <Bar
    id="my-chart-id-12"
    :key="ok_1"
    :options="chartOptions"
    :data="chartData"
    class="inline-block"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

defineProps({
  chartOptions: {
    type: Object,
    default: null
  },
  chartData: {
    type: Object,
    default: null
  },
  ok_1: {
    type: String,
    default: ''
  }
})
</script>
