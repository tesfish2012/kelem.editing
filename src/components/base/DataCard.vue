<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
const searchQuery = ref([])
</script>

<template>
  <div class="data-card">
    <h1 v-if="caption">{{ caption }}</h1>
    <base-input v-model="searchQuery"></base-input>
  </div>
</template>
