<script setup>
import slugify from '@/utils/slugify'
import { useRouter } from 'vue-router'
const router = useRouter()

import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import NewsService from '@/services/NewsService'
import CareerService from '@/services/CareerService'

import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())
import { BASE_AVATAR } from '@/config'

const events = ref([])
const newz = ref([])
async function getNews() {
  NewsService.getAllNews().then((res) => {
    if (res.success) {
      events.value = res.data.map((item) => ({
        ...item,
        title: JSON.parse(item.title),
        category: JSON.parse(item.category),
        body: JSON.parse(item.body)
      }))
      newz.value = events.value.length > 3 ? events.value.splice(0, 3) : events.value
    }
  })
}

const newsList = ref([])
const fetchNews = async () => {
  const response = await NewsService.getAllNews()
  newsList.value = response.data.map((item) => ({
    ...item,
    title: JSON.parse(item.title),
    category: JSON.parse(item.category),
    body: JSON.parse(item.body)
  }))
}
const careers = ref([])
const allCareers = async () => {
  try {
    const response = await CareerService.getAllCareers()
    if (response.success) {
      careers.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      console.log('err')
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

onMounted(() => {
  getNews(), allCareers(), fetchNews()
})
</script>

<template>
  <section class="w-full bg-[#288fb2]/10">
    <div class="w-full justify-center grid grid-cols-12 gap-6 bg-[#F5F5F5] px-[4%] py-[2%]">

      <div
        v-if="events && events.length"
        class="w-full relative h-screen col-span-12 items-center justify-center place-content-center md:col-span-8 bg-white md:max-h-[340px] rounded-xl">
        
        <img
          v-if="events[0].image"
          :src="BASE_AVATAR + events[0].image"
          :alt="language === 'en' ? events[0].title.en : events[0].title.ti"
          class="w-full h-full object-cover object-top absolute inset-0"
          loading="lazy"
        />

        <div class="w-full h-full flex flex-col justify-between absolute inset-0 p-6">
          <h1 class="bg-[#288FB2] text-white rounded self-start py-2 px-4 text-[16px]">
            {{ language === 'en' ? events[0].category.en : events[0].category.ti }}
          </h1>

          <div class="bg-black/70 p-2 self-start">
            <router-link
              :to="{ name: 'new-detail', params: { title: language === 'en' ? slugify(events[0].title.en) : slugify(events[0].title.ti) } }"
              class="text-white text-[18px]">
              {{ language === 'en' ? events[0].title.en : events[0].title.ti }}
            </router-link>
            <h1 class="text-white flex gap-2">
              <span>{{ events[0].date }}</span>
              <span> {{ $t('By') }} {{ events[0].publisher }}</span>
            </h1>
          </div>
        </div>
      </div>

      <!-- Recent news -->
      <div class="hidden md:col-span-4 md:flex md:flex-col p-2 bg-white rounded-xl">
        <h1 class="text-xl">{{ $t('Recent News') }}</h1>

        <div
          class="w-full flex gap-1 py-1 bg-white mt-1 shadow"
          v-for="(post, i) in newz"
          :key="i"
        >
          <img
            :src="BASE_AVATAR + post.image"
            alt=""
            class="h-20 w-1/4 object-cover object-top opacity-70 hover:opacity-100 cursor-pointer"
          />

          <router-link
            :to="{ name: 'new-detail', params: { title: language === 'en' ? slugify(post.title.en) : slugify(post.title.ti) } }"
            class="hover:underline hover:text-[#288fb2] line-clamp-3 text-[14px]">
            {{ language === 'en' ? post.title.en : post.title.ti }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main news list -->
    <div class="px-[1%] md:px-[10%] py-2 bg-[#288fb2]/5">
      <div class="w-full flex flex-col justify-center items-center gap-4 bg-white p-6 md:py-10 rounded-xl">

        <div class="flex flex-col items-center justify-center">
          <h1 class="text-xl md:text-2xl font-semibold">{{ $t('News') }}</h1>
          <hr class="w-3/4 bg-[#288FB2] h-[2px]" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(event, index) in newsList" :key="index" class="group shadow-xl" data-aos="fade-up">

            <div class="w-full h-[150px] md:h-[200px] p-1 relative">
              <img
                v-if="event.image"
                :src="BASE_AVATAR + event.image"
                alt="My company"
                class="w-full h-full absolute inset-0 object-cover object-top"
                loading="lazy"
              />
              <h1 class="absolute bg-[#288fb2] p-1 rounded text-white">
                {{ language === 'en' ? event.category.en : event.category.ti }}
              </h1>
            </div>

            <div
              class="flex flex-col gap-1 py-2 group-hover:shadow-2xl group-hover:bg-[#288fb2] group-hover:text-white px-4 relative">
              
              <div class="flex flex-col gap py-2">
                <div class="w-full flex items-center">
                  <h1 class="bg-meyla-color1/90 px-2 py-1">
                    {{ event.date }}
                  </h1>
                  <h1>
                    {{ $t('By') }} <span>{{ event.publisher }}</span>
                  </h1>
                </div>

                <router-link
                  class="text-[18px] whitespace-normal break-all hover:text-meyla-color1"
                  :to="{ name: 'new-detail', params: { title: language === 'en' ? slugify(event.title.en) : slugify(event.title.ti) } }">
                  {{ language === 'en' ? event.title.en : event.title.ti }}
                </router-link>

                <p class="text-gray-700 group-hover:text-white line-clamp-4">
                  {{ language === 'en' ? event.body.en : event.body.ti }}
                </p>

                <router-link
                  :to="{ name: 'new-detail', params: { title: language === 'en' ? slugify(event.title.en) : slugify(event.title.ti) } }"
                  class="hover:text-meyla-color1 group-hover:text-white text-[#288FB2] transition-colors duration-500 self-end">
                  {{ $t('Read More') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>



<style>
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
