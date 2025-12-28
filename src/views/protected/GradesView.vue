<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[#1d4354]">
        <font-awesome-icon icon="layer-group" class="text-[#288FB2] mr-2" />
        Grade Management
      </h1>

      <button
        @click="openAddModal"
        class="px-5 py-2 bg-[#288FB2] text-white rounded hover:bg-[#1d6f8a]"
      >
        + Add Grade
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-500">
      Loading grades...
    </div>

    <!-- Grades Table -->
    <div v-else class="bg-white shadow rounded-xl overflow-hidden">
      <table class="min-w-full border-collapse">
        <thead class="bg-[#288FB2] text-white">
          <tr>
            <th class="px-4 py-3 text-left">Grade Level</th>
            <th class="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="grade in grades"
            :key="grade.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-3 font-medium">
              Grade {{ grade.gradeLevel }}
            </td>

            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="openEditModal(grade)"
                class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                @click="deleteGrade(grade.id)"
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
      <div class="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">

        <h2 class="text-xl font-bold mb-5 text-[#1d4354]">
          {{ isEdit ? 'Edit Grade' : 'Add Grade' }}
        </h2>

        <div class="space-y-4">

          <!-- Grade Level -->
          <input
            v-model="form.gradeLevel"
            type="number"
            placeholder="Grade Level (e.g., 1, 2, 3...)"
            class="w-full border px-4 py-2 rounded focus:ring-[#288FB2]"
          />

 

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
            @click="saveGrade"
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
import Swal from 'sweetalert2'
import GradeService from '@/services/GradeService'

const grades = ref([])
const loading = ref(false)

const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = ref({
  gradeLevel: '',
})

/* ===============================
        FETCH GRADES
================================*/
const fetchGrades = async () => {
  loading.value = true
  try {
    const res = await GradeService.getAllGrades()
    grades.value = res.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

/* ===============================
        MODAL CONTROLS
================================*/
const openAddModal = () => {
  isEdit.value = false
  currentId.value = null
  form.value = { gradeLevel: '' }
  showModal.value = true
}

const openEditModal = (grade) => {
  isEdit.value = true
  currentId.value = grade.id

  form.value = {
    gradeLevel: grade.gradeLevel
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

/* ===============================
        SAVE GRADE
================================*/
const saveGrade = async () => {
  if (!form.value.gradeLevel) {
    return Swal.fire("Oops!", "Grade level is required", "warning")
  }

  try {
    if (isEdit.value) {
      await GradeService.updateGrade(currentId.value, form.value)
      Swal.fire("Success!", "Grade updated successfully", "success")
    } else {
      await GradeService.createGrade(form.value)
      Swal.fire("Success!", "Grade created successfully", "success")
    }

    closeModal()
    fetchGrades()

  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error")
  }
}

/* ===============================
        DELETE GRADE
================================*/
const deleteGrade = async (id) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This grade will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Delete"
  })

  if (!confirm.isConfirmed) return

  try {
    await GradeService.deleteGradeById(id)
    Swal.fire("Deleted!", "Grade has been removed.", "success")
    fetchGrades()
  } catch (err) {
    Swal.fire("Error", "Deletion failed", "error")
  }
}

onMounted(fetchGrades)
</script>
