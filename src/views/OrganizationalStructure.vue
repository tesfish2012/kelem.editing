<script setup>
import { onMounted, ref } from 'vue'
import { BASE_AVATAR } from '@/config'

import ApiService from '@/services/ApiService'

const service = new ApiService()
const structures = ref([])

async function getAllOrganizers() {
  const request = {
    method: 'GET',
    url: '/admin/organizations'
  }
  const response = await service.request(request)
  if (response.success) {
    structures.value = response.data
  }
}

onMounted(getAllOrganizers)
</script>

<template>
  <section class="w-full px-[1%] md:px-[7%] py-2 md:py-4">
    <div
      class="w-full grid grid-cols-2 h-[140px] bg-white items-center justify-center place-content-center rounded-xl px-[2%] md:px-[4%]"
    >
      <h1 class="text-4xl text-[#288fb2]">{{ $t('Organizational Structure') }}</h1>
    </div>
    <div class="px-[1%] md:px-[7%] w-full py-4 md:py-12 bg-white">
      <div
        class="bg-[#F5F5F5] w-full px-[1%] md:px-[3%] py-[3%] grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div
          v-for="(manager, index) in structures"
          :key="index"
          class="bg-white hover:bg-[#288fb2] shadow-xl flex flex-col items-center justify-center group overflow-hidden group"
        >
          <div class="h-[220px] w-full relative">
            <img
              :src="BASE_AVATAR + manager.avatar"
              alt=""
              class="w-full h-full object-contain object-center"
            />
            <h1 class="font-bold text-[16px] p-2">
              {{ manager.titlePrefix }} {{ manager.fullName }}
            </h1>
          </div>
          <div class="">
            <h1 class="font-bold text-[18px] p-2">
              {{ manager.titlePrefix }} {{ manager.fullName }}
            </h1>
            <h1 class="font-semibold text-sm p-2 text-[#F5F5F5]">{{ manager.profession }}</h1>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.modal {
  animation: modal 0.3s;
}

@keyframes modal {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
