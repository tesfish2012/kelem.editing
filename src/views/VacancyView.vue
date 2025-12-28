<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import { storeToRefs } from 'pinia'

// import SpinningCard from '@/components/open/SpinningCard.vue'
import CareerService from '@/services/CareerService'

import dayjs from 'dayjs'

import slugify from '@/utils/slugify'

import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())
const careers = ref([])

const allCareers = async () => {
  try {
    const response = await CareerService.getOpenedCareers()
    if (response.success) {
      careers.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      return
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

const isApply = ref(false)
const jobToApply = ref({})

const successMessage = ref('')
const errorMessage = ref('')

const toggleApply = (career) => {
  isApply.value = true
  jobToApply.value = career
  successMessage.value = ''
  errorMessage.value = 0
}
const formattedDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const letter = ref('')
const resume = ref('')
const form = ref({ fullName: '', email: '', phoneNumber: '', applicationLetter: '', cv: '' })

const captureLetter = (file) => {
  letter.value = file
  form.value.applicationLetter = file
}

const captureResume = (file) => {
  resume.value = file
  form.value.cv = file
}

// import { useToast } from 'vue-toastify'

const submitApplication = async () => {
  try {
    const formData = new FormData()
    formData.append('fullName', form.value.fullName)
    formData.append('email', form.value.email)
    formData.append('phoneNumber', form.value.phoneNumber)
    alert(letter.value)
    formData.append('applicationLetter', form.value.applicationLetter)
    formData.append('cv', form.value.cv)
    const response = await CareerService.apply(jobToApply.value.id, formData)
    if (response.success) {
      // alert(response.message)
      form.value = {}
      setTimeout(() => {
        successMessage.value = response.message
        errorMessage.value = ''
      }, 2000)
      setTimeout(() => {
        isApply.value = false
      }, 5000)
      // const toast = useToast()
      // toast.success('This is a success message!', {
      //   position: 'top-right',
      //   duration: 3000 // 3 seconds
      // })
    }
  } catch (error) {
    if (error.response && error.response.status <= 404 && error.response.data) {
      errorMessage.value = error.response.data.error
      // alert(errorMessage)
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

onMounted(() => {
  allCareers()
})
</script>

<template>
  <div
    v-if="careers.length === 0"
    class="w-full flex flex-col px-[1%] md:px-[10%] bg-[#288fb2]/5x gap-1 items-center justify-center py-12 bg-[#288fb2]/10"
  >
    <div class="w-full flex flex-col gap-2 items-center justify-center">
      <h1 class="text-xl md:text-2xl font-semibold">{{ $t('Available Positions') }}</h1>
      <p class="text-[#87CEFA] text-center">
        {{ $t('Currently, we do not have any open positions.') }}
      </p>
    </div>
  </div>
  <div
    class="w-full px-[1%] md:px-[10%] bg-[#288fb2]/5x flex flex-col gap-1 items-center justify-center py-12 bg-[#288fb2]/10"
    v-else
  >
    <div class="w-full flex flex-col gap-2 items-center justify-center">
      <h1 class="text-xl md:text-4xl font-semibold">{{ $t('Available Positions') }}</h1>
      <!-- <p class="text-center border-l-4 border-[#288FB2]">
        We look for individuals who are passionate about the work they do and have desire to help
        others — whether they’re customers or coworkers.
      </p> -->
    </div>
    <div class="w-full py-2 flex flex-col gap-5 bg-red-40r0 justify-center items-start">
      <div
        class="w-full flex flex-col border rounded-xl shadow-xlz bg-white/90"
        v-for="(career, index) in careers"
        :key="index"
      >
        <div class="w-full p-4">
          <div class="w-full flex justify-between p-4">
            <ul>
              <li class="md:text-[28px] font-bold flex gap-2 items-center justify-center">
                <h1>Job Title:</h1>
                <h1>{{ career.jobTitle }}</h1>
              </li>
              <!-- <li class="md:text-[16px] font-semibolfd">Meyla</li> -->
              <!-- <li class="text-gray-700 text-[14px]">Posted 17 Days ago ???</li> -->
              <!-- <li class="mt-4 bg-gray-500 text-white inline-block  px-2 py-1">
                <span>{{ $t('Employment Type:') }} </span> {{ career.employmentType }}
              </li> -->
            </ul>
            <!-- <img
              src="@/assets/Logo-Blue.png"
              class="xrounded-full w-20 h-20 object-fit bg-cover object-center"
              width="200px"
              height="200px"
            /> -->
          </div>
          <hr class="w-full flex justify-between p-2" />
        </div>

        <div class="w-full flex flex-col justify-center px-8">
          <ul class="w-full flex flex-wrap py-1 gap-4">
            <li class="text-[16px]">
              {{ $t('Employment Type:') }}
              <span class="font-semiboldz">{{ career.employmentType }}</span>
            </li>
            <li class="zdivide-x-2 zw-full zmd:basis-1/2 text-[16px]">
              {{ $t('Posted on:') }}
              {{ formattedDate(career.createdAt) }}
            </li>
            <li class="zdivide-x-2 zw-full zmd:basis-1/2 text-[16px]">
              {{ $t('Deadline:') }}
              <span class="text-red-500 font-semibold">{{ career.deadline }}</span>
            </li>
          </ul>
        </div>
        <div class="w-full px-4">
          <div class="w-full p-4">
            <h1 class="text-[16px] font-semibold">{{ $t('Job Description') }}</h1>
            <ul class="py-2 text-[18px]">
              <li class="line-clamp-4 text-[20px]">{{ career.description }}</li>
            </ul>
          </div>
        </div>
        <!-- <div class="bg-white w-full px-4">
          <div class="w-full p-4">
            <h1 class="text-[16px] font-semibold">{{ $t('Job Requirement:') }}</h1>
            <ul class="py-2">
              <li class="">{{ career.qualification }}</li>
            </ul>
          </div>
        </div> -->
        <div class="bg-white">
          <ul class="flex p-4 justify-end items-center">
            <li>
              <router-link
                class="bg-[#288fb2] rounded-xl text-white px-2 py-1"
                :to="{
                  name: 'career-detail',
                  params: {
                    title: slugify(career.jobTitle)
                  }
                }"
              >
                {{ $t('Apply Now') }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.img-1 {
  animation: img-spin 2s linear infinite;
}

@keyframes img-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.img-2 {
  animation: svg-spin 5s linear infinite;
}
@keyframes svg-spin {
  0% {
    transform: rotate(0deg);
    top: 20%;
  }
  25% {
    transform: rotate(90deg);
    top: 40%;
    right: 30%;
  }
  50% {
    transform: rotate(270deg);
    top: 60%;
    right: 10%;
  }
  100% {
    transform: rotate(360deg);
    top: 0%;
    right: 0;
  }
}

.apply {
  animation: modal 0.5s;
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
