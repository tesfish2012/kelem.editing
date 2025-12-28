<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import swal from 'sweetalert'
import CareerService from '@/services/CareerService'

import BaseFileInput from '@/components/base/BaseFileInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const letter = ref('')
const resume = ref('')
const form = ref({ fullName: '', email: '', phoneNumber: '', applicationLetter: '', cv: '' })
const career = ref({})

const errorMessage = ref('')

const captureLetter = (file) => {
  letter.value = file
  form.value.applicationLetter = file
}

const captureResume = (file) => {
  resume.value = file
  form.value.cv = file
}

const submitApplication = async () => {
  try {
    const formData = new FormData()
    formData.append('fullName', form.value.fullName)
    formData.append('email', form.value.email)
    formData.append('phoneNumber', form.value.phoneNumber)
    formData.append('applicationLetter', form.value.applicationLetter)
    formData.append('cv', form.value.cv)

    const response = await CareerService.apply(career.value.id, formData)
    if (response.success) {
      form.value = { fullName: '', email: '', phoneNumber: '', applicationLetter: '', cv: '' }
      resume.value = ''
      letter.value = ''
      swal({
        icon: 'success',
        title: 'You have successfully applied.',
        text: 'Job Application'
      })
      errorMessage.value = ''
    }
  } catch (error) {
    if (error.response && error.response.data) {
      swal({
        icon: 'error',
        title: error.response.data.message || error.response.data.error,
        text: 'Job Application'
      })
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

defineProps({
  title: { type: String, required: true }
})

const route = useRoute()
const router = useRouter()

async function getCareer() {
  try {
    const response = await CareerService.getCareerByTitle(route.params.title)
    if (response.success) {
      career.value = response.data
    }
  } catch (error) {
    router.push({ name: '404resource', params: { resource: 'new' } })
  }
}

function formattedDate(date) {
  return dayjs(date).locale('en').format('MMMM D, YYYY')
}

const careers = ref([])
async function getCareers() {
  try {
    const response = await CareerService.getAllCareers()
    if (response.success) {
      careers.value = response.data
    }
  } catch (error) {
    // handle errors
  }
}

const country = 'Ethiopia'
const nationality = 'Ethiopian'

watchEffect(() => {
  if (route.params.title) getCareer()
})

onMounted(() => {
  getCareers()
})
</script>

<template>
  <section class="w-full bg-[#288fb2]/10 flex flex-col gap-8 py-12 items-center px-[1%] md:px-[10%] justify-center">
    <div class="w-full bg-white/80 border rounded-xl p-6">
      <h2 class="text-4xl">{{ career.jobTitle }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col gap-4 py-2">
          <ul class="w-full flex flex-wrap py-1 gap-4">
            <li class="text-[16px]">
              {{ $t('Employment Type:') }}
              <span class="font-semiboldz">{{ career.employmentType }}</span>
            </li>
            <li class="zdivide-x-2 zw-full zmd:basis-1/2 text-[16px]">
              {{ $t('Posted on:') }} {{ formattedDate(career.createdAt) }}
            </li>
            <li class="zdivide-x-2 zw-full zmd:basis-1/2 text-[16px]">
              {{ $t('Deadline:') }}
              <span class="text-red-500 font-semibold">{{ formattedDate(career.deadline) }}</span>
            </li>
          </ul>

          <div class="w-full">
            <h1 class="text-[24px] font-semibold">{{ $t('Experience:') }}</h1>
            <ul class="py-2 text-[18px]">
              <li class="text-[20px]">{{ career.experience }}</li>
            </ul>
          </div>

          <div class="w-full">
            <h1 class="text-[24px] font-semibold">{{ $t('Work Place:') }}</h1>
            <ul class="py-2 text-[18px]">
              <li class="text-[20px]">{{ career.workPlace }}</li>
            </ul>
          </div>

          <div class="w-full">
            <h1 class="text-[24px] font-semibold">{{ $t('Salary:') }}</h1>
            <ul class="py-2 text-[18px]">
              <li class="text-[20px]">{{ career.salary }}</li>
            </ul>
          </div>

          <div class="w-full">
            <h1 class="text-[24px] font-semibold">{{ $t('Qualification:') }}</h1>
            <ul class="py-2 text-[18px]">
              <li class="text-[20px]">{{ career.qualification }}</li>
            </ul>
          </div>

          <div class="w-full">
            <h1 class="text-[24px] font-semibold">{{ $t('Job Description') }}</h1>
            <ul class="py-2 text-[18px]">
              <li class="text-[20px]">{{ career.description }}</li>
            </ul>
          </div>

          <div class="w-full">
            <h1 class="text-[24px] font-semibold">{{ $t('Responsibility:') }}</h1>
            <ul class="py-2 text-[18px]">
              <li class="text-[20px]">{{ career.responsiblity }}</li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col md:p-12 gap-2 apply">
            <h1 class="text-3xl">Apply For the Job</h1>

            <div>
              <BaseInput disabled="true" :value="career.jobTitle" :label="'Job Title'"></BaseInput>
            </div>
            <div>
              <BaseInput disabled="true" :value="career.vaccancyNumber" :label="'Vacancy Number'"></BaseInput>
            </div>
            <div>
              <BaseInput disabled="true" :value="country" label="Country"></BaseInput>
            </div>
            <div>
              <BaseInput disabled="true" :value="nationality" label="Nationality"></BaseInput>
            </div>

            <form @submit.prevent="submitApplication" class="flex flex-col gap-4">
              <div class="grid">
                <div>
                  <BaseInput
                    v-model="form.fullName"
                    inputClass="px-4 py-2"
                    :label="$t('Full Name')"
                    :placeholder="$t('Enter your full name')"
                    required
                  ></BaseInput>
                  <BaseInput
                    v-model="form.email"
                    inputClass="px-4 py-2"
                    :label="$t('Email')"
                    :placeholder="$t('Enter your email')"
                    required
                    type="email"
                  ></BaseInput>
                  <BaseInput
                    v-model="form.phoneNumber"
                    inputClass="px-4 py-2"
                    :label="$t('Phone Number')"
                    :placeholder="$t('Enter your phone number')"
                    required
                  ></BaseInput>
                </div>

                <div class="flex flex-col p-2 gap-2">
                  <span class="text-blue-400 text-3xl">{{ $t('Attachments') }}</span>
                  <div class="flex flex-col items-center gap-1">
                    <BaseFileInput
                      @image-update="captureLetter($event)"
                      :label="$t('Choose Application Letter')"
                      type="file"
                      accept="application/pdf"
                      required
                    >
                      <font-awesome-icon icon="file" class="p-1"></font-awesome-icon>
                    </BaseFileInput>
                    <span class="text-sm">The file should be less than 100MB in size and have .pdf extensions:</span>
                    <p>{{ letter.name }}</p>
                  </div>

                  <div class="flex flex-col items-center gap-1">
                    <BaseFileInput
                      @image-update="captureResume($event)"
                      :label="$t('Choose Resume')"
                      type="file"
                      accept="application/pdf"
                    >
                      <font-awesome-icon icon="file" class="p-1"></font-awesome-icon>
                    </BaseFileInput>
                    <span class="text-sm">The file should be less than 100MB in size and have .pdf extensions:</span>
                  </div>

                  <span>{{ resume.name }}</span>
                </div>
              </div>

              <p class="text-red-700" v-if="errorMessage">{{ errorMessage }}</p>
              <BaseButton class="self-start px-4 rounded-xl" type="submit">{{ $t('Submit') }}</BaseButton>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <router-link
        to="/careers"
        class="bg-white px-4 py-2 rounded-xl border border-[#288fb2] text-[#288fb2]"
        >Careers</router-link
      >
    </div>
  </section>
</template>
