<script setup>
import { ref, onMounted } from 'vue'
import CareerService from '@/services/CareerService'
import { useRouter } from "vue-router"

const careers = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

function goBack(){
  router.back()
}

const fetchCareers = async () => {
  try {
    const response = await CareerService.getAllTrashedCareers()
    careers.value = response.data
  } catch (error) {
    errorMessage.value = 'Failed to fetch Careers'
  }
}
const deleteTrashedCareer = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await CareerService.deleteTrashedCareers(id)
      if (response.success) {
        successMessage.value = response.message
        fetchCareers()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete service'
    }
  }
}

const restoreTrashedCareer = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await CareerService.restoreTrashedCareers(id)
      if (response.success) {
        successMessage.value = response.message
        fetchCareers()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete vacancy'
    }
  }
}

onMounted(() => {
  fetchCareers()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex w-full space-x-4">
      <font-awesome-icon size="20" @click="goBack()" icon="chevron-left" class="bg-white rounded mt-2 " />
      <h2 class="flex text-xl font-bold">Trashed vacancy</h2>
    </div>
    <div v-if="careers.length" class="col-span-12 w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div class="w-full mx-auto mt-8">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200">
              <th class="border p-2">Job Title</th>
              <th class="border p-2">Salary</th>
              <th class="border p-2">Experience</th>
              <th class="border p-2">Deadline</th>
              <th class="border p-2">Qualification</th>
              <th class="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="career in careers" :key="career.id" class="text-center">
              <td class="border p-2">{{ career.jobTitle }}</td>
              <td class="border p-2">{{ career.salary }}</td>
              <td class="border p-2">{{ career.experience }}</td>
              <td class="border p-2">{{ career.formatDate }}</td>
              <td class="border p-2">{{ career.qualification }}</td>
              <td class="border p-2">
                <button @click="restoreTrashedCareer(career.id)" class="text-blue-500 hover:text-blue-700 px-2 py-1">Restore</button>
                <button @click="deleteTrashedCareer(career.id)" class="text-red-500 hover:text-red-700 px-2 py-1">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="flex justify-center text-3xl">There is no trashed data</div>
  </section>
</template>


