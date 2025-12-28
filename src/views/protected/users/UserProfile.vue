<template>
  <div class="max-w-4xl mx-auto">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[#1d4354]">👤 My Profile</h1>

      <button
        @click="toggleEdit"
        class="px-4 py-2 bg-[#288FB2] text-white rounded hover:bg-[#1d6f8a]"
      >
        {{ editMode ? 'Cancel' : 'Edit Profile' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-500 py-20">
      Loading profile...
    </div>

    <div v-else class="bg-white rounded-xl shadow-md p-6 space-y-6">

      <!-- Student Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Student ID -->
        <div>
          <label class="block text-sm font-semibold mb-1">Student ID</label>
          <input
            type="text"
            :value="student.studentId"
            disabled
            class="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        <!-- Grade -->
        <div>
          <label class="block text-sm font-semibold mb-1">Grade</label>
          <input
            type="text"
            :value="student?.Grade?.name || 'N/A'"
            disabled
            class="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-semibold mb-1">Full Name</label>
          <input
            type="text"
            v-model="form.name"
            :disabled="!editMode"
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#288FB2]"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            v-model="form.email"
            :disabled="!editMode"
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#288FB2]"
          />
        </div>

      </div>

      <!-- Update Button -->
      <div v-if="editMode" class="flex justify-end">
        <button
          @click="updateProfile"
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StudentService from '@/services/StudentService'

const authStore = useAuthStore()
const loading = ref(false)
const editMode = ref(false)

const student = ref({})
const form = ref({
  name: '',
  email: ''
})

const fetchProfile = async () => {
    
  loading.value = true
  try {
    const id = authStore.user?.id
    const res = await StudentService.getStudentById(id)

    student.value = res.data.data || res.data
    form.value = {
      name: student.value.name,
      email: student.value.email
    }
  } catch (err) {
    console.error('Error loading profile:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)

const toggleEdit = () => {
  editMode.value = !editMode.value
  if (!editMode.value) {
    // Reset form when cancel
    form.value = {
      name: student.value.name,
      email: student.value.email
    }
  }
}

const updateProfile = async () => {
  try {
    const id = student.value.id
    await StudentService.updateStudent(id, {
      name: form.value.name,
      email: form.value.email
    })

    student.value = { ...student.value, ...form.value }
    editMode.value = false
  } catch (err) {
    console.error('Error updating profile:', err)
  }
}
</script>

<style scoped>
/* optional extra polish */
</style>
