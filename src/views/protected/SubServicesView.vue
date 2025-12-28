<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute function
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import ServicesService from '@/services/ServicesService'
import { BASE_AVATAR } from '@/config'
import { useRouter } from 'vue-router'
import swal from 'sweetalert'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

const subService = ref({
  subServiceTitle: { en: '', ti: '' },
  subServiceDescription: { en: '', ti: '' },
  subServiceImage: null
})
const router = useRouter()
const route = useRoute() // Use useRoute function to access the route object
const subServices = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const ServiceId = ref(route.params.id)

const saveSubService = async () => {
  const formData = new FormData()
  formData.append('subServiceTitle', JSON.stringify(subService.value.subServiceTitle))
  formData.append('subServiceDescription', JSON.stringify(subService.value.subServiceDescription))
  if (subService.value.subServiceImage) {
    formData.append('subServiceImage', subService.value.subServiceImage)
  }
  formData.append('serviceId', ServiceId.value) // Use ServiceId ref to get the service ID

  try {
    const response = await ServicesService.createOrUpdateSubService(
      ServiceId.value,
      formData,
      editMode.value ? editId.value : ''
    )
    if (response.success) {
      successMessage.value = response.message
      swal({
        title: response.message,
        icon: 'success'
      })
      fetchSubServices()
      resetForm()
      closeModal()
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
    }
  }
}

const captureImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    subService.value.subServiceImage = file
  }
}

const fetchSubServices = async () => {
  try {
    const response = await ServicesService.getAllSubServices(ServiceId.value)
    subServices.value = response.data.subService.map((item) => ({
      ...item,
      subServiceTitle: JSON.parse(item.subServiceTitle),
      subServiceDescription: JSON.parse(item.subServiceDescription)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch subServices'
  }
}

const editSubService = (id) => {
  const item = subServices.value.find((serv) => serv.id === id)
  if (item) {
    subService.value = {
      subServiceTitle: { en: item.subServiceTitle.en, ti: item.subServiceTitle.ti },
      subServiceDescription: {
        en: item.subServiceDescription.en,
        ti: item.subServiceDescription.ti
      },
      subServiceImage: null
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteSubService = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')

  if (sure) {
    try {
      const response = await ServicesService.deleteSubService(id)
      if (response.success) {
        successMessage.value = response.message
        fetchSubServices()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete SubService'
    }
  }
}

// function goToTrash() {
//   router.push("subServices/trashed")
// }

const searchSubService = ref('')
const filteredSubServices = computed(() => {
  if (searchSubService.value) {
    return subServices.value.filter((service) =>
      Object.values(service).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchSubService.value.toLowerCase())
      )
    )
  } else {
    return subServices.value
  }
})

const resetForm = () => {
  subService.value = {
    subServiceTitle: { en: '', ti: '' },
    subServiceDescription: { en: '', ti: '' },
    subServiceImage: null
  }
  editMode.value = false
  editId.value = null
}
function goBack() {
  router.back()
}
const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  fetchSubServices()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex w-full space-x-4">
      <font-awesome-icon
        size="20"
        @click="goBack()"
        icon="chevron-left"
        class="bg-white rounded mt-2 cursor-pointer"
      />
      <div class="flex gap-2">
        <router-link :to="{ name: 'in-services' }">{{ $t('Services') }}</router-link>
        <p>/</p>
        <router-link to="/">{{ $t('Sub Service') }}</router-link>
      </div>
    </div>

    <div class="flex flex-col w-full">
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchSubService"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="showModal = true" class="p-0 w-full">
          {{ $t('Add SubService') }}
        </BaseButton>
      </div>
    </div>

    <div v-if="subServices.length" class="col-span-12 w-full">
      <div class="w-full mx-auto mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="subService in filteredSubServices"
            :key="subService.id"
            class="flex justify-center"
          >
            <div class="shadow p-4 bg-white rounded-lg w-full">
              <img
                v-if="subService.subServiceImage"
                :src="`${BASE_AVATAR}${subService.subServiceImage}`"
                alt="SubService Image"
                class="w-full h-36 object-cover mb-4"
              />
              <div class="mb-2">
                <h3 class="font-bold">
                  {{
                    language === 'en'
                      ? subService.subServiceTitle.en
                      : subService.subServiceTitle.ti
                  }}
                </h3>
              </div>
              <div class="flex flex-col gap-2">
                <p>
                  {{
                    language === 'en'
                      ? subService.subServiceDescription.en
                      : subService.subServiceDescription.ti
                  }}
                </p>
              </div>
              <div class="flex justify-end gap-2">
                <button
                  @click="editSubService(subService.id)"
                  class="text-blue-500 hover:text-blue-700 px-2 py-1"
                >
                  {{ $t('Edit') }}
                </button>
                <button
                  @click="deleteSubService(subService.id)"
                  class="text-red-500 hover:text-red-700 px-2 py-1"
                >
                  {{ $t('Delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="gid grid-cols-">
      <h1 class="text-2xl">There is no subservice Added</h1>
    </div>
    <div
      v-if="showModal"
      class="overflow-auto fixed z-50 modal inset-0 bg-black/70 flex justify-center items-center"
    >
      <div class="bg-white shadow-lg w-full max-w-md p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit SubService' : 'Add SubService' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="saveSubService" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="subService.subServiceTitle.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="SubService Title (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="subService.subServiceTitle.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="SubService Title (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="subService.subServiceDescription.en"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="SubService Description (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="subService.subServiceDescription.ti"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="SubService Description (Tigrinya)"
                  ></BaseTextarea>
                </div>
                <div class="w-full px-2 mb-4">
                  <input
                    type="file"
                    @change="captureImage"
                    class="p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div class="flex justify-center gap-6">
                <BaseButton @click="closeModal" class="py-2 px-4 bg-gray-500 text-white rounded">
                  Cancel
                </BaseButton>
                <BaseButton type="submit" class="py-2 px-4 bg-blue-500 text-white rounded">
                  {{ editMode ? 'Update' : 'Add' }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
