<script setup>
import { onMounted, ref } from 'vue'
import { BASE_AVATAR } from '@/config'

import AchievementService from '@/services/AchievementService'

 
const achievements = ref([])
const errorMessage = ref('')

  const fetchAchievements = async () => {
  try {
    const response = await AchievementService.getAllAchievements()
    achievements.value = response.data
  } catch (error) {
    errorMessage.value = 'Failed to fetch achievements'
  }
}


onMounted(fetchAchievements)
</script>

<template>
  <section class="w-full">
    <div class="flex flex-col w-full items-center justify-center bg-[#288FB2] py-24">
      <h1 class="text-2xl font-bold text-white">Achievements and/or awards</h1>
    </div>
    <div class="px-[1%] md:px-[5%] w-full grid grid-cols-1 md:grid-cols-3 gap-6 py-4 md:py-12">
      <div
        v-for="(achievement, index) in achievements"
        :key="index"
        class="border flex flex-col items-center justify-center"
      >
        <div class="p-1 h-[280x] w-[220px]">
          <img
            :src="BASE_AVATAR + achievement.image"
            alt=""
            class="w-full h-full transition-all transform hover:scale-110 delay-200 duration-500"
          />
        </div>
        <h1 class="font-bold text-[18px] text-[#288FB2]">
          {{ achievement.title }}
        </h1>
      </div>
    </div>
  </section>
</template>
