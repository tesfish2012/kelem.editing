<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import ServicesService from '@/services/ServicesService'
import NewsService from '@/services/NewsService'

import { useAuthStore } from '@/stores/auth'

const { language } = storeToRefs(useAuthStore())

import { BASE_AVATAR } from '@/config'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
// import 'swiper/swiper-bundle.css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import slugify from '@/utils/slugify'

import TestimonialsService from '@/services/TestimonialsService'
import PartnershipService from '@/services/PartnershipService'
import SettingsService from '@/services/SettingsService'

const initial = ref(true)

const testimonials = ref([])

const services = ref([])

async function getServices() {
  try {
    const response = await ServicesService.getAllServices()
    if (response.success) {
      services.value = response.data.map((item) => ({
        ...item,
        serviceTitle: JSON.parse(item.serviceTitle),
        serviceDescription: JSON.parse(item.serviceDescription)
      }))
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

// get news/events
const news = ref([])

async function getNews() {
  try {
    const response = await NewsService.getAllNews()
    if (response.success) {
      news.value = response.data
        .map((item) => ({
          ...item,
          title: JSON.parse(item.title),
          body: JSON.parse(item.body),
          category: JSON.parse(item.category)
        }))
        .splice(0, 3)
      // response.data.length > 3 ? response.data.map((item)=>(

      // splice(0, 3) : response.data
      // }))
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

// const loanCalcutation = ref(false)
const getTestimonials = async () => {
  try {
    const response = await TestimonialsService.getAllTestimonials()
    if (response.success) {
      testimonials.value = response.data.map((item) => ({
        ...item,
        fullName: JSON.parse(item.fullName),
        profession: JSON.parse(item.profession),
        description: JSON.parse(item.description)
      }))

      testimonials.value = [...testimonials.value]
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

const targetPartners = ref(0)
const animatedPartners = ref(0)

const partners = ref([])
const getAllPartners = async () => {
  try {
    const response = await PartnershipService.getVerifiedPartners()
    if (response.success) {
      partners.value = response.data.map((partner) => ({
        ...partner,
        businessName: JSON.parse(partner.businessName)
      }))

      partners.value = [...partners.value]
      targetPartners.value = response.data.length
      const increment = targetPartners.value // Increment per millisecond
      // alert(targetCount.value)
      let intervalV = ref(0)
      if (targetPartners.value >= 1000) {
        intervalV.value = 0.005
      } else {
        intervalV.value = 1
      }
      const interval = setInterval(() => {
        animatedPartners.value = Math.min(animatedPartners.value + increment, targetPartners.value)
        if (animatedPartners.value === targetPartners.value) {
          clearInterval(interval)
        }
      }, intervalV.value)
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

// const duration = 2000 // Animation duration in milliseconds
const statistic = ref([])
const getStatistics = async () => {
  const res = await SettingsService.getStatistics()
  if (res.success) {
    statistic.value = res.data
  }
}
const brands = ref([])
const getHero = async () => {
  try {
    const response = await SettingsService.getHeroData()
    if (response.success) {
      // console.log(response.data)
      brands.value = response.data.map((item) => ({
        ...item,
        heroTitle: JSON.parse(item.heroTitle),
        heroDescription: JSON.parse(item.heroDescription)
      }))
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

const loading = ref(true)
onMounted(() => {
  getServices()
  getNews()

  getTestimonials()
  getAllPartners()
  getHero(),
    setTimeout(() => {
      initial.value = false
    }, 3000),
    getStatistics()
})

setTimeout(() => {
  if (brands.value) {
    loading.value = false
  }
}, 200)
</script>

<template>
  <section class="w-full flex flex-col">
    <section class="md:h-[calc(100vh_-_140px)] flex items-center justify-center" v-if="loading">
      <div class="circle z-40 h-10 w-10"></div>
    </section>

    <Swiper
      :slides-per-view="1"
      :modules="[Autoplay, Pagination, Navigation]"
      :autoplay="{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: false }"
      loop
      class="w-full h-screen md:h-[calc(100vh_-_80px)]"
    >
      <swiper-slide v-for="(service, index) in brands" :key="index" class="w-full relative h-full">
        <div class="w-full absolute inset-0 md:py-4x h-full md:max-h-[800px] overflow-auto">
          <img
            v-if="service.heroImage"
            :src="BASE_AVATAR + `${service.heroImage}`"
            class="w-full object-cover h-full object-center"
            loading="lazy"
          />
        </div>
        <div
          class="flex flex-col absolute left-0 top-0 bottom-0 w-full bg-black/60 p-6 z-40 justify-center h-full py-6 gap-6 md:py-0 items-center overflow-hidden"
        >
          <h1
            class="text-xl md:text-3xl lg:text-4xl font-bold text-white overflow-hidden"
            data-aos="fade-right"
          >
            {{ language === 'en' ? service.heroTitle.en : service.heroTitle.ti }}
          </h1>
          <p class="text-xl md:text-2xl w-full md:w-3/5 text-white text-center" data-aos="fade-up">
            {{ language === 'en' ? service.heroDescription.en : service.heroDescription.ti }}
          </p>
          <div class="flex gap-4 max-sm:justify-center">
            <router-link
              to="/services"
              class="bg-[#070227] text-white font-bold p-2 md:py-3 md:px-6 rounded"
              >{{ $t('OUR Programs') }}</router-link
            >
            <router-link
              to="/about"
              class="border border-[#288BF2] bg-white text-[#288BF2] font-bold md:py-3 p-2 md:px-6 rounded"
            >
              {{ $t('See More') }}</router-link
            >
          </div>
        </div>
      </swiper-slide>
    </Swiper>

    <!-- Why choose us section -->
    <section class="w-full h-full px-[1%] md:px-[10%] py-12 bg-[#070227]">
      <div class="flex flex-col w-full justify-center items-center h-full gap-4 p-6" vif="hero">
        <div class="flex flex-col items-center">
          <h1 class="text text-xl md:text-4xl font-bold text-white">{{ $t('Why Kaleb Academy') }}</h1>
          <hr class="w-3/4 bg-[#288FB2] h-[3px]" />
        </div>
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          <div
            class="bg-[#287b45] shadow-xl rounded-lg flex flex-col gap-12 relative overflow-hidden"
            data-aos="fade-right"
          >
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
          <div
            class="bg-[#001F3F] shadow-xl rounded-lg flex flex-col gap-12 relative"
            data-aos="fade-up"
          >
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

          <div
            class="bg-[#DAA520] shadow-xl rounded-lg flex flex-col gap-12 relative"
            data-aos="fade-left"
          >
            <div class=""></div>
            <font-awesome-icon
              icon="chart-line"
              class="bg-white p-1 text-2xl self-startz rounded text-[#DAA520] absolute inset-0 top-8 left-4"
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

    <section
      class="w-full px-[1%] md:px-[10%] py-4 md:py-12 text-[16px] bg-white bg-[#287b45]/25z service"
    >
      <div class="flex flex-col items-center justify-center gap-4 p-6">
        <div class="flex flex-col justify-center items-center">
          <h1 class="text text-xl md:text-4xl font-semibold">{{ $t('OUR SERVICES') }}</h1>
          <hr class="w-3/4 bg-[#288FB2] h-[3px]" />
        </div>
        <div
          class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          data-aos="fade-upx"
        >
          <div
            class="flex w-full flex-col shadow-xl hover:bdg-meyla-color1 bg-white zhover:bg-[#288fb2] border rounded-xl"
            v-for="(service, index) in services"
            :key="index"
          >
            <!-- <div class="h-[200px] w-full p-1" data-aos="fade-up">
              <img
                class="w-full h-full object-cover object-center rounded-xl"
                :src="BASE_AVATAR + `${service.serviceImage}`"
                alt="IT Professionals"
              />
            </div> -->
            <div
              class="flex flex-col gap-2 p-2 group-hover:shadow-lggroup-hover:bg-white translation-all duration-1000 text-[#001F3F] relative"
              data-aos="fade-up"
            >
              <div class="flex flex-col gap-2 p-4">
                <router-link
                  class="meyla-subtitlex whitespace-normal break-all hover:text-meyla-color1  font-semibold ztext-[#288fb2] text-xl"
                  :to="{ name: 'services' }"
                  >{{
                    language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti
                  }}</router-link
                >

                <p class="text-centerz line-clamp-5">
                  {{
                    language === 'en'
                      ? service.serviceDescription.en
                      : service.serviceDescription.ti
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


        <!-- Start News -->
    <section
      class="w-full px-[1%] md:px-[10%] py-4 md:py-12 news bg-white flex flex-col items-center justify-center gap-6"
    >
      <div class="flex flex-col justify-center items-center gap-4 bg-[#F5F5F5]z p-6">
        <div class="flex flex-col items-center justify-center">
          <h1 class="text text-xl md:text-4xl font-semibold">{{ $t('Latest News') }}</h1>
          <hr class="w-3/4 bg-[#288FB2] h-[3px]" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F5F5F5]z">
          <div
            v-for="(event, index) in news"
            :key="index"
            data-aos="fade-up"
            class="relative group bg-white/100x border rounded-xl shadow-xl bg-white"
          >
            <router-link :to="{ name: 'new-detail', params: { title: event.title } }" class="block">
              <div class="w-full h-[160px] p-1 relative">
                <img
                  :src="BASE_AVATAR + `${event.image}`"
                  alt="My company"
                  class="w-full h-full object-cover rounded-xl block object-cover object-top"
                  loading="lazy"
                />
                <h4 class="absolute left-2 top-2 bg-[#288fb2] text-white px-2 py-1">
                  {{ language === 'en' ? event.category.en : event.category.ti }}
                </h4>
              </div>
            </router-link>

            <div
              class="flex flex-col gap-2 py-6 group-hover:shadow-lg group-hover:bg-white translation-all duration-1000 px-4 relative"
            >
              <div class="flex flex-col gap-2 py-2">
                <router-link
                  class="text-lgx whitespace-normal break-all hover:text-[#288FB2] text-meyla-color1 line-clamp-2 font-semibold"
                  :to="{
                    name: 'new-detail',
                    params: { title: slugify(language === 'en' ? event.title.en : event.title.ti) }
                  }"
                  >{{ language === 'en' ? event.title.en : event.title.ti }}</router-link
                >
                <!-- <h1 class="text-[14px]">
                <font-awesome-icon icon="calendar-alt"></font-awesome-icon>
                {{ formattedDate(event.date) }}
              </h1> -->

                <p class="text-[#001F3F]X line-clamp-1">
                  {{ language === 'en' ? event.body.en : event.body.ti }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <router-link
          :to="{ name: 'news' }"
          class="text text-lgx hover:text-[#288FB2] font-semibold"
          >{{ $t('VIEW ALL NEWS') }}</router-link
        >
      </div>
    </section>

    <!-- End News -->


<!-- Testimonial Section -->
<section class="w-full px-[1%] md:px-[10%] py-4 md:py-12 text-[16px] bg-[#288fb2]/10">
  <div class="flex flex-col items-center justify-center gap-4 p-6">

    <!-- Title -->
    <div class="flex flex-col justify-center items-center gap-2">
      <h1 class="text-xl md:text-4xl font-semibold">{{ $t('Testimonials') }}</h1>
      <hr class="w-3/4 bg-[#288FB2] h-[3px] mx-auto" />
      <p class="text-[18px] text-center">
        {{ $t('about_testimonals') }}
      </p>
    </div>

    <!-- Swiper -->
    <div class="w-full">
      <Swiper
        :slides-per-view="1"
        :modules="[Autoplay, Pagination]"
        :autoplay="{ delay: 4000 }"
        class="w-full"
        :breakpoints="{
          '768': { slidesPerView: 2, spaceBetween: 20 },
          '1024': { slidesPerView: 3, spaceBetween: 20 }
        }"
        :pagination="{ clickable: true }"
        loop
      >
        <swiper-slide
          v-for="(testimonial, index) in testimonials"
          :key="index"
        >
          <div
            class="bg-white shadow-xl rounded-xl p-6 flex flex-col items-center justify-start gap-4 h-[330px] md:h-[350px] lg:h-[370px]"
          >
            <!-- Avatar -->
            <div class="w-24 h-24 rounded-full overflow-hidden border">
              <img
                :src="BASE_AVATAR + `${testimonial.avatar}`"
                class="object-cover w-full h-full"
              />
            </div>

            <!-- Name & Profession -->
            <h1 class="text-[16px] text-[#288fb2] font-semibold text-center px-2">
              {{ language === 'en' ? testimonial.fullName.en : testimonial.fullName.ti }}
            </h1>

            <h3 class="text-[#001F3F] text-[20px] font-medium text-center px-2">
              {{ language === 'en' ? testimonial.profession.en : testimonial.profession.ti }}
            </h3>

            <!-- Optional Description -->
            <p
              v-if="testimonial.description"
              class="text-gray-600 text-sm text-center line-clamp-4 px-3"
            >
              {{ language === 'en' ? testimonial.description.en : testimonial.description.ti }}
            </p>
          </div>
        </swiper-slide>
      </Swiper>
    </div>

  </div>
</section>




    <!-- Meyla facts -->
    <section
      class="w-full px-[1%] md:px-[10%] py-4 md:py-12 news bg-white flex flex-col items-center justify-center gap-6"
    >
    <div class="flex flex-col justify-center items-center gap-4 bg-[#F5F5F5]z p-6">
        <div class="w-full flex flex-col items-center justify-center">
          <h1 class="text text-xl md:text-4xl font-semibold">{{ $t('Kaleb Academy Facts') }}</h1>
          <hr class="w-[10%] bg-[#288FB2] h-[2px] mx-auto" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F5F5F5]z"
          v-if="statistic.length"
        >

          <div
            class="border rounded-xl shadow bg-white p-4 flex flex-col gap-4 justify-between items-center"
            data-aos="fade-up"
          >
            <font-awesome-icon
              icon="hand-holding-usd"
              class="text-2xl md:text-5xl font-semibold text-[#287b45]"
            ></font-awesome-icon>
            <p class="text-xl md:text-3xl">
              {{ statistic[0].studentEnrolled }}
            </p>
            <h1 class="text-xl md:text-2xl">{{ $t('Student Enrolled') }}</h1>
          </div>
          <div
            class="border rounded-xl shadow bg-white p-4 gap-4 flex flex-col justify-between items-center"
            data-aos="fade-up"
          >
            <font-awesome-icon
              icon="dollar-sign"
              class="text-2xl md:text-5xl font-semibold text-[#287b45]"
            ></font-awesome-icon>
            <p class="text-xl md:text-3xl">
              {{ statistic[0].classCompeted }}
            </p>
            <h1 class="text-xl md:text-2xl">{{ $t("Class Competed") }}</h1>
          </div>
          <div
            class="shadow rounded-xl flex flex-col bg-white p-4 gap-4 justify-between items-center"
            data-aos="fade-left"
          >
            <font-awesome-icon
              icon="suitcase"
              class="text-2xl md:text-5xl font-semibold text-[#287b45]"
            ></font-awesome-icon>
            <p class="text-xl md:text-3xl">
              {{ statistic[0].certifiedTeachers }}
            </p>
            <h1 class="text-xl md:text-2xl">{{ $t('Assets') }}</h1>
          </div>
        </div>
      </div>
    </section>



    <!-- loan calculator -->
  </section>
</template>

<style>
.custom-checkmark::before {
  content: '✓';
  display: inline-block;
  width: 1em;
  /* margin-right: 0.5em; */
  color: #daa520;
  /* color: #287B45; */

  font-weight: bold;
}
</style>
