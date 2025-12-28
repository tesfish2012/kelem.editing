<script setup>
import { ref, onMounted } from 'vue'
import NewsService from '@/services/NewsService'
import { BASE_AVATAR } from '@/config'
import { useRouter } from "vue-router"

const news = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const showEnglish = ref(true)
const router = useRouter()

const toggleLanguage = () => {
  showEnglish.value = !showEnglish.value
}

function goBack() {
  router.back()
}

const fetchNews = async () => {
  try {
    const response = await NewsService.getAllTrashedNews()
    news.value = response.data.map((item) => ({
      ...item,
      title: JSON.parse(item.title),
      category: JSON.parse(item.category),
      body: JSON.parse(item.body)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch news'
  }
}

const deleteTrashedNews = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await NewsService.deleteTrashedNews(id)
      if (response.success) {
        successMessage.value = response.message
        fetchNews()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete news'
    }
  }
}

const restoreTrashedNews = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await NewsService.restoreTrashedNews(id)
      if (response.success) {
        successMessage.value = response.message
        fetchNews()
      }
    } catch (error) {
      errorMessage.value = 'Failed to restore news'
    }
  }
}

onMounted(() => {
  fetchNews()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex w-full space-x-4">
      <font-awesome-icon size="20" @click="goBack()" icon="chevron-left" class="bg-white rounded mt-2 " />
      
      <h2 class="flex text-xl font-bold"> Trashed News</h2>
    </div>
    <div v-if="news.length" class="col-span-12 w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="w-full mx-auto mt-8">
        <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="newsItem in news" :key="newsItem.id" class="flex justify-center">
            <div class="shadow p-4 bg-white rounded-lg w-full">
              <img
                v-if="newsItem.image"
                :src="`${BASE_AVATAR}${newsItem.image}`"
                alt="News Image"
                class="w-24 h-24 object-cover mb-4"
              />
              <div class="mb-2">
                <h3 class="font-bold">
                  {{ showEnglish ? newsItem.title.en : newsItem.title.ti }}
                </h3>
              </div>
              <div class="flex flex-col gap-2">
                <p>
                  {{ showEnglish ? newsItem.category.en : newsItem.category.ti }}
                </p>
                <p>
                  {{ showEnglish ? newsItem.body.en : newsItem.body.ti }}
                </p>
              </div>
              <div class="flex justify-end gap-2">
                <button @click="restoreTrashedNews(newsItem.id)" class="text-blue-500 hover:text-blue-700 px-2 py-1">
                  Restore
                </button>
                <button @click="deleteTrashedNews(newsItem.id)" class="text-red-500 hover:text-red-700 px-2 py-1">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center text-3xl">
      There is no trashed data
    </div>
  </section>
</template>


