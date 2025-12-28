<template>
   <div>
  <nav
  class="w-full bg-[#070227] px-4 md:px-20 py-2 text-[#ECF71B]
         flex flex-col md:flex-row items-center justify-between gap-2"
>
  <!-- Contact Info -->
  <div
    class="flex flex-col sm:flex-row gap-3 text-sm font-medium "
    v-for="(setting, index) in settings"
    :key="index"
  >
    <!-- Email -->
    <div class="flex items-center gap-2 hover:text-[#1d4354] transition">
      <font-awesome-icon icon="envelope" />
      <span>{{ setting.mail }}</span>
    </div>

    <!-- Phone -->
    <div class="flex items-center gap-2 hover:text-[#1d4354] transition">
      <font-awesome-icon icon="phone" />
      <span>{{ setting.contactNumber.split(',')[0] }}</span>
    </div>
  </div>

  <!-- Social Media -->
  <div
    class="flex items-center gap-2"
    v-if="socialMediaLinks && socialMediaLinks.length > 0"
  >
    <a
      v-for="(link, index) in socialMediaLinks"
      :key="index"
      :href="link.link"
      target="_blank"
      class="w-8 h-8 rounded-full flex items-center justify-center
             bg-[#080228] text-[#ECF71B]
             hover:bg-[#1d4354] hover:text-white
             transition duration-200"
    >
      <font-awesome-icon
        v-if="link.platform.toLowerCase() === 'facebook'"
        :icon="['fab', 'facebook']"
      />
      <font-awesome-icon
        v-else-if="link.platform.toLowerCase() === 'twitter'"
        :icon="['fab', 'twitter']"
      />
      <font-awesome-icon
        v-else-if="link.platform.toLowerCase() === 'youtube'"
        :icon="['fab', 'youtube']"
      />
      <font-awesome-icon
        v-else-if="link.platform.toLowerCase() === 'telegram'"
        :icon="['fab', 'telegram']"
      />
      <font-awesome-icon
        v-else-if="link.platform.toLowerCase() === 'linkedin'"
        :icon="['fab', 'linkedin']"
      />
    </a>
  </div>
</nav>

  <header
    class="w-full text-[#001F3F] hidden bg-white/100 md:flex md:flex-col px-[1%] shadow md:px-[7%] sticky top-0 z-50 text-[20px]"
    :class="[
      { 'bg-blue-900/1d00 text-whitef': changeBackground },
      { ' bg-white/1d00': !changeBackground }
    ]"
  >
    <nav class="w-full flex justify-between items-center py-2  md:py-4">
      <router-link to="/" class="flex items-center hover:border-b-0" title="Meyla-sacco">
        <img src="@/assets/logo.jpg " alt="Logo of meyla-sacco" class="h-12 w-18 rounded-full" />
        <span>{{$t('kaleb academy')}}</span>    
        </router-link>

      <ul class="flex gap-3 items-center">
        <li>
          <router-link
            :to="{ name: 'home' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('home') }]"
            >{{ $t('Home') }}</router-link
          >
        </li>
        <li class="relative group">
          <router-link
            :to="{ name: 'about-us' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('about-us') }]"
            >{{ $t('About Us') }}</router-link
          >
          <div
            class="absolute hidden group-hover:flex rounded-xlz p-4 child z-50 min-w-80 space-y-2 left-0 bg-[#070227] border top-[100%] opacity-0 transition-opacity duration-300 ease-in-out transform scale-95 flex-col gap-2"
          >
            <a href="#about_section" class="hover:text-[#ECF71B]z text-white">
              <!-- @click="scrollToSection(el.id)" -->
              <span class="hover:text-[#ECF71B]z text-white"> {{ $t('About Us') }} </span>
              <hr class="text-[#001F3F]" />
            </a>
            <a href="#bod_section" class="hover:text-[#ECF71B]z text-white">
              <!-- @click="scrollToSection(el.id)" -->
              <span class="hover:text-[#ECF71B]z text-white">
                {{ $t('Board of Directories') }}
              </span>
              <hr class="text-[#001F3F]" />
            </a>
            <a href="#structure_section" class="hover:text-[#ECF71B]z text-white">
              <!-- @click="scrollToSection(el.id)" -->
              <span class="hover:text-[#ECF71B]z text-white">
                {{ $t('Organizational Structure') }}
              </span>
              <hr class="text-[#001F3F]" />
            </a>
          </div>
        </li>
        <li class="relative group">
          <router-link
            :to="{ name: 'services' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('services') }]"
            >{{ $t('Programs & Services') }}</router-link
          >
          <div
            class="absolute hidden group-hover:flex rounded-xlz p-4 child z-50 min-w-80 space-y-2 left-0 bg-[#080228] border top-[100%] opacity-0 transition-opacity duration-300 ease-in-out transform scale-95 flex-col gap-2"
          >
            <a
              :href="'#' + (language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti)"
              class="hover:text-[#ECF71B]z text-white"
              v-for="(service, i) in services"
              :key="i"
            >
              <span class="hover:text-[#ECF71B]z text-white font-semibold">
                {{ language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti }}
              </span>
              <p class="line-clamp-3 text-sm">
                {{
                  language === 'en' ? service.serviceDescription.en : service.serviceDescription.ti
                }}
              </p>
              <hr class="text-[#001F3F]" />
            </a>
          </div>
        </li>
        <li>
          <router-link
            :to="{ name: 'news' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('news') }]"
            >{{ $t('News') }}</router-link
          >
        </li>

        <li>
          <router-link
            :to="{ name: 'e-learning' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('e-learning') }]"
            >{{ $t('e-learning') }}</router-link
          >
        </li>

           <li>
          <router-link
            :to="{ name: 'careers' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('careers') }]"
            >{{ $t('Careers') }}</router-link
          >
        </li>

        <li>
          <router-link
            :to="{ name: 'open-gallery' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('open-faqs') }]"
            >{{ $t('Gallery') }}</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'contact-us' }"
            class="parent-item hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('contact-us') }]"
            >{{ $t('Contact Us') }}</router-link
          >
        </li>

        <li class="flex">
          <button
            @click="changeLanguage('en')"
            v-if="language !== 'en'"
            class="flex items-center justify-center"
          >
            <img src="@/assets/usa.png" alt="" class="w-4 h-4" />English</button
          ><button @click="changeLanguage('ትግርኛ')" v-else class="flex items-center justify-center">
            <img src="@/assets/tigray.png" alt="" class="w-4 h-4" />ትግርኛ
          </button>
        </li>
      </ul>
    </nav>
  </header>
  <header class="w-full flex md:hidden sticky top-0 bottom-0 bg-white/100 z-50 shadow-lg" >
    <nav class="w-full h-full flex justify-between py-4 px-2">
      <router-link to="/" class="flex items-center hover:border-b-0" title="meyla sacco">
        <img
          src="@/assets/logo.jpg"
          alt="Logo of kelem "
          height="20px"
          class="w-10 h-full object-contain rounded-full"
        />
      </router-link>
      <button @click="toggleSmallDevice">
        <font-awesome-icon icon="bars" v-if="!isSmall" class="text-xl"></font-awesome-icon>
        <font-awesome-icon icon="times" v-else class="ztext-red-600 text-xl"></font-awesome-icon> 
      </button>
    </nav>

    <div
      v-if="isSmall && showModal"
      class="w-full h-screen flex fixed top-[80px] z-50 bg-[#080228] overflow-auto p-4"
      data-aos="fade-left"
    >
      <div
        :class="[
          'w-full self-end px-[1%] md:px-[7%] flex flex-col gap-2 text-black items-end h-full'
        ]"
      >
        <ul>
          <li>
            <router-link
              :to="{ name: 'home' }"
              @click="visited"
              class="parent-item text-white hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('home') }]"
              >{{ $t('Home') }}</router-link
            >
          </li>
          <li class="relative group">
            <router-link
              :to="{ name: 'about-us' }"
              @click="visited"
              class="parent-item text-white hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('about-us') }]"
              >{{ $t('About Us') }}</router-link
            >
            <div
              class="flex rounded-xlz p-4 z-50 min-w-80 space-y-2 left-0 bg-[#ECF71B]z borderz top-[100%] transition-opacity duration-300 ease-in-out transform scale-95 flex-col gap-2"
            >
              <a href="#about_section" class="text-white hover:text-[#ECF71B] text-whitez">
                <!-- @click="scrollToSection(el.id)" -->
                <span class="hover:text-[#ECF71B]z text-whitez"> {{ $t('About Us') }} </span>
                <hr class="text-[#001F3F]" />
              </a>
              <a href="#bod_section" class="text-white hover:text-[#ECF71B] text-whitez">
                <!-- @click="scrollToSection(el.id)" -->
                <span class="hover:text-[#ECF71B] text-whitez">
                  {{ $t('Board of Directories') }}
                </span>
                <hr class="text-[#001F3F]" />
              </a>
              <a href="#structure_section" class="text-white hover:text-[#ECF71B] text-whitez">
                <!-- @click="scrollToSection(el.id)" -->
                <span class="hover:text-[#ECF71B]z text-whitez">
                  {{ $t('Organizational Structure') }}
                </span>
                <hr class="text-[#001F3F]" />
              </a>
            </div>
          </li>
          <li class="relative group text-white">
            <router-link
              :to="{ name: 'services' }"
              @click="visited"
              class="parent-item hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('services') }]"
              >{{ $t('Programs & Services') }}</router-link
            >
            <div
              class="flex rounded-xlz p-4 z-50 min-w-80 space-y-2 left-0 bg-[#ECF71B]z borderz top-[100%] opacity-0z transition-opacity duration-300 ease-in-out transform scale-95 flex-col gap-2"
            >
              <a
                :href="
                  '#' + (language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti)
                "
                class="hover:text-[#ECF71B] text-white"
                v-for="(service, i) in services"
                :key="i"
              >
                <span class="hover:text-[#ECF71B] text-white">
                  {{ language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti }}
                </span>

                <hr class="text-[#001F3F]" />
              </a>
            </div>
          </li>
          <li>
            <router-link
              :to="{ name: 'news' }"
              @click="visited"
              class="parent-item text-white hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('news') }]"
              >{{ $t('News') }}</router-link
            >
          </li>
          <li>
            <router-link
              :to="{ name: 'e-learning' }"
              @click="visited"
              class="parent-item text-white hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('e-learning') }]"
              >{{ $t('e-learning') }}</router-link
            >
          </li>
          <li>
            <router-link
            :to="{ name: 'open-gallery' }"
            class="parent-item text-white hover:text-[#ECF71B]"
            :class="[{ 'text-[#ECF71B]': isParentActive('open-faqs') }]"
            >{{ $t('Gallery') }}</router-link
          >
          </li>
          <li>
            <router-link
              :to="{ name: 'careers' }"
              @click="visited"
              class="parent-item text-white hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('careers') }]"
              >{{ $t('Careers') }}</router-link
            >
          </li>
          <li>
            <router-link
              :to="{ name: 'open-faqs' }"
              @click="visited"
              class="parent-item text-white hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('open-faqs') }]"
              >{{ $t('FAQs') }}</router-link
            >
          </li>
          <li>
            <router-link
              :to="{ name: 'contact-us' }"
              @click="visited"
              class="parent-item text-white hover:text-[#ECF71B]"
              :class="[{ 'text-[#ECF71B]': isParentActive('contact-us') }]"
              >{{ $t('Contact Us') }}</router-link
            >
          </li>
        </ul>
      </div>
      <div class="shadow  right-0 p-6" id="languageDropdown">
        <button
          @click="changeLanguage('en')"
          :class="[
            { 'text-[#ECF71B]': locale === 'en', 'text-white': locale !== 'en' },
            ' hover:text-[#ECF71B]'
          ]"
        >
          English
        </button>
        <button
          @click="changeLanguage('ትግርኛ')"
          :class="[
            { 'text-[#ECF71B]': locale !== 'en', 'text-white': locale !== 'ትግርኛ' },
            'text-white hover:text-[#ECF71B]'
          ]"
        >
          ትግርኛ
        </button>
      </div>
    </div>
  </header>
 </div>
</template>

<script setup>
// props are automatically provided in `<script setup>` block
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

import ServicesService from '@/services/ServicesService'

const { language } = storeToRefs(useAuthStore())

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
      router.push({ name: 'NetworkError' })
    }
  }
}

// about us hover popper
import { createPopper } from '@popperjs/core'

import SettingsService from '@/services/SettingsService'

// import BaseInput from '../base/BaseInput.vue'

import { useI18n } from 'vue-i18n'

//let showDropdown = ref(true)
const { locale } = useI18n()

const isOpen = ref(false)
const button = ref(null)
const dropdown = ref(null)
const arrow = ref(null)

// const showEnglish = ref(true)
// const toggleLanguage = () => {
//   showEnglish.value = !showEnglish.value
// }
const showDropdown = () => {
  isOpen.value = true
}

const toggleSmallDevice = () => {
  isSmall.value = !isSmall.value
  showModal.value = true
}

const visited = () => {
  isSmall.value = false
  showModal.value = false
}

// const hideDropdown = () => {
//   isOpen.value = false
// }

// const socialMediaLinks = ref([])
// const fetchLinks = async () => {
//   const response = await SettingsService.getLinks()
//   socialMediaLinks.value = response.data
// }

let showLang = ref('')
// const showLanguage = () => {
//   showLang.value = !showLang.value
// }

// function scrollToSection(id) {
//   const element = document.getElementById(id)
//   if (element) {
//     alert(id)
//     window.scrollTo({
//       top: element.offsetTop,
//       behavior: 'smooth'
//     })
//   }
//   isOpen.value = false
// }

watch(isOpen, (newVal) => {
  if (newVal) {
    createPopper(button.value, dropdown.value, {
      placement: 'bottom-end',
      modifiers: [{ name: 'arrow', options: { element: arrow.value } }]
    })
  }
})

// const search = ref('')
// const showSearch = ref(false)
function changeLanguage(lang) {
  locale.value = lang
  showLang.value = false
  localStorage.setItem('lang', lang)
  language.value = lang
  showDropdown.value = !showDropdown.value
  setTimeout(() => {
    showDropdown.value = true
  }, 300)
}
defineProps({
  items: {
    type: Array,
    required: true
  }
})
let isSmall = ref(false)
let showModal = ref(true)

const route = useRoute()
// function hasChildItems(item) {
//   return item.sub_items && item.sub_items.length > 0
// }
function isParentActive(item) {
  return route.name === item
}

// function toggleDropdown() {
//   showModal.value = !showModal.value
//   setTimeout(() => {
//     showModal.value = true
//   }, 300)
// }

const socialMediaLinks = ref([])
const fetchLinks = async () => {
  const response = await SettingsService.getLinks()
  socialMediaLinks.value = response.data
  // alert(socialMediaLinks.value.length)
}

const settings = ref([])
const router = useRouter()
async function getSettings() {
  try {
    const response = await SettingsService.getSettings()
    settings.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      return
    } else {
      setTimeout(() => {
        router.push({ name: 'NetworkError' })
      }, 3000)
    }
  }
}

// const cancelSearch = () => {
//   showSearch.value = false
//   search.value = ''
// }

const changeBackground = ref(false)

// const scroll = true
const handleScroll = () => {
  changeBackground.value = window.scrollY > 80 && window.scrollY < 3600
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
onMounted(() => {
  getSettings(), window.addEventListener('scroll', handleScroll), fetchLinks(), getServices()
})
</script>

<style scoped>
.child {
  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateX(40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.meyla-active-menu {
  color: #288fbf;
}

a {
  transition: border 0.3s;
}

/* Show the dropdown content when its parent is hovered */
.parent-item:hover > .child {
  display: flex;
  flex-direction: column;
  gap: 1;
  opacity: 1;
}

/* Hide the sub_items by default */
.child {
  display: none;
}

/* Arrow styles */
.arrow,
.arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  background: red;
}

.arrow::before {
  content: '';
  transform: rotate(45deg);
  visibility: visible;
}

.arrow[data-popper-placement^='top'] {
  bottom: -4px;
}

.arrow[data-popper-placement^='bottom'] {
  top: -4px;
}

.arrow[data-popper-placement^='left'] {
  right: -4px;
}

.arrow[data-popper-placement^='right'] {
  left: -4px;
}
</style>