<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import NewsService from '@/services/NewsService'
import { BASE_AVATAR } from '@/config'
import { useRouter } from 'vue-router'

import swal from 'sweetalert'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

const news = ref({
  title: { en: '', ti: '' },
  body: { en: '', ti: '' },
  date: '',
  category: { en: '', ti: '' },
  image: null
})
const router = useRouter()
const events = ref([])
const successMessage = ref('')
const errorMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const imageName = ref('')
const captureImage = (event) => {
  news.value.image = event.target.files[0]
  imageName.value = event.target.files[0]?.name || ''
}
function goToTrash(){
  router.push("news/trashed")
}

const allEvents = async () => {
  try {
    const response = await NewsService.getAllNews()
    if (response.success) {
      events.value = response.data.map((item) => ({
        ...item,
        title: JSON.parse(item.title),
        body: JSON.parse(item.body),
        category: JSON.parse(item.category)
      }))
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data) {
      errorMessage.value = error.response.data.message
    }
  }
}

const saveEvent = async () => {
  const formData = new FormData()
  formData.append('title', JSON.stringify(news.value.title))
  formData.append('body', JSON.stringify(news.value.body))
  formData.append('date', news.value.date)
  formData.append('category', JSON.stringify(news.value.category))
  if (news.value.image) {
    formData.append('image', news.value.image)
  }

  try {
    const response = await NewsService.requestNew(editMode.value ? editId.value : '', formData)
    if (response.success) {
      successMessage.value = response.message
            swal({
        title: response.message,
        icon: 'success',
      })
      allEvents()
      resetForm()
      closeModal()
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    }
  }
}

const searchNews = ref('')
const filteredNews = computed(() => {
  if (searchNews.value) {
    return events.value.filter((event) =>
      Object.values(event).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchNews.value.toLowerCase())
      )
    )
  } else {
    return events.value
  }
})

const resetForm = () => {
  news.value = {
    title: { en: '', ti: '' },
    body: { en: '', ti: '' },
    date: '',
    category: { en: '', ti: '' },
    image: null
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const editEvent = (id) => {
  const item = events.value.find((ach) => ach.id === id)
  if (item) {
    news.value = {
      title: { en: item.title.en, ti: item.title.ti },
      body: { en: item.body.en, ti: item.body.ti },
      category: { en: item.category.en, ti: item.category.ti },
      date: item.date,
      image: null
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteEvent = async (id) => {
  try {
    const sure = window.confirm('Are you sure? This operation cannot be undone.')
    if (sure) {
      const response = await NewsService.deleteNewById(id)
      if (response.success) {
        successMessage.value = response.message
        allEvents()
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    }
  }
}

onMounted(() => {
  allEvents()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{$t('News List')}}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchNews"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="goToTrash" class="p-0 w-full"> trashed </BaseButton>
        <BaseButton @click="showModal = true" class="p-0 w-full"> {{ $t('Add') }} </BaseButton>
      </div>
    </div>
    <div class="w-full flex flex-col bg-white">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="Event in filteredNews" :key="Event.id" class="bg-white p-2">
        <div class="flex flex-col gap-2">
          <div class="w-full h-[140px] relative">
            <img
              v-if="Event.image"
              :src="`${BASE_AVATAR}${Event.image}`"
              alt="Event image"
              width="100px"
              height="100px"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-0 bg-[#288fb2] text-white px-2 py-1">
              {{ language === 'en' ? Event.category.en : Event.category.ti }}
            </div>
          </div>

          <div class="flex  justify-centerz items-center gap-1">
            <font-awesome-icon icon="calendar-alt"></font-awesome-icon>
            <p>{{ Event.date }}</p>
          </div>

          <div class="w-full">
            <h1 class="font-semibold">{{ language === 'en' ? Event.title.en : Event.title.ti }}</h1>
            <p class="text-sm whitespace-normal break-all">
              {{ language === 'en'? Event.body.en : Event.body.ti }}
            </p>
          </div>
        </div>

        <div class="flex gap-8">
          <button class="text-blue-500" @click="editEvent(Event.id)">
            Edit</button>
          <button class="text-red-500" @click="deleteEvent(Event.id)">Delete</button>
        </div>
      </div>
    </div>

    </div>
  </section>

  <div v-if="showModal" class="fixed min-h-screen inset-0 py-4 bg-black/70 modal z-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg h-full overflow-auto w-full max-w-md p-4">
      <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editMode ? 'Edit New' : 'Add New' }}
        </h3>
        <div class="w-full h-full">
          <form @submit.prevent="saveEvent" class="flex flex-col gap-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="news.title.en"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Title (English)"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="news.title.ti"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Title (Tigrinya)"
                ></BaseInput>
              </div>
              <div class="w-full px-2 mb-4">
                <BaseInput
                  v-model="news.date"
                  type="date"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Date"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="news.category.en"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Category (English)"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="news.category.ti"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Category (Tigrinya)"
                ></BaseInput>
              </div>
              <div class="w-full px-2 mb-4">
                <BaseTextarea
                  v-model="news.body.en"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (English)"
                ></BaseTextarea>
              </div>
              <div class="w-full px-2 mb-4">
                <BaseTextarea
                  v-model="news.body.ti"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (Tigrinya)"
                ></BaseTextarea>
              </div>
              <div class="w-full px-2 mb-4">
                <BaseInput
                  @change="captureImage"
                  type="file"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Image"
                ></BaseInput>
                <div v-if="imageName">{{ imageName }}</div>
              </div>
            </div>
            <div class="flex justify-center gap-6">
              <BaseButton
                @click="closeModal"
                type="button"
                class="bg-gray-500 text-white px-4 py-2 rounded"
                >Cancel</BaseButton
              >
              <BaseButton type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">{{
                editMode ? 'Update' : 'Save'
              }}</BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  animation: modal 0.3s;
}

@keyframes modal {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
