<script setup>
// import SpinningCard from '@/components/open/SpinningCard.vue'
import slugify from '@/utils/slugify'
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import NewsService from '@/services/NewsService'
import { BASE_AVATAR } from '@/config'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const event = ref({})

async function getNew() {
  try {
    const response = await NewsService.getNewByTitle(route.params.title)
    if (response.success) {
      event.value = response.data
      event.value.title = JSON.parse(event.value.title)
      event.value.body = JSON.parse(event.value.body)
      event.value.title = JSON.parse(event.value.title)
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

function formattedDate(date) {
  return dayjs(date).locale('en').format('MMMM D, YYYY')
}

const news = ref([])
const events = ref([])
async function getNews() {
  try {
    const response = await NewsService.getAllNews()
    if (response.success) {
      events.value = response.data.map((item) => ({
        ...item,
        title: JSON.parse(item.title),
        category: JSON.parse(item.category),
        body: JSON.parse(item.body)
      }))
      news.value = events.value.length > 3 ? events.value.splice(0, 3) : events.value
    }
    // news.value = response.data.length > 3 ? response.data.splice(0, 3) : response.data
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
    getNew()
  }
})
onMounted(getNews(), getNew())
</script>
<template>
  <section class="w-full bg-[#288fb2]/10">
    <div class="flex justify-center py-12 px-[1%]">
      <div class="relative w-full md:w-[60%] flex flex-col items-center justify-center group">
        <div class="w-full max-h-[600px] overflow-hiddden">
          <img
            v-if="event.image"
            :src="BASE_AVATAR + `${event.image}`"
            alt="My company"
            class="w-full h-full object-cover object-top block"
            loading="lazy"
          />
        </div>

        <div class="flex flex-col gap-1 py-2 bg-white translation-all duration-1000 px-4 relative">
          <div class="flex flex-col gap-1 py-2">
            <!-- <p>{{ event }}</p> -->
            <!-- <p>{{ language }}</p> -->
            <h2 class="meyla-subtitle whitespace-normal break-all text-[#288FB2]">
             {{ language === 'en' ? events[0]?.title.en : events[0]?.title.ti }}
            </h2>
            <div class="flex gap-2 text-gray-400">
              <h1 class="">
                {{ formattedDate(event.eventDate) }}
              </h1>
              <p>{{ $t('By') }} {{ event.publisher }}</p>
              <!-- <h3>By <span>meyla admin</span></h3> -->
            </div>
            <p class="text-gray-700 selection:bg-[#288FB2] selection:text-white">
              <span> </span>  {{ language === 'en' ? events[0]?.body.en : events[0]?.body.ti }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <section
      class="w-full px-[1%] md:px-[10%] py-4 md:py-12 news bg-white flex flex-col items-center justify-center gap-6"
    >
      <div class="flex flex-col justify-center items-center gap-4 bg-[#288fb2]/10 p-6">
        <div class="flex flex-col items-center justify-center">
          <h1 class="text text-xl md:text-4xl font-semibold">Latest News</h1>
          <hr class="w-3/4 bg-[#288FB2] h-[2px]" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(event, index) in news"
            :key="index"
            data-aos="fade-upx"
            class="relative group bg-white/100x border rounded bg-white"
          >
            <router-link :to="{ name: 'new-detail', params: { title: language === 'en' ? slugify(events[0].title.en) : slugify(events[0].title.ti) } }" class="block">
              <div class="w-full h-[160px] p-1">
                <img
                  :src="BASE_AVATAR + `${event.image}`"
                  alt="My company"
                  class="w-full h-full object-cover object-top block"
                  loading="lazy"
                />
              </div>
            </router-link>
            <div
              class="flex flex-col gap-2 py-6 group-hover:shadow-lg group-hover:bg-white translation-all duration-1000 px-4 relative"
            >
              <div class="flex flex-col gap-2 py-2">
                <router-link
                  class="text-lgx whitespace-normal break-all hover:text-[#288FB2] text-meyla-color1 line-clamp-2"
                  :to="{ name: 'new-detail', params: { title: language === 'en' ? slugify(events[0].title.en) : slugify(events[0].title.ti)  } }"
                  >{{ language === 'en' ? events[0]?.title.en : events[0]?.title.ti }}inhale confidence exhale doubtinhale confidence exhale
                  doubtinhale confidence exhale doubt</router-link
                >

                <h4 class="text-[#001F3F]X text-[#87CEFA]"> {{ language === 'en' ? events[0]?.category.en : events[0]?.category.ti }}</h4>
              </div>
            </div>
          </div>
        </div>
        <router-link :to="{ name: 'news' }" class="text text-lgx hover:text-[#288FB2] font-semibold"
          >VIEW ALL NEWS</router-link
        >
      </div>
    </section>
  </section>
</template>
