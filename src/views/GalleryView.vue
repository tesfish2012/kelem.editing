<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import GalleryService from '@/services/GalleryService'
import { BASE_AVATAR } from '@/config'

const { language } = storeToRefs(useAuthStore())

// =========================
// State
// =========================
const galleries = ref([])
const showModal = ref(false)
const selectedIndex = ref(0)
const errorMessage = ref('')

// =========================
// Fetch gallery images
// =========================
const fetchGalleries = async () => {
  try {
    const response = await GalleryService.getAllGallery()
    if (response && response.data) {
      galleries.value = response.data.map(item => ({
        ...item,
        title: JSON.parse(item.title),
        description: JSON.parse(item.description)
      }))
    }
  } catch (error) {
    errorMessage.value = 'Failed to fetch gallery items'
  }
}

// =========================
// Modal Controls
// =========================
const openModal = (index) => {
  selectedIndex.value = index
  showModal.value = true
}

const nextImage = () => {
  selectedIndex.value = (selectedIndex.value + 1) % galleries.value.length
}

const prevImage = () => {
  selectedIndex.value =
    (selectedIndex.value - 1 + galleries.value.length) % galleries.value.length
}

onMounted(fetchGalleries)
</script>

<template>
  <section class="w-full py-12 bg-gray-50">
    <div class="flex justify-center w-full items-center bg-[#ECF71B] py-4 rounded-lg mb-8">
      <h1 class="text-2xl font-bold text-white">{{ $t('Gallery') }}</h1>
    </div>

    <div v-if="errorMessage" class="text-red-500 text-center py-2">{{ errorMessage }}</div>

    <!-- Grid Gallery -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-[2%] md:px-[5%]">
      <div
        v-for="(gallery, index) in galleries"
        :key="gallery.id"
        class="relative group cursor-pointer rounded overflow-hidden shadow"
        @click="openModal(index)"
        data-aos="fade-up"
      >
        <img
          :src="BASE_AVATAR + gallery.gallery"
          class="w-full h-64 object-cover rounded-md transition-transform duration-300 hover:scale-105"
        />

        <div
          class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 opacity-0 
                 group-hover:opacity-100 transition-opacity duration-300"
        >
          <p class="font-semibold">{{ language === 'en' ? gallery.title.en : gallery.title.ti }}</p>
          <p class="text-xs">{{ language === 'en' ? gallery.description.en : gallery.description.ti }}</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white p-6 rounded-lg max-w-4xl w-full relative shadow-lg">

        <!-- Close -->
        <button
          @click="showModal = false"
          class="absolute top-3 right-3 bg-gray-200 px-3 py-1 rounded text-lg"
        >
          <font-awesome-icon icon="times" />
        </button>

        <!-- Image -->
        <div class="relative">
          <img
            :src="BASE_AVATAR + galleries[selectedIndex].gallery"
            class="max-h-[70vh] mx-auto object-contain rounded w-full"
          />

          <!-- Caption -->
          <div
            class="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 backdrop-blur-sm rounded-b-lg"
          >
            <h2 class="text-xl font-bold">{{ language === 'en' ? galleries[selectedIndex].title.en : galleries[selectedIndex].title.ti }}</h2>
            <p class="text-sm mt-1">{{ language === 'en' ? galleries[selectedIndex].description.en : galleries[selectedIndex].description.ti }}</p>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between mt-6">
          <button
            @click="prevImage"
            class="px-6 py-2 bg-gray-100 rounded shadow hover:bg-gray-200"
          >
            <font-awesome-icon icon="chevron-left" />
          </button>
          <button
            @click="nextImage"
            class="px-6 py-2 bg-gray-100 rounded shadow hover:bg-gray-200"
          >
            <font-awesome-icon icon="chevron-right" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional fade animations for modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
