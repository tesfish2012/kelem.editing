<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[#1d4354]">
        <font-awesome-icon icon="book-open" class="text-[#288FB2] mr-2" />
        Book Management
      </h1>

      <button
        @click="openAddModal"
        class="px-5 py-2 bg-[#288FB2] text-white rounded hover:bg-[#1d6f8a]"
      >
        + Add Book
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-500">
      Loading books...
    </div>

    <!-- Books Table -->
    <div v-else class="bg-white shadow rounded-xl overflow-hidden">
      <table class="min-w-full border-collapse">
        <thead class="bg-[#288FB2] text-white">
          <tr>
            <th class="px-4 py-3 text-left">Title</th>
            <th class="px-4 py-3 text-left">Author</th>
            <th class="px-4 py-3 text-left">Grade</th>
            <th class="px-4 py-3 text-left">File</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="book in books"
            :key="book.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-3 font-medium">{{ book.title }}</td>
            <td class="px-4 py-3">{{ book.author || 'N/A' }}</td>
            <td class="px-4 py-3">{{ book.Grade?.gradelevel }}</td>
            <td class="px-4 py-3">
              <a
                :href="BASE_UPLOAD + book.fileUrl"
                target="_blank"
                class="text-[#288FB2] underline"
              >
                View
              </a>
            </td>

            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="openEditModal(book)"
                class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                @click="deleteBook(book.id)"
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FORM MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">

        <h2 class="text-xl font-bold mb-5 text-[#1d4354]">
          {{ isEdit ? 'Edit Book' : 'Add Book' }}
        </h2>

        <div class="space-y-4">

          <input
            v-model="form.title"
            type="text"
            placeholder="Book Title"
            class="w-full border px-4 py-2 rounded focus:ring-[#288FB2]"
          />

          <input
            v-model="form.author"
            type="text"
            placeholder="Author"
            class="w-full border px-4 py-2 rounded focus:ring-[#288FB2]"
          />

          <textarea
            v-model="form.description"
            placeholder="Description"
            class="w-full border px-4 py-2 rounded focus:ring-[#288FB2]"
            rows="3"
          ></textarea>

          <select
            v-model="form.gradeId"
            class="w-full border px-4 py-2 rounded focus:ring-[#288FB2]"
          >
            <option value="">Select Grade</option>
            {{ grades }}
            <option
              v-for="grade in grades"
              :key="grade.id"
              :value="grade.id"
            >
             Grade {{ grade.gradeLevel }}
            </option>
          </select>

          <!-- File Upload -->
          <div>
            <label class="block mb-1 font-medium text-gray-700">Upload File</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="w-full border px-4 py-2 rounded focus:ring-[#288FB2]"
            />
            <span v-if="form.fileName" class="text-sm text-gray-500">{{ form.fileName }}</span>
          </div>

        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex justify-end mt-6 space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            @click="saveBook"
            class="px-6 py-2 bg-[#288FB2] text-white rounded hover:bg-[#1d6f8a]"
          >
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookService from '@/services/BookService'
import GradeService from '@/services/GradeService'
import {BASE_UPLOAD} from '@/config';
const books = ref([])
const grades = ref([])
const loading = ref(false)

const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = ref({
  title: '',
  author: '',
  description: '',
  gradeId: '',
  file: null,
  fileName: ''
})

const fetchBooks = async () => {
  loading.value = true
  try {
    const res = await BookService.getAllBooks()
    books.value = res.data.data || res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchGrades = async () => {
  try {
    const res = await GradeService.getAllGrades()
    grades.value = res.data || res.data
  } catch (err) {
    console.error(err)
  }
}

const handleFileUpload = (e) => {
  form.value.file = e.target.files[0]
  form.value.fileName = e.target.files[0]?.name || ''
}

const openAddModal = () => {
  isEdit.value = false
  currentId.value = null
  form.value = { title:'', author:'', description:'', gradeId:'', file:null, fileName:'' }
  showModal.value = true
}

const openEditModal = (book) => {
  isEdit.value = true
  currentId.value = book.id
  form.value = {
    title: book.title,
    author: book.author,
    description: book.description,
    gradeId: book.gradeId,
    file: null,
    fileName: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveBook = async () => {
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('author', form.value.author)
    formData.append('description', form.value.description)
    formData.append('gradeId', form.value.gradeId)
    if (form.value.file) {
      formData.append('fileUrl', form.value.file)
    }

    if (isEdit.value) {
      await BookService.updateBook(currentId.value, formData)
    } else {
      await BookService.createBook(formData)
    }

    closeModal()
    fetchBooks()
  } catch (err) {
    console.error(err)
  }
}

const deleteBook = async (id) => {
  if (!confirm('Are you sure?')) return
  try {
    await BookService.deleteBookById(id)
    fetchBooks()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchBooks()
  fetchGrades()
})
</script>
