<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import CareerService from '@/services/CareerService'

import swal from 'sweetalert'
import { useRouter } from 'vue-router'
const router = useRouter()

let job = ref({})
const errorMessage = ref('')
const successMessage = ref('')
const saveJob = async () => {
  try {
    const response = await CareerService.createCareer(job.value)
    if (response.success) {
      successMessage.value = response.message
      swal({
        title: response.message,
        icon: 'success'
      })
      router.push({ name: 'in-vacancy' })
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
  <section class="w-full bg-white p-6 rounded-lg shadow-xl">
    <div class="flex justify-end">
      <router-link class="bg-gray-500 text-white p-1 rounded" to="/app/vacancy">Cancel</router-link>
    </div>
    <p v-if="successMessage" class="text-green-700">{{ successMessage }}</p>
    <form @submit.prevent="saveJob" class="flex flex-col flex-wrap gap-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <BaseInput
            v-model="job.jobTitle"
            type="text"
            required
            inputClass="px-4 py-3"
            :label="$t('Job Title')"
          ></BaseInput>
          <BaseInput
            v-model="job.location"
            type="text"
            required
            inputClass="px-4 py-3"
            :label="$t('Location:')"
          ></BaseInput>
          <BaseInput
            v-model="job.employmentType"
            type="text"
            required
            inputClass="px-4 py-3"
            :label="$t('Employment Type:')"
          ></BaseInput>
        </div>
        <div class="flex flex-col gap-2">
          <BaseInput
            v-model="job.experience"
            type="text"
            required
            inputClass="px-4 py-3"
            :label="$t('Experience:')"
          ></BaseInput>
          <BaseInput
            v-model="job.salary"
            type="text"
            required
            inputClass="px-4 py-3"
            :label="$t('Salary:')"
          ></BaseInput>
          <BaseInput
            v-model="job.deadline"
            type="date"
            required
            inputClass="px-4 py-3"
            :label="$t('Deadline:')"
          ></BaseInput>
        </div>
      </div>
      <div>
        <BaseTextarea
          v-model="job.qualification"
          required
          :label="$t('Job Requirement:')"
        ></BaseTextarea>
        <BaseTextarea v-model="job.description" :label="$t('Job Description')"></BaseTextarea>
      </div>

      <p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>

      <div class="flex justify-center gap-8">
        <BaseButton type="submit" >{{ $t('Save Job') }}</BaseButton>
        <div class="flex justify-end">
          <router-link class="bg-gray-500 text-white p-1 rounded" to="/app/vacancy"
            >Cancel</router-link
          >
        </div>
      </div>
    </form>
  </section>
</template>
