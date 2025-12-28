<script setup>
// import SpinningCard from '@/components/open/SpinningCard.vue'

import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()

import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'

// import dayjs from 'dayjs'
import ServicesService from '@/services/ServicesService'
import { BASE_AVATAR } from '@/config'

defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const service = ref({})
const successMessage = ref('')
const errorMessage = ref('')

async function saveSubservice() {
  try {
    const response = await ServicesService.createSubservice(service.value._id, form.value)
    if (response.success) {
      successMessage.value = response.message
      getService()
      errorMessage.value = ''
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
async function getService() {
  try {
    const response = await ServicesService.getServiceByTitle(route.params.title)
    if (response.success) {
      service.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      router.push({ name: '404resource', params: { resource: 'Service' } })
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

const isNew = ref(false)
const form = ref({})
const toggleAdd = () => {
  isNew.value = true
}
const editForm = ref({})
const serviceId = ref('')
const isEditing = ref(false)
const editSubservice = (Id, subService) => {
  editForm.value = subService
  serviceId.value = Id
  isEditing.value = true
}

const saveChanges = async () => {
  try {
    const response = await ServicesService.updateSubservice(
      serviceId.value,
      editForm.value._id,
      editForm.value
    )
    if (response.success) {
      isEditing.value = false
      getService()

      alert('Successfully edited')
    }
  } catch (error) {
    return error
  }
}

const deleteSubservice = async (serviceId, subServiceId) => {
  try {
    const sure = window.confirm('Are you sure?')
    if (sure) {
      const response = await ServicesService.deleteSubservice(serviceId, subServiceId)
      if (response.success) {
        alert('Successfully deleted')
        getService()
      }
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
// function formattedDate(date) {
//   return dayjs(date).locale('en').format('MMMM D, YYYY')
// }

watchEffect(() => {
  if (route.params.title) {
    getService()
  }
})
</script>
<template>
  <section class="w-full">
    <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-4 py-12 bg-[#1d4354]/5 px-[7%]">
      <router-link :to="{ name: 'in-services' }" class="bg-white">Back</router-link>

      <div class="relative w-full flex flex-col group md:col-span-12">
        <div class="w-full max-h-[400px] overflow-hiddden">
          <img
            v-if="service.serviceImage"
            :src="BASE_AVATAR + `${service.serviceImage}`"
            alt="Service Image"
            class="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div class="flex flex-col gap-2 py-6 bg-white translation-all duration-1000 px-4 relative">
          <div class="flex flex-col gap-4 py-2">
            <h2 class="meyla-subtitle whitespace-normal break-al">{{ service.serviceTitle }}</h2>
            <p class="text-gray-700"><span> </span> {{ service.serviceDescription }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-2 py-6 bg-white translation-all duration-1000 px-4 relative">
          <div class="w-full flex justify-between">
            <h1 class="meyla-subtitle">Sub Services</h1>
            <div><BaseButton class="inline" @click="toggleAdd">Add new</BaseButton></div>
          </div>
          <div v-for="(subService, index) in service.serviceSubtitles" :key="index">
            <h1 class="font-semibold">{{ subService.subTitle }}</h1>
            <p>{{ subService.subDescription }}</p>
            <button @click="editSubservice(service._id, subService)">
              <font-awesome-icon icon="edit" class="text-blue-500 mr-4"></font-awesome-icon>
            </button>
            <button @click="deleteSubservice(service._id, subService._id)">
              <font-awesome-icon icon="trash" class="text-red-500"></font-awesome-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="modal fixed flex inset-0 justify-center items-center z-20 bg-white/80" v-if="isNew">
    <div class="flex flex-col justify-between bg-white p-4 gap-4 shadow">
      <button @click="isNew = !isNew" class="self-end text-xl text-red-500">X</button>

      <div class="w-full">
        <form @submit.prevent="saveSubservice" class="flex flex-col gap-4">
          <BaseInput
            v-model="form.subTitle"
            @handleEnter="submitForm"
            type="text"
            required
            inputClass="px-8 py-3"
            label="Title"
          ></BaseInput
          ><BaseTextarea v-model="form.subDescription" required label="Description"></BaseTextarea>

          <BaseButton type="submit" label="">Save subService</BaseButton>
        </form>
      </div>
    </div>
  </div>
  <div
    class="modal fixed flex inset-0 justify-center items-center z-20 bg-white/80"
    v-if="isEditing"
  >
    <div class="flex justify-between bg-white p-4 gap-4 shadow">
      <div class="">
        <form @submit.prevent="saveChanges" class="flex flex-col gap-4">
          <BaseInput
            v-model="editForm.subTitle"
            @handleEnter="submitForm"
            type="text"
            inputClass="px-4 py-1"
            label="Title"
          ></BaseInput
          ><BaseTextarea v-model="editForm.subDescription" label="Description"></BaseTextarea>

          <BaseButton type="submit" label="">Save Changes</BaseButton>
        </form>
      </div>
      <button @click="isEditing = !isEditing" class="self-start text-xl text-red-500">X</button>
    </div>
  </div>
</template>
