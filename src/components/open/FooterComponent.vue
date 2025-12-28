<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

// import BaseInput from '../base/BaseInput.vue'
//import BaseTextarea from '../base/BaseTextarea.vue'
// import BaseButton from '../base/BaseButton.vue'

// import MessageService from '@/services/MessageService'
import SettingsService from '@/services/SettingsService'
import ServicesService from '@/services/ServicesService'
import ProductService from '@/services/ProductService'

// import swal from 'sweetalert'

// const form = ref({})
const services = ref([])
const date = ref(new Date())
const current = date.value.getFullYear()
async function getServices() {
  try {
    const response = await ServicesService.getAllServices()
    if (response.success) {
      response.data.length < 6
        ? (services.value = response.data.map((item) => ({
            ...item,
            serviceTitle: JSON.parse(item.serviceTitle)
          })))
        : (services.value = response.data.splice(0, 5).map((item) => ({
            ...item,
            serviceTitle: JSON.parse(item.serviceTitle)
          })))
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
const settings = ref([])
const router = useRouter()
async function getSettings() {
  try {
    const response = await SettingsService.getSettings()
    settings.value = response.data
    // console.log(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      console.error('Error retrieving comments:', error.response.data.message)
    } else {
      setTimeout(() => {
        router.push({ name: 'NetworkError' })
      }, 3000)
    }
  }
}
const products = ref([])
async function getProducts() {
  try {
    const response = await ProductService.getAllProducts()
    if (response.success) {
      products.value = response.data.splice(0, 6)
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
// const Subscriber = ref({ email: '' })
// const message = ref('')
// const subscribe = async () => {
//   const response = await MessageService.subscribe(Subscriber.value)
//   if (response.success) {
//     swal({ icon: 'success', title: 'Successfuly subscribed!', text: response.message })
//     // message.value = response.message
//     Subscriber.value = {}
//     setTimeout(() => {
//       // message.value = ''
//     }, 3000)
//   }
// }

const socialMediaLinks = ref([])
const fetchLinks = async () => {
  const response = await SettingsService.getLinks()
  socialMediaLinks.value = response.data
}

function shareOnFacebook() {
  const url = 'https://example.com'
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, '_blank')
}

function shareOnLinkedIn() {
  const url = 'https://example.com'
  const title = 'Check out this awesome article!'
  const description = 'This is a description of the article.'
  const linkedInUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
  window.open(linkedInUrl, '_blank')
}

function shareOnTwitter() {
  const url = 'https://example.com'
  const title = 'Check out this awesome article!'
  const hashtags = 'vue,javascript'
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags)}`
  window.open(twitterUrl, '_blank')
}

onMounted(() => {
  getSettings()
  getServices()
  getProducts()
  fetchLinks()
})
</script>

<template>
  <footer class="w-full px-[2%] md:px-[5%] text- text-whitex bg-[#001F3F] flex flex-col py-12">

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full py-2 md:py-4">
      <div class="flex flex-col gap-2">
        <h1 class="meyla-subtitleX text-[24px] font-bold text-white">Kaleb Academy</h1>
        <div class="flex flex-col gap-2" v-for="(setting, index) in settings" :key="index">
          <div class="flex gap-1 text-whitex items-center justify- hover:text-[#288fb2]">
            <font-awesome-icon icon="envelope" class="text-white"></font-awesome-icon>
            <p class="text-white">{{ setting.mail }}</p>
          </div>
          <div class="flex gap-1 text-whitex items-center justify- hover:text-[#288fb2]">
            <font-awesome-icon icon="phone" class="text-white"></font-awesome-icon>
            <p class="text-white">{{ setting.contactNumber.split(',')[0] }}</p>
          </div>
          <div class="flex gap-1 text-whitex items-center justify- hover:text-[#288fb2]">
            <font-awesome-icon icon="map-marker-alt" class="text-white"></font-awesome-icon>
            <p class="text-white">{{ setting.address }}</p>
          </div>
        </div>
        <h1 class="text-white font-bold">{{ $t('SHARE ON SOCIAL MEDIA') }}</h1>
        <div class="flex">
          <a class="text-white" href="#" @click="shareOnFacebook()">
            <font-awesome-icon :icon="['fab', 'facebook']" class="text-whitex p-2 rounded">
            </font-awesome-icon> </a
          ><a class="text-white" href="#" @click="shareOnTwitter()">
            <font-awesome-icon :icon="['fab', 'twitter']" class="text-whitex p-2 rounded">
            </font-awesome-icon> </a
          ><a class="text-white" href="#" @click="shareOnLinkedIn()">
            <font-awesome-icon :icon="['fab', 'linkedin']" class="text-whitex p-2 rounded">
            </font-awesome-icon>
          </a>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="meyla-subtitlex text-[24px] font-bold text-white">
          {{ $t('Products & Services') }}
        </h1>
        <ul class="flex flex-col text-white gap-1">
          <li
            class="text-whitex list-disc list-inside hover:text-[#288fb2]"
            v-for="(service, index) in services"
            :key="index"
          >
            <router-link :to="{ name: 'services' }">
              {{
                language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti
              }}</router-link
            >
          </li>
        </ul>
        <h1 class="meyla-subtitlex text-[24px] font-bold text-white">{{ $t('LEGAL') }}</h1>
        <ul class="flex flex-col gap-1">
          <li class="text-white list-disc list-inside hover:text-[#288fb2]">
            <router-link to="/privacy"> {{ $t('Privacy Policy') }}</router-link>
          </li>
          <li class="text-white list-disc list-inside hover:text-[#288fb2]">
            <router-link to="/privacy">{{ $t('Terms and conditions') }}</router-link>
          </li>
        </ul>
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="meyla-subtitlex text-[24px] font-bold text-white">{{ $t('QUICK ACCESS') }}</h1>
        <ul class="flex flex-col text-white gap-1">
          <li class="text-whitex list-disc list-inside hover:text-[#288fb2]">
            <router-link :to="{ name: 'about-us' }" class="relative">
              <!-- <span class="chervon-right"></span> -->
              {{ $t('About Us') }}</router-link
            >
          </li>
          <li class="text-whitex list-disc list-inside hover:text-[#288fb2]">
            <router-link :to="{ name: 'services' }" class="">
              <!-- <span class="chervon-right"></span> -->
              {{ $t('Services') }}</router-link
            >
          </li>
          <li class="text-whitex list-disc list-inside hover:text-[#288fb2]">
            <router-link :to="{ name: 'career' }" class="">
              <!-- <span class="chervon-right"></span> -->
              {{ $t('Careers') }}</router-link
            >
          </li>
          <li class="text-whitex list-disc list-inside hover:text-[#288fb2]">
            <router-link :to="{ name: 'news' }">
              {{ $t('News') }}</router-link
            >
          </li>
          <li class="text-whitex list-disc list-inside hover:text-[#288fb2]">
            <router-link :to="{ name: 'open-faqs' }">
              {{ $t('FAQs') }}</router-link
            >
          </li>
          <li class="text-whitex list-disc list-inside hover:text-[#288fb2]">
            <router-link :to="{ name: 'contact-us' }">
              {{ $t('Contact Us') }}</router-link
            >
          </li>


        </ul>
      </div>
    </div>

    
  </footer>
  <section class="flex flex-wrap w-full justify-between items-center p-2 text-center md:text-left">
  <p class="text-[#001F3F] flex flex-wrap justify-center md:justify-start text-[16px] md:text-[20px] gap-2 md:gap-4">
    {{ $t('Copyright') }}
    <span class="text-[#001F3F]">&copy;</span>{{ current }}
    <span class="text-[#001F3F]"> {{ $t('kaleb academy') }}</span>
  </p>
  <p class="text-[#001F3F] flex flex-wrap justify-center md:justify-end text-[16px] md:text-[20px] gap-2 md:gap-4">
    Powered by:
    <a
      href="mailto:Kidanearegay99@gmail.com"
      class="text-[#001F3F] hover:text-[#288fb2]"
    >
      Kidane Aregay
    </a>
  </p>
</section>


</template>

<style scoped>
.chervon-right::before {
  content: '>';
  display: inline-block;
  width: 1em;
  /* margin-right: 0.5em; */
  color: #fff;
  font-weight: bold;
}
</style>
