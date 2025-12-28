<script setup>
import { ref, onMounted } from 'vue'
// import BaseInput from '@/components/base/BaseInput.vue'
// import BaseButton from '@/components/base/BaseButton.vue'
// import BaseTextarea from '@/components/base/BaseTextarea.vue'
import ServicesService from '@/services/ServicesService'
import { BASE_AVATAR } from '@/config'
import {useRouter} from "vue-router"


const services = ref([])
const errorMessage = ref('')
const successMessage = ref('')
// const showModal = ref(false)
const showEnglish = ref(true)
const router = useRouter()
const toggleLanguage = () => {
  showEnglish.value = !showEnglish.value
}

function goBack(){
  router.back()
}

const fetchServices = async () => {
  try {
    const response = await ServicesService.getAllTrashedServices()
    services.value = response.data.map((item) => ({
      ...item,
      serviceTitle: JSON.parse(item.serviceTitle),
      serviceDescription: JSON.parse(item.serviceDescription)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch services'
  }
}
const deleteTrashedService = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await ServicesService.deleteTrashedService(id)
      if (response.success) {
        successMessage.value = response.message
        fetchServices()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete service'
    }
  }
}

const restoreTrashedService = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await ServicesService.restoreTrashedService(id)
      if (response.success) {
        successMessage.value = response.message
        fetchServices()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete service'
    }
  }
}

onMounted(() => {
  fetchServices()
})
</script>
<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex  w-full space-x-4">
        
      <font-awesome-icon size="20" @click="goBack()" icon="chevron-left" class="bg-white rounded mt-2 " />
      <h2 class=" flex text-xl font-bold"> Trashed Services</h2>
      
    </div>
    <div v-if="services.length" class="col-span-12 w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="w-full mx-auto mt-8">
        <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  <div v-for="service in services" :key="service.id" class="flex justify-center">
    <div class="shadow p-4 bg-white rounded-lg w-full">
      <img
        v-if="service.serviceImage"
        :src="`${BASE_AVATAR}${service.serviceImage}`"
        alt="Service Image"
        class="w-24 h-24 object-cover mb-4"
      />
      <div class="mb-2">
        <h3 class="font-bold">
          {{ showEnglish ? service.serviceTitle.en : service.serviceTitle.ti }}
        </h3>
      </div>
      <div class="flex flex-col gap-2">
        <p>
          {{ showEnglish ? service.serviceDescription.en : service.serviceDescription.ti }}
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <button @click="restoreTrashedService(service.id)" class="text-blue-500 hover:text-blue-700 px-2 py-1">
          Restore
        </button>
        <button @click="deleteTrashedService(service.id)" class="text-red-500 hover:text-red-700 px-2 py-1">
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


