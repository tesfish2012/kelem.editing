<script setup>
import { ref, onMounted } from 'vue'



import SettingsService from '@/services/SettingsService'
const settings = ref([])
async function getSettings() {
  try {
    const response = await SettingsService.getSettings()
    settings.value = response.data
  } catch (error) {
    console.error('Error retrieving comments:', error)
  }
}
// const store = useAuthStore()
// const { user } = storeToRefs(store)

onMounted(() => {
  getSettings()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Settings') }}</h2>
    </div>
    <div class="w-full flex gap-4">
      <!-- <router-link
        :to="{ name: 'setting' }"
        exact-active-class="meyla-color1 border-b-2 border-red-500"
        >Home</router-link
      > -->
      <router-link
        :to="{ name: 'setting' }"
        exact-active-class="meyla-color1 border-b-2 border-[#288fb2]"
        >{{ $t('About Us') }}</router-link
      >
      <router-link
        :to="{ name: 'infographic' }"
        exact-active-class="meyla-color1 border-b-2 border-[#288fb2]"
        >{{ $t('Infography') }}</router-link
      >
      <router-link
        :to="{ name: 'faqs' }"
        exact-active-class="meyla-color1 border-b-2 border-[#288fb2]"
        >{{ $t('FAQs') }}</router-link
      >
      <router-link
        :to="{ name: 'policy' }"
        exact-active-class="meyla-color1 border-b-2 border-[#288fb2]"
        >{{ $t('Privacy policy') }}</router-link
      >
    </div>
    <router-view></router-view>
  </section>
</template>
