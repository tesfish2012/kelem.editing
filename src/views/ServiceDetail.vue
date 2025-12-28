<script setup>
// import SpinningCard from '@/components/open/SpinningCard.vue'
import slugify from '@/utils/slugify'
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import dayjs from 'dayjs'
import Service from '@/services/ServicesService'
import { BASE_AVATAR } from '@/config'
defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const service = ref({})

async function getService() {
  try {
    const response = await Service.getServiceByTitle(route.params.title)
    if (response.success) {
      alert('here')
      service.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      router.push({ name: '404resource', params: { resource: 'new' } })
      setTimeout(() => {}, 3000)
    } else {
      setTimeout(() => {
        // router.push({ name: 'NetworkError' })
      }, 5000)
    }
  }
}

// function formattedDate(date) {
//   return dayjs(date).locale('en').format('MMMM D, YYYY')
// }

const services = ref([])
async function getServices() {
  try {
    const response = await Service.getAllServices()
    if (response.success) {
      services.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      router.push({ name: '404resource', params: { resource: 'Product' } })
    } else {
      setTimeout(() => {
        // router.push({ name: 'NetworkError' })
      }, 5000)
    }
  }
}
watchEffect(() => {
   
  if (route.params.title) {
    getService()
  }
})
onMounted(() => {
  getServices()
})
</script>
<template>
  <section class="w-full">
    <div class="grid w-full grid-cols-1 md:grid-cols-4 justify-between bg-[#1d4354]/5">
      <div class="relative overflow-hiddden">
        <img
          src="https://startp-next.envytheme.com/_next/static/media/shape1.754ca456.png"
          alt=""
          class="w-1/4 h-auto object-cover absolute top-0 left-1/4 img-1"
        />
        <img
          src="https://startp-next.envytheme.com/_next/static/media/shape4.0580e2ef.svg"
          alt=""
          class="absolute right-0 img-2"
        />
      </div>
      <div class="py-12 flex flex-col items-center col-span-4 justify-center gap-4">
        <h1 class="text-2xl">{{ service.serviceTitle }}</h1>
        <SpinningCard />
      </div>
      <div class="py-12 relative">
        <img
          src="https://startp-next.envytheme.com/_next/static/media/shape4.0580e2ef.svg"
          alt=""
          class="absolute top-0 right-1/2 h-auto img-2"
        />
      </div>
    </div>
    <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-4 py-12 bg-[#1d4354]/5 px-[7%]">
      <div class="relative w-full flex flex-col group md:col-span-8">
        <div class="w-full max-h-[600px] overflow-hiddden">
          <img
            v-if="service.serviceImage"
            :src="BASE_AVATAR + `${service.serviceImage}`"
            alt="Meyla-SACCO"
            class="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div class="flex flex-col gap-2 py-6 bg-white translation-all duration-1000 px-4 relative">
          <div class="flex flex-col gap-4 py-2">
            <h2 class="meyla-subtitle whitespace-normal break-al">{{ service.serviceTitle }}</h2>
            <p class="text-gray-700"><span> </span> {{ service.serviceDescription }}</p>
          </div>
        </div>
      </div>
      <div class="w-full md:col-span-4 flex-wrap">
        <div class="bg-white flex flex-col gap-4 py-4 px-2">
          <h2 class="meyla-subtitle w-full">Our Services</h2>
          <hr />
          <router-link
            v-for="service of services"
            :key="service.id"
            :to="{ name: 'new-detail', params: { title: slugify(service.serviceTitle) } }"
            class="flex gap-2 w-full"
          >
            <img
              :src="BASE_AVATAR + `${service.servicdImage}`"
              alt="service"
              class="w-14 h-auto object-cover"
              width="48px"
              height="48px"
            />
            <div>
              <h5 class="text-lg font-semibold">{{ service.serviceTitle }}</h5>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
