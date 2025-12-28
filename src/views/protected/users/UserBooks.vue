<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[#1d4354]">📚 My Books</h1>

      <input
        v-model="search"
        type="text"
        placeholder="Search book..."
        class="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#288FB2]"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-500">
      Loading books...
    </div>

    <!-- Empty -->
    <div v-else-if="filteredBooks.length === 0" class="text-center py-20 text-gray-500">
      No books found
    </div>

    <!-- Books grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="book in filteredBooks"
        :key="book.id"
        class="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border-l-4 border-[#288FB2]"
      >
        <h2 class="text-lg font-bold text-[#1d4354] mb-2">
          {{ book.title }}
        </h2>

        <p class="text-sm text-gray-600 mb-1">
          <strong>Author:</strong> {{ book.author || 'Unknown' }}
        </p>

        <p class="text-sm text-gray-600 mb-1">
          <strong>Grade:</strong> {{ book.Grade?.gradelevel || 'N/A' }}
        </p>

        <p class="text-sm text-gray-700 mb-4 line-clamp-3">
          {{ book.description || 'No description provided' }}
        </p>

        <div class="flex justify-between items-center">
          <button
            @click="openPdfModal(book)"
            class="px-4 py-2 bg-[#288FB2] text-white rounded hover:bg-[#1d6f8a]"
          >
            Read
          </button>

          <span class="text-xs text-gray-400">
            {{ formatDate(book.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- PDF Modal -->
    <div
      v-if="showPdfModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-4xl h-[80vh] rounded-xl p-4 relative">
        <button
          @click="closePdfModal"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        <iframe
          v-if="currentPdf"
          :src="BASE_UPLOAD + currentPdf"
          class="w-full h-full rounded"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BookService from '@/services/BookService'
import { BASE_UPLOAD } from '@/config'

const route = useRoute()

const books = ref([])
const loading = ref(false)
const search = ref('')

// PDF Modal
const showPdfModal = ref(false)
const currentPdf = ref(null)

// Get gradeId from query parameters
const gradeIdParam = ref(route.query.gradeId || null)

const fetchBooks = async () => {
  loading.value = true
  try {
    const res = await BookService.getUserBooks()
    books.value = res.data?.data || res.data || []

    // Apply gradeId filter if present
    if (gradeIdParam.value) {
      books.value = books.value.filter(
        (book) => book.gradeId === gradeIdParam.value
      )
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)

const filteredBooks = computed(() => {
  const baseBooks = books.value

  if (!search.value) return baseBooks

  return baseBooks.filter(
    (book) =>
      book.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      (book.author &&
        book.author.toLowerCase().includes(search.value.toLowerCase()))
  )
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

// Modal functions
const openPdfModal = (book) => {
  currentPdf.value = book.fileUrl
  showPdfModal.value = true
}

const closePdfModal = () => {
  showPdfModal.value = false
  currentPdf.value = null
}
</script>


<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
