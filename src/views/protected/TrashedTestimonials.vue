<script setup>
import { ref, onMounted } from 'vue'
import TestimonialsService from '@/services/TestimonialsService'
import { BASE_AVATAR } from '@/config'
import { useRouter } from "vue-router"

const testimonials = ref([])
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

const fetchTestimonials = async () => {
  try {
    const response = await TestimonialsService.getAllTrashedTestimonials()
    testimonials.value = response.data.map((item) => ({
      ...item,
      fullName: JSON.parse(item.fullName),
      profession: JSON.parse(item.profession),
      description: JSON.parse(item.description)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch news'
  }
}

const deleteTrashedTestimonials = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await TestimonialsService.deleteTrashedTestimonials(id)
      if (response.success) {
        successMessage.value = response.message
        fetchTestimonials()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete news'
    }
  }
}

const restoreTrashedTestimonials = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await TestimonialsService.restoreTrashedTestimonials(id)
      if (response.success) {
        successMessage.value = response.message
        fetchTestimonials()
      }
    } catch (error) {
      errorMessage.value = 'Failed to restore Testimonials'
    }
  }
}

onMounted(() => {
  fetchTestimonials()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex w-full space-x-4">
      <font-awesome-icon size="20" @click="goBack()" icon="chevron-left" class="bg-white rounded mt-2 " />
      <h2 class="flex text-xl font-bold"> Trashed testimonials</h2>
    </div>
    <div v-if="testimonials.length" class="col-span-12 w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="w-full mx-auto mt-8">
        <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="flex justify-center">
            <div class="shadow p-4 bg-white rounded-lg w-full">
              <img
                v-if="testimonial.avatar"
                :src="`${BASE_AVATAR}${testimonial.avatar}`"
                alt="News avatar"
                class="w-24 h-24 object-cover mb-4"
              />
              <div class="mb-2">
                <h3 class="font-bold">
                  {{ showEnglish ? testimonial.fullName.en : testimonial.fullName.ti }}
                </h3>
              </div>
              <div class="flex flex-col gap-2">
                <p>
                  {{ showEnglish ? testimonial.profession.en : testimonial.profession.ti }}
                </p>
                <p>
                  {{ showEnglish ? testimonial.description.en : testimonial.description.ti }}
                </p>
              </div>
              <div class="flex justify-end gap-2">
                <button @click="restoreTrashedTestimonials(testimonial.id)" class="text-blue-500 hover:text-blue-700 px-2 py-1">
                  Restore
                </button>
                <button @click="deleteTrashedTestimonials(testimonial.id)" class="text-red-500 hover:text-red-700 px-2 py-1">
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

