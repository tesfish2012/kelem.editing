<script setup>
import { ref, onMounted } from 'vue'
// import SpinningCard from '@/components/open/SpinningCard.vue'
import SettingsService from '@/services/SettingsService'
import ServicesService from '@/services/ServicesService'
import TestimonialsService from '@/services/TestimonialsService'
import OrganizationService from '@/services/OrganizationService'
import { storeToRefs } from 'pinia'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/swiper-bundle.css'
// import 'swiper/swiper-bundle.css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { useRouter } from 'vue-router'
const router = useRouter()

import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

import { BASE_AVATAR } from '@/config'

const about = ref([])
const getAll = async () => {
  try {
    const response = await SettingsService.getAboutus()
    about.value = response.data.map((item) => ({
      ...item,
      background: JSON.parse(item.background),
      mission: JSON.parse(item.mission),
      vision: JSON.parse(item.vision),
      values: JSON.parse(item.values),
      slogan: JSON.parse(item.slogan),
      goals: JSON.parse(item.goals),
      programs: JSON.parse(item.programs),
      plans: JSON.parse(item.plans)
    }))
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
const services = ref([])
async function getServices() {
  try {
    const response = await ServicesService.getAllServices()
    if (response.success) {
      services.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

const testimonials = ref([])
async function getAllTestimonials() {
  const response = await TestimonialsService.getAllTestimonials()
  if (response.success) {
    testimonials.value = response.data.map((item) => ({
      ...item,
      fullName: JSON.parse(item.fullName),
      profession: JSON.parse(item.profession),
      description: JSON.parse(item.description)
    }))
  }
}

import ApiService from '@/services/ApiService'
const service = new ApiService()
const managements = ref([])

async function getAllmanagements() {
  const request = {
    method: 'GET',
    url: '/admin/professionals'
  }
  const response = await service.request(request)
  if (response.success) {
    managements.value = response.data.map((item) => ({
      ...item,
      fullName: JSON.parse(item.fullName),
      profession: JSON.parse(item.profession),
      titlePrefix: JSON.parse(item.titlePrefix)
    }))
    // [...response.data, ...response.data, ...response.data, ...response.data]
  }
}

const organizations = ref([])
const fetchOrganizations = async () => {
  try {
    const response = await OrganizationService.getAllOrganization()
    if (response.success) {
      organizations.value = response.data.map((item) => ({
        ...item,
        title: JSON.parse(item.title)
      }))
    }
  } catch (error) {
    // errorMessage.value = 'Failed to fetch organizations'
    // alert(error)
  }
}

onMounted(
  getAll(),
  getServices(),
  getAllTestimonials(),
  getAllmanagements(),
  fetchOrganizations()
  // fetchLoans()
)
</script>

<template>
  <section class="w-full py-2 md:py-4 bg-[#288fb2]/10">
    <div class="w-fullpx-[1%] md:px-[7%]">
      <div
        class="grid grid-cols-2 h-[140px] bg-[#288fb2] items-center justify-center place-content-center rounded-xl p-4"
      >
        <h1 class="text-4xl text-white">{{ $t('About Us') }}</h1>
      </div>
    </div>
    <section
      class="flex w-full flex-col items-centerS justify-center py-12"
      v-for="(abt, i) in about"
      :key="i"
    >
      <div class="w-full flex flex-col md:flex-row gap-6 px-[1%] md:px-[10%]" id="about_section">
        <div class="w-full h-full md:w-1/2 rounded-xl">
          <img
            src="@/assets/about.jpg"
            alt="About Kaleb academy"
            class="w-full h-full rounded-xl"
            style="min-height: 100%"
          />
          <br>
          <img
            src="@/assets/about2.jpg"
            alt="About Kaleb academy"
            class="w-full h-full rounded-xl"
            style="min-height: 100%"
          />
        </div>

        <div class="w-full md:w-1/2 flex flex-col gap-4 p-6 bg-[#FFFFFF] rounded-xl">
          <h1 class="meyla-title">{{ $t('About Kaleb academy') }}</h1>

          <div class="flex flex-col gap-2">
            <p>{{ language === 'en' ? abt.background.en : abt.background.ti }}</p>
          </div>
        </div>
      </div>
      <div
        class="px-[1%] md:px-[10%] w-full py-12 grid grid-cols-1 md:grid-cols-3 place-items-cexnter gap-6"
      >
        <div
          class="flex flex-col items-center border bg-white rounded-xl justify-center shadow-xl p-6 gap-2"
          data-aos="fade-right"
        >
          <div>
            <font-awesome-icon
              icon="bullseye"
              class="text-6xl text-[#287b45]"
              fill="text-[#DAA520]"
            ></font-awesome-icon>
          </div>
          <h1 class="meyla-subtitle text-meyla-color1">{{ $t('Mission') }}</h1>
          <p class="text-center">
            {{ language === 'en' ? abt.mission.en : abt.mission.ti }}
          </p>
          <!-- <p>{{ abt }}</p> -->
        </div>
        <div
          class="flex flex-col items-center border bg-white rounded-xl shadow-xl justify-center p-6 gap-2"
          data-aos="fade-up"
        >
          <div>
            <font-awesome-icon icon="eye" class="text-6xl text-[#287b45]"></font-awesome-icon>
          </div>
          <h1 class="meyla-subtitle text-meyla-color1">{{ $t('Vision') }}</h1>
          <p class="text-center">
            {{ language === 'en' ? abt.vision.en : abt.vision.ti }}
          </p>
        </div>
        <div
          class="flex flex-col items-center border justify-center shadow-xl bg-white rounded-xl p-6 gap-2"
          data-aos="fade-left"
        >
          <div>
            <font-awesome-icon
              icon="balance-scale"
              class="text-6xl text-[#287b45]"
            ></font-awesome-icon>
          </div>

          <h1 class="meyla-subtitle text-meyla-color1">{{ $t('Core Values') }}</h1>
          <p class="text-center">{{ language === 'en' ? abt.values.en : abt.values.ti }}</p>
        </div>
      </div>
    </section>

    <!-- BOD -->

<!-- BOD -->
<div class="px-[1%] md:px-[10%] w-full py-4 md:py-12 bg-white flex flex-col gap-8">

  <h1 class="text-4xl text-[#288fb2] text-center" data-aos="fade-up">
    {{ $t('Board of Directories') }}
  </h1>

  <!-- Top Featured Director -->
  <div
    v-if="managements.length > 0"
    class="max-w-md mx-auto bg-white rounded-xl shadow-lg text-center p-6 mb-12"
    data-aos="fade-right"
  >
    <img
      v-if="managements[managements.length -1].avatar"
      :src="BASE_AVATAR + managements[managements.length -1].avatar"
      class="w-full h-64 object-cover rounded-xl mb-4"
    />
    <div
      v-else
      class="w-full h-64 flex items-center justify-center bg-gray-200 text-4xl font-bold rounded-xl mb-4"
    >
      {{ managements[managements.length -1].fullName[language]?.split(' ').map(n => n[0]).join('') }}
    </div>
    <h2 class="text-xl font-semibold">
      {{ language === 'en' ? managements[managements.length -1].titlePrefix.en : managements[managements.length -1].titlePrefix.ti }}
      {{ language === 'en' ? managements[managements.length -1].fullName.en : managements[managements.length -1].fullName.ti }}
    </h2>
    <p class="text-gray-600 text-sm">
      {{ language === 'en' ? managements[managements.length -1].profession.en : managements[managements.length -1].profession.ti }}
    </p>
  </div>

  <!-- Next Two Directors -->
  <div class="flex flex-wrap justify-center gap-8 mb-12 px-4 md:px-16">
    <div
      v-for="(manager, index) in managements.slice(-3,-1)"
      :key="'next-two-' + index"
      class="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-105"
      :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
      :data-aos-delay="100"
    >
      <div class="w-full h-64 overflow-hidden">
        <img
          v-if="manager.avatar"
          :src="BASE_AVATAR + manager.avatar"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gray-200 text-4xl font-bold text-gray-600"
        >
          {{ manager.fullName[language]?.split(' ').map(n => n[0]).join('') }}
        </div>
      </div>
      <div class="p-6 text-center">
        <h2 class="text-xl font-semibold">
          {{ language === 'en' ? manager.titlePrefix.en : manager.titlePrefix.ti }}
          {{ language === 'en' ? manager.fullName.en : manager.fullName.ti }}
        </h2>
        <p class="text-gray-600 text-sm">
          {{ language === 'en' ? manager.profession.en : manager.profession.ti }}
        </p>
      </div>
    </div>
  </div>

  <!-- Remaining Directors -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4 md:px-16">
    <div
      v-for="(manager, index) in managements.slice(0, managements.length -3).reverse()"
      :key="'remaining-' + index"
      class="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-105"
      :data-aos="index % 3 === 0 ? 'fade-right' : (index % 3 === 1 ? 'fade-up' : 'fade-left')"
      :data-aos-delay="index * 100"
    >
      <div class="w-full h-64 overflow-hidden">
        <img
          v-if="manager.avatar"
          :src="BASE_AVATAR + manager.avatar"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gray-200 text-4xl font-bold text-gray-600"
        >
          {{ manager.fullName[language]?.split(' ').map(n => n[0]).join('') }}
        </div>
      </div>
      <div class="p-6 text-center">
        <h2 class="text-xl font-semibold">
          {{ language === 'en' ? manager.titlePrefix.en : manager.titlePrefix.ti }}
          {{ language === 'en' ? manager.fullName.en : manager.fullName.ti }}
        </h2>
        <p class="text-gray-600 text-sm">
          {{ language === 'en' ? manager.profession.en : manager.profession.ti }}
        </p>
      </div>
    </div>
  </div>
</div>



    <!-- Organizational Structure -->
    <div class="px-[1%] md:px-[10%] w-full py-4 md:py-12 flex flex-col gap-4">
      <h1 class="text-4xl text-[#288fb2]z text-center">{{ $t('Organizational Structure') }}</h1>
      <div class="w-full px-[1%] md:px-[3%] grid gap-4">
        <div v-for="(organization, i) in organizations" :key="i" class="w-full">
          <div class="w-full flex flex-col gap-4 p-4">
            <p class="text-black text-center text-[24px]">
              {{ language === 'en' ? organization.title.en : organization.title.ti }}
            </p>
            <img
              v-if="organization.image"
              :src="`${BASE_AVATAR}${organization.image}`"
              alt="Organization Avatar"
              class="w-full object-cover"
            />
          </div>
        </div>
     
      </div>
    </div>

    <section class="w-full h-full px-[1%] md:px-[10%] py-12 ">
      <div class="flex flex-col w-full justify-center items-center h-full gap-4 p-6" vif="hero">
        <div class="flex flex-col items-center">
          <h1 class="text text-xl md:text-4xl font-bold text-black" id="structure_section">
            {{ $t('Why Kaleb Academy') }}
        </h1>
        <hr class="w-3/4 bg-[#288FB2] h-[3px]" />
        </div>
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-[#287b45] shadow-xl rounded-lg flex flex-col gap-12 relative">
            <div class=""></div>
            <font-awesome-icon
              icon="money-bill-alt"
              class="bg-white p-1 text-2xl self-startz rounded text-[#287b45] absolute inset-0 top-8 left-4"
            ></font-awesome-icon>

            <div class="p-4 flex flex-col gap-2 bg-white h-full">
              <h1 class="custom-checkmarkx text-white/90z text-[20px] font-semibold">
                {{ $t('Financial Solutions') }}
              </h1>
              <p class="text-white/90z">
                {{ $t('Tailored financial solutions for diverse needs') }}
              </p>
            </div>
          </div>
          <div class="bg-[#001F3F] shadow-xl rounded-lg flex flex-col gap-12 relative">
            <div class=""></div>
            <font-awesome-icon
              icon="user-circle"
              class="bg-white p-1 text-2xl self-startz rounded text-[#001F3F] absolute inset-0 top-8 left-4"
            ></font-awesome-icon>
            <div class="p-4 flex flex-col gap-2 bg-white h-full">
              <h1
                class="custom-checkmarkx text-[#001F3F]x text-[20px] text-white/90z font-semibold"
              >
                {{ $t('Personalized Support') }}
              </h1>

              <p class="text-[#001F3F]x text-white/90z">
                {{ $t('Personalized support from experienced advisors') }}
              </p>
            </div>
          </div>
          <div class="bg-[#DAA520] shadow-xl rounded-lg flex flex-col gap-12 relative">
            <div class=""></div>
            <font-awesome-icon
              icon="chart-line"
              class="bg-white p-1 text-2xl self-startz rounded text-[#287b45] absolute inset-0 top-8 left-4"
            ></font-awesome-icon>
            <div class="p-4 flex flex-col gap-2 bg-white h-full">
              <h1 class="custom-checkmarkx text-[20px] font-semibold">
                {{ $t('Impact') }}
              </h1>
              <p class="custom-checkmarkx">
                {{ $t('Positive impact on local communities') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </section>

    <!-- testimonials -->

    <section class="w-full px-[1%] md:px-[10%] py-4 md:py-12 text-[16px] bg-[#288fb2]/10 " >
  <div class="flex flex-col items-center justify-center gap-4 p-6">
    <div class="flex flex-col justify-center items-center gap-2">
      <div>
        <h1 class="text text-xl md:text-4xl font-semibold">{{ $t('Testimonials') }}</h1>
        <hr class="w-3/4 bg-[#288FB2] h-[3px] mx-auto" />
      </div>
      <div>
        <p class="text-[18px] text-center">
          {{
            $t(
              'about_testimonals'
            )
          }}
        </p>
      </div>
    </div>
    <div class="w-full bg-[#288fb2]/5x">
      <Swiper
        :slides-per-view="1"
        :modules="[Autoplay, Pagination]"
        :autoplay="{ delay: 4000 }"
        class="w-full flex justify-center items-center"
        :breakpoints="{
          '768': { slidesPerView: 2, spaceBetween: 20 },
          '1024': { slidesPerView: 3, spaceBetween: 20 }
        }" :pagination="{ clickable: true }" loop  >
        <swiper-slide
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="relative shadow-xl works group flex flex-col items-center rounded-xl justify-center overflow-hidden p-4 bg-white"
        >
          <!-- Centered Image on Top -->
          <div class="w-24 h-24 relative rounded-full mb-4 mx-auto">
            <img
              :src="BASE_AVATAR + `${testimonial.avatar}`"
              alt="Testimonial Image"
              class="object-cover w-full h-full rounded-full border ring-2"
              loading="lazy"
            />
          </div>

          <!-- Centered Content Below Image -->
          <div class="w-full text-center">
            <h1 class="text-[16px] text-[#288fb2] font-semibold">
              {{ language === 'en' ? testimonial.fullName.en : testimonial.fullName.ti }}
            </h1>
            <h3 class="text-[#001F3F] text-[22px] font-medium">
              {{ language === 'en' ? testimonial.profession.en : testimonial.profession.ti }}
            </h3>

          </div>
        </swiper-slide>
      </Swiper>
    </div>
  </div>
</section>

  </section>
</template>

<style scoped>
.img-3 {
  animation: img-spin 10s linear infinite;
}

@keyframes img-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
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

</style>
