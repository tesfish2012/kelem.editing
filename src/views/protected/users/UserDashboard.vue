<template>
  <div class="p-4">

    <h2 class="text-2xl font-bold text-gray-700 mb-6">
      Select Your Grade
    </h2>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-gray-600">
      Loading grades...
    </div>

    <!-- Cards Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="grade in grades"
        :key="grade.id"
        @click="openBooks(grade.id)"
        class="cursor-pointer bg-white shadow-md rounded-xl p-6 border
               hover:shadow-xl hover:-translate-y-1 transition-all duration-200
               flex flex-col items-center text-center"
      >
        <div class="w-16 h-16 bg-[#288FB2] text-white flex items-center justify-center rounded-full shadow">
          <font-awesome-icon :icon="['fas', 'layer-group']" class="text-2xl" />
        </div>

        <h3 class="mt-4 text-xl font-semibold text-gray-800">
          Grade {{ grade.gradeLevel }}
        </h3>

        <p class="text-gray-500 text-sm mt-1">
          Click to view available books
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import GradeService from "@/services/GradeService"
import Swal from "sweetalert2"

const router = useRouter()

const grades = ref([])
const loading = ref(true)

const fetchGrades = async () => {
  try {
    const res = await GradeService.getAllGrades()
    grades.value = res.data || []
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to load grades"
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchGrades)

// Go to books by grade
const openBooks = (gradeId) => {
  router.push({
    name: "user-books",
    query: { gradeId }
  })
}
</script>

<style scoped>
</style>
