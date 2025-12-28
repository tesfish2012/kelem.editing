<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import ServicesService from '@/services/ServicesService'
import PartnershipService from '@/services/PartnershipService'
import { BASE_AVATAR } from '@/config'

const { language } = storeToRefs(useAuthStore())
const services = ref([])
const partners = ref([])
const errorMessage = ref('')

const fetchServices = async () => {
  try {
    const response = await ServicesService.getAllServices()
    services.value = response.data.map((item) => ({
      ...item,
      serviceTitle: JSON.parse(item.serviceTitle),
      serviceDescription: JSON.parse(item.serviceDescription),
      subService: item.subService.map((subItem) => ({
        ...subItem,
        subServiceTitle: JSON.parse(subItem.subServiceTitle),
        subServiceDescription: JSON.parse(subItem.subServiceDescription)
      }))
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch Programs'
  }
}

const fetchPartners = async () => {
  const response = await PartnershipService.getVerifiedPartners()
  if (response.success) {
    partners.value = response.data
  }
}

onMounted(() => {
  fetchServices()
  fetchPartners()
})
</script>

<template>
  <section class="w-full px-[1%] md:px-[7%] py-2 md:py-4 bg-[#288fb2]/10">
    <div class="w-full grid grid-cols-2 h-[140px] bg-[#070227] text-white items-center justify-center rounded-xl md:px-[3%]">
      <h1 class="text-4x">{{ $t('Programs & Services') }}</h1>
    </div>

    <section class="w-full md:px-[3%] py-2 md:py-6 ">
      <div class="w-full grid grid-cols-1 gap-6">
        <div
          class="flex w-full flex-col  "
          v-for="(service, index) in services"
          :key="index"
          data-aos="fade-up"
        >
          <div class="w-full flex flex-col gap-2 items-center py-12 justify-center text-black">
            <h1 class="text-[24px] whitespace-normal break-all font-semibold">
              {{ language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti }}
            </h1>
            <p class="w-full md:w-full rounded-xl px-8 shadow-lg overflow-hidden">
              {{ language === 'en' ? service.serviceDescription.en : service.serviceDescription.ti }}
            </p>
          </div>

          <div v-if="service.subService.length > 0" class="py-4 flex flex-col gap-4">
          <h4 class="text-[24px] font-semibold text-center">{{ $t('Sub Service') }}</h4>
          <div
            class="grid gap-4"
            :class="{
              'grid-cols-1': service.subService.length === 1,
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': service.subService.length >= 2
            }"
          >
            <div
              v-for="sub in service.subService"
              :key="sub.id"
              class="shadow-xl p-4 bg-white border rounded-xl w-full"
              data-aos="fade-up"
            >
              <img
                v-if="sub.subServiceImage"
                :src="`${BASE_AVATAR}${sub.subServiceImage}`"
                alt="Sub-Service Image"
                class="w-56 h-56 object-cover"
              />
              <div class="mb-2">
                <h3 class="font-bold">
                  {{ language === 'en' ? sub.subServiceTitle.en : sub.subServiceTitle.ti }}
                </h3>
              </div>
              <div class="flex flex-col gap-2">
                <p>
                  {{
                    language === 'en'
                      ? sub.subServiceDescription.en
                      : sub.subServiceDescription.ti
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    </section>

    <section class="w-full px-[1%] md:px-[10%] py-4 md:py-12 bg-white">
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="flex flex-col justify-center items-center gap-2">
          <div>
            <h1 class="text-xl md:text-4xl font-semibold">{{ $t('Partners') }}</h1>
            <hr class="w-3/4 bg-[#288FB2] h-[3px] mx-auto" />
          </div>
        </div>
        <div class="w-full">
          <Swiper
            :slides-per-view="2"
            :modules="[Autoplay, Pagination, Navigation]"
            :autoplay="{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: false }"
            loop
            class="w-full flex justify-center items-center"
            :breakpoints="{
              '768': { slidesPerView: 2, spaceBetween: 20 },
              '1024': { slidesPerView: 3, spaceBetween: 20 }
            }"
          >
            <swiper-slide
              v-for="(partner, index) in partners"
              :key="index"
              class="relative group rounded-xl"
            >
              <div class="w-full flex gap-2 items-center justify-center">
                <div class="max-w-24 max-h-24 overflow-hidden flex justify-center p-1 bg-white rounded">
                  <img
                    :src="`${BASE_AVATAR}${partner.logo}`"
                    alt="Partner Image"
                    class="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </swiper-slide>
          </Swiper>
        </div>
      </div>
    </section>
  </section>
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
</style>
