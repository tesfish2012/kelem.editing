<script setup>
import PolicyService from '@/services/PolicyService'
import { onMounted, ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())
const policies = ref([])
const errorMessage = ref('')
const fetchPolicies = async () => {
  try {
    const response = await PolicyService.getAllPolicies()

    // alert(response.success)
    if (response.success) {
      policies.value = response.data.map((item) => ({
        ...item,
        title: JSON.parse(item.title),
        policy: JSON.parse(item.policy)
      }))
    }
    // console.log(policies.value)
  } catch (error) {
    errorMessage.value = 'Failed to fetch policies'
  }
}

onMounted(fetchPolicies)
</script>

<template>
  <section class="w-full py-4 md:py-12 text-[16px] bg-[#288fb2]/10">
    <div class="px-[1%] md:px-[7%] py-2">
      <div
        class="w-full grid grid-cols-2 h-[140px] bg-[#288fb2] items-center justify-center place-content-center rounded-xl px-[2%] md:px-[4%]"
      >
        <h1 class="text-4xl text-white">{{ $t('Privacy Policy') }}</h1>
      </div>
    </div>
    <div class="px-[1%] md:px-[10%] flex flex-col gap-6 py-4">
      <div
        v-for="(policy, i) in policies"
        :key="i"
        class="bg-white shadow border rounded-xl p-4 flex flex-col gap-2"
      >
        <h1 class="text-[20px] font-semibold">
          {{ language === 'en' ? policy.title.en : policy.title.ti }}
        </h1>
        <p>{{ language === 'en' ? policy.policy.en : policy.policy.ti }}</p>
      </div>
    </div>
  </section>
</template>
