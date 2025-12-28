<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import GalleryService from '@/services/GalleryService'
import { BASE_AVATAR } from '@/config'

const router = useRouter()

const gallery = ref({
  title: { en: '', ti: '' },
  description: { en: '', ti: '' },
  gallery: null // Changed to hold a file object
})

const galleries = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const showEnglish = ref(true)

const toggleLanguage = () => {
  showEnglish.value = !showEnglish.value
}

const saveGallery = async () => {
  const formData = new FormData()
  formData.append('title', JSON.stringify(gallery.value.title))
  formData.append('description', JSON.stringify(gallery.value.description))
  if (gallery.value.gallery) {
    formData.append('gallery', gallery.value.gallery)
  }

  try {
    const response = await GalleryService.createOrUpdateGallery(editMode.value ? editId.value : '', formData)
    if (response.success) {
      successMessage.value = response.message
      fetchGalleries() // Refresh the list after adding/updating a gallery item
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

const captureImage = (event) => {
  gallery.value.gallery = event.target.files[0]
}

const fetchGalleries = async () => {
  try {
    const response = await GalleryService.getAllGallery()
    galleries.value = response.data.map(item => ({
        ...item,
        title: JSON.parse(item.title),
        description: JSON.parse(item.description),
      }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch gallery items'
  }
}

const editItem = (id) => {
  const item = galleries.value.find(gal => gal.id === id)
  if (item) {
    gallery.value = { 
      title: { en: item.title.en, ti: item.title.ti },
      description: { en: item.description.en, ti: item.description.ti },
      gallery: null 
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
    const response = await GalleryService.deleteGalleryById(id)
    if (response.success) {
      successMessage.value = response.message
      fetchGalleries() // Refresh the list after deleting a gallery item
    }
  } catch (error) {
    errorMessage.value = 'Failed to delete gallery item'
  }
}
}

const resetForm = () => {
  gallery.value = {
    title: { en: '', ti: '' },
    description: { en: '', ti: '' },
    gallery: null
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  fetchGalleries()
})
</script>


<template>
  <section class="w-full py-12 grid grid-cols-1 md:grid-cols-12 gap-2 place-items-start bg-white p-2 relative">
    <div v-if="galleries.length" class="col-span-12 w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="w-full mx-auto mt-8">
        <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <h2 class="text-xl font-bold mb-4">Gallery</h2>
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div>

        <div class="flex flex-wrap -mx-2">
          <div
            v-for="item in galleries"
            :key="item.id"
            class="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4"
          >
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-bold">{{ showEnglish ? item.title.en : item.title.ti }}</h3>
              <p>{{ showEnglish ? item.description.en : item.description.ti }}</p>
              <img
                v-if="item.gallery"
                :src="`${BASE_AVATAR}${item.gallery}`"
                alt="Gallery Image"
                class="w-24 h-24 object-cover mb-4"
              />
              <div class="flex justify-end space-x-2">
                <button @click="editItem(item.id)" class="text-blue-500">Edit</button>
                <button @click="deleteItem(item.id)" class="text-red-500">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <BaseButton  
      @click="showModal = true" 
      class="fixed top-16 pt-4 right-4 bg-green-600 text-white px-2 py-1 rounded">
      Add Gallery 
    </BaseButton>

    <div v-if="showModal" class=" fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">{{ editMode ? 'Edit Gallery Item' : 'Add Gallery Item' }}</h3>
          <div class="mt-4">
            <form @submit.prevent="saveGallery" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="gallery.title.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Title (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="gallery.title.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Title (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="gallery.description.en"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Description (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="gallery.description.ti"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Description (Tigrinya)"
                  ></BaseTextarea>
                </div>
                <div class="w-full  px-2 mb-4">
                  <BaseInput
                    @change="captureImage"
                    type="file"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Gallery Image"
                  ></BaseInput>
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <BaseButton @click="closeModal" type="button" class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</BaseButton>
                <BaseButton type="submit" class="bg-[#37a000] text-white px-2 py-2 rounded">{{ editMode ? 'Save changes' : 'Save Gallery Item' }}</BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
