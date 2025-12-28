<script setup>
import { ref, onMounted } from 'vue'
// import SpinningCard from '@/components/open/SpinningCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

import { useRouter } from 'vue-router'

import BaseTextarea from '@/components/base/BaseTextarea.vue'
import PartnershipService from '@/services/PartnershipService'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'

import { BASE_AVATAR } from '@/config'

import { Autoplay } from 'swiper/modules'

const partners = ref([])
const getAllPartners = async () => {
  try {
    const response = await PartnershipService.getAllPartners()
    if (response.success) {
      partners.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      partners.value = []
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
const form = ref({
  businessName: '',
  email: '',
  phoneNumber: '',
  logo: '',
  website: '',
  specializeArea: '',
  description: ''
})

const message = ref('')
const success = ref('')

const router = useRouter()
async function savePartner() {
  try {
    const response = await PartnershipService.createPartnership(form.value)
    if (response.success) {
      form.value = {
        businessName: '',
        email: '',
        phoneNumber: '',
        logo: '',
        website: '',
        specializeArea: '',
        description: ''
      }
      getAllPartners()
      success.value = response.message

      setTimeout(() => {
        success.value = ''
      }, 3000)

      message.value = ''
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      message.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

onMounted(() => {
  getAllPartners()
})
</script>
<template>
  <div class="grid w-full grid-cols-1 md:grid-cols-4 justify-between py-12 bg-[#1d4354]/5">
    <div class="relative bgs-green-500 overflow-hiddden">
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
    <div class="py-12 flex flex-col col-span-2 items-center w-full justify-center gap-4">
      <h1 class="text-center text-3xl font-semibold">Work With Us</h1>
      <!-- <SpinningCard /> -->

      <p class="text-cente px-2 w-full" id="it">
        Allenatech aspires to work with partners to facilitate the socio-economic transformation
        using innovative problem solving technology and methods.Join us and let’s work together for
        a better future.
      </p>
    </div>
    <div class="py-4 md:py-12 relative">
      <img
        src="https://startp-next.envytheme.com/_next/static/media/shape4.0580e2ef.svg"
        alt=""
        class="absolute top-0 right-1/2 h-auto img-2"
      />
    </div>
  </div>

  <section
    class="w-full flex flex-col justify-center items-center px-[1%] md:px-[7%] py-4 md:py-6 gap-8"
  >
    <div class="meyla-subtitle"><h1>Our Partners</h1></div>
    <div class="w-full flex justify-center items-center">
      <Swiper
        :modules="[Autoplay]"
        :slides-per-view="1"
        :autoplay="{ delay: 3000 }"
        :space-between="30"
        class="w-full flex mx-auto items-center justify-center"
        :breakpoints="{
          '768': { slidesPerView: 2, spaceBetween: 20 },
          '1024': { slidesPerView: 4, spaceBetween: 30 }
        }"
      >
        <swiper-slide
          v-for="(partner, i) in partners"
          :key="i"
          class="flex justify-center itmes-center"
        >
          <a v-if="partner.website" :href="partner.website" target="_blank">
            <img
              :src="BASE_AVATAR + `${partner.logo}`"
              :alt="partner.businessName"
              class="w-24 md:w-16 h-auto mx-auto"
          /></a>
          <img
            v-else
            :src="BASE_AVATAR + `${partner.logo}`"
            :alt="partner.businessName"
            class="w-24 md:w-16 h-auto mx-auto"
          />
          <h4 class="text-center">{{ partner.businessName }}</h4>
        </swiper-slide>
      </Swiper>
    </div>
  </section>
  <section class="w-full b py-12 grid grid-cold-1 md:grid-cols-2 gap-4">
    <div
      class="bg-white shadow-[0_2px_18px_-6px_rgba(0,0,0,0.2)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] px-2"
    >
      <img
        src="https://www.allenatech.net/wp-content/uploads/2023/09/Screenshot-from-2023-08-03-10-24-53-2-edited.png"
        class="w-full object-cover object-center"
      />
      <div class="px-4 py-6">
        <h3 class="text-[#333] text-xl font-bold">{{ $t('Partnership_Form') }}</h3>
        <p class="mt-4 text-gray-500">
          This form is dedicated for companies/individuals who need to work with Allenatech in
          partnership. If you have an idea and need to implement it or you have a project and you
          need a partner, contact us by filling the online form provided below.
        </p>
      </div>
    </div>
    <div class="w-full flex flex-col items-center justify-center p-6 gap-2 shadow rounded-lg">
      <h1 class="text-center meyla-subtitle">Partnership Form</h1>
      <p class="justify-self-end text-green-500" v-if="success">{{ success }}</p>
      <form @submit.prevent="savePartner" class="w-full flex flex-col gap-4">
        <BaseInput
          v-model="form.businessName"
          type="text"
          required
          inputClass="px-8 py-3 "
          placeholder="Your business name"
        ></BaseInput>
        <BaseInput
          v-model="form.email"
          type="email"
          inputClass="px-8 py-3"
          required
          placeholder="Enter Your Email"
          autocomplete="true"
        ></BaseInput>

        <BaseInput
          v-model="form.phoneNumber"
          type="text"
          inputClass="px-8 py-3"
          required
          placeholder="Enter Your Phone number"
        ></BaseInput>
        <BaseInput
          v-model="form.website"
          inputClass="px-8 py-3"
          placeholder="Enter your website's link"
        ></BaseInput>
        <BaseInput
          v-model="form.specializeArea"
          required
          inputClass="px-8 py-3"
          placeholder="Specialize area"
        ></BaseInput>

        <BaseTextarea
          v-model="form.description"
          rows="4"
          class=""
          textareaClasses="px-8 "
          placeholder="Description"
        ></BaseTextarea>
        <p v-if="message" class="text-red-700">{{ message }}</p>
        <div class="flex gap-4">
          <BaseButton type="submit" class="self-start">Submit</BaseButton>
          <button type="reset" class="bg-gray-600 text-white px-4 py-2">Reset</button>
        </div>
      </form>
    </div>
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
