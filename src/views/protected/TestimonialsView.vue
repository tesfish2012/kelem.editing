<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import TestimonialsService from '@/services/TestimonialsService'
import { BASE_AVATAR } from '@/config'

import swal from 'sweetalert'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())
const router = useRouter()
const testimonial = ref({
  fullName: { en: '', ti: '' },
  profession: { en: '', ti: '' },
  description: { en: '', ti: '' },
  avatar: null
})

const testimonials = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const saveTestimonial = async () => {
  const formData = new FormData()
  formData.append('fullName', JSON.stringify(testimonial.value.fullName))
  formData.append('profession', JSON.stringify(testimonial.value.profession))
  formData.append('description', JSON.stringify(testimonial.value.description))
  if (testimonial.value.avatar) {
    formData.append('avatar', testimonial.value.avatar)
  }

  try {
    const response = await TestimonialsService.createOrUpdateTestimonial(
      formData,
      editMode.value ? editId.value : ''
    )
    if (response.success) {
      successMessage.value = response.message
            swal({
        title: response.message,
        icon: 'success',
      })
      fetchTestimonials()
      resetForm()
      closeModal()
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
function goToTrash(){
  router.push("testimonials/trashed")
}
const captureImage = (event) => {
  testimonial.value.avatar = event.target.files[0]
}

const fetchTestimonials = async () => {
  try {
    const response = await TestimonialsService.getAllTestimonials()
    testimonials.value = response.data.map((item) => ({
      ...item,
      fullName: JSON.parse(item.fullName),
      profession: JSON.parse(item.profession),
      description: JSON.parse(item.description)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch testimonials'
  }
}

const editItem = (id) => {
  const item = testimonials.value.find((test) => test.id === id)
  if (item) {
    testimonial.value = {
      fullName: { en: item.fullName.en, ti: item.fullName.ti },
      profession: { en: item.profession.en, ti: item.profession.ti },
      description: { en: item.description.en, ti: item.description.ti },
      avatar: null
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await TestimonialsService.deleteTestimonial(id)
      if (response.success) {
        successMessage.value = response.message
        fetchTestimonials()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete testimonial'
    }
  }
}

const resetForm = () => {
  testimonial.value = {
    fullName: { en: '', ti: '' },
    profession: { en: '', ti: '' },
    description: { en: '', ti: '' },
    avatar: null
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const searchTestimonial = ref('')
const filteredTestimonials = computed(() => {
  if (searchTestimonial.value) {
    return testimonials.value.filter((testimonial) =>
      Object.values(testimonial).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchTestimonial.value.toLowerCase())
      )
    )
  } else {
    return testimonials.value
  }
})

onMounted(() => {
  fetchTestimonials()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{$t('Testimonials')}}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchTestimonial"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>  
        <BaseButton @click="goToTrash" class="p-0 w-full"> trashed </BaseButton>
        <BaseButton @click="showModal = true" class="p-0 w-full">
          {{$t('Add')}} 
        </BaseButton>
      </div>
    </div>
    <div v-if="testimonials.length" class="col-span-12 w-full">
      <!-- <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div> -->

      <div class="w-full mx-auto mt-8">
        <!-- <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div> -->

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="testimonial in filteredTestimonials" :key="testimonial.id" class="w-full">
            <div class="shadow p-4">
              <img
                v-if="testimonial.avatar"
                :src="`${BASE_AVATAR}${testimonial.avatar}`"
                alt="Testimonial Avatar"
                class="w-full h-36 object-cover "
              />
              <div v-if="language === 'en'">
                <h3 class="font-bold">{{ testimonial.fullName.en }}</h3>
                <p>{{ testimonial.profession.en }}</p>
                <p>{{ testimonial.description.en }}</p>
              </div>
              <div v-else>
                <h3 class="font-bold">{{ testimonial.fullName.ti }}</h3>
                <p>{{ testimonial.profession.ti }}</p>
                <p>{{ testimonial.description.ti }}</p>
              </div>

              <div class="flex justify-end space-x-2">
                <button @click="editItem(testimonial.id)" class="text-blue-500">Edit</button>
                <button @click="deleteItem(testimonial.id)" class="text-red-500">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed min-h-screen inset-0 py-4 bg-black/70 modal z-50 flex justify-center items-center"
    >
      <div class="bg-white rounded-lg shadow-lg h-full overflow-auto w-full max-w-md p-4">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Testimonial' : 'Add Testimonial' }}
          </h3>
          <div class="w-full h-full">
            <form @submit.prevent="saveTestimonial" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="testimonial.fullName.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Full Name (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="testimonial.fullName.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Full Name (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="testimonial.profession.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Profession (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="testimonial.profession.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Profession (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseTextarea
                    v-model="testimonial.description.en"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Description (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseTextarea
                    v-model="testimonial.description.ti"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Description (Tigrinya)"
                  ></BaseTextarea>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseInput type="file" @change="captureImage" />
                </div>
              </div>
              <div class="flex justify-center  space-x-2">
                <BaseButton type="button" @click="closeModal"  class="bg-gray-500 text-white px-4 py-2 rounded">Cancel</BaseButton>
                <BaseButton type="submit">{{ editMode ? 'Update' : 'Save' }}</BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
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

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>













