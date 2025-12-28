<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import VacancyService from '@/services/VacancyService'

let job = ref({})
const errorMessage = ref('')
const successMessage = ref('')
const saveJob = async () => {
  try {
    const response = await VacancyService.createVacancy(job.value)
    if (response.success) {
      successMessage.value = response.message
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
</script>

<template>
  <section class="w-full">
    <form @submit.prevent="saveJob" class="w-1/2 mx-auto fldex flex flex-wrap gap-4">
      <BaseInput
        v-model="job.jobTitle"
        type="text"
        required
        inputClass="pl-12 px-8 py-3"
        placeholder="Title"
      ></BaseInput>
      <BaseInput
        v-model="job.location"
        type="text"
        required
        inputClass="pl-12 px-8 py-3"
        placeholder="Title"
      ></BaseInput>
      <BaseInput
        v-model="job.employmentType"
        type="text"
        required
        inputClass="pl-12 px-8 py-3"
        placeholder="Title"
      ></BaseInput>
      <BaseInput
        v-model="job.qualification"
        type="text"
        required
        inputClass="pl-12 px-8 py-3"
        placeholder="Title"
      ></BaseInput>
      <BaseInput
        v-model="job.experience"
        type="text"
        required
        inputClass="pl-12 px-8 py-3"
        placeholder="Title"
      ></BaseInput>
      <BaseInput
        v-model="job.salary"
        type="text"
        required
        inputClass="pl-12 px-8 py-3"
        placeholder="Title"
      ></BaseInput>
      <BaseInput
        v-model="job.deadline"
        type="date"
        required
        inputClass="pl-12 px-8 py-3"
        placeholder="Title"
      ></BaseInput>

      <BaseTextarea v-model="job.description"></BaseTextarea>
      <BaseButton>Save Job</BaseButton>
    </form>
  </section>
</template>
