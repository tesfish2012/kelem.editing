<script setup>
import { ref, onMounted, computed } from 'vue'
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
const service = ref({
  serviceTitle: { en: '', ti: '' },
  serviceDescription: { en: '', ti: '' }
})
const router = useRouter()
const services = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)

const saveService = async () => {
  const data = {
    serviceTitle: JSON.stringify(service.value.serviceTitle),
    serviceDescription: JSON.stringify(service.value.serviceDescription)
  }

  try {
    const response = await ServicesService.createOrUpdateService(
      data,
      editMode.value ? editId.value : ''
    )
    if (response.success) {
      successMessage.value = response.message
      swal({
        title: response.message,
        icon: 'success'
      })
      fetchServices()
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

const fetchServices = async () => {
  try {
    const response = await ServicesService.getAllServices()
    services.value = response.data.map((item) => ({
      ...item,
      serviceTitle: JSON.parse(item.serviceTitle),
      serviceDescription: JSON.parse(item.serviceDescription),
      subService: item.subService.map((subItem) => ({
        ...subItem,
        subServiceTitle: JSON.parse(subItem.subServiceTitle),
        subServiceDescription: JSON.parse(subItem.subServiceDescription)
      }))
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch services'
  }
}

const editService = (id) => {
  const item = services.value.find((serv) => serv.id === id)
  if (item) {
    service.value = {
      serviceTitle: { ...item.serviceTitle },
      serviceDescription: { ...item.serviceDescription }
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteService = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await ServicesService.deleteService(id)
      if (response.success) {
        successMessage.value = response.message
        fetchServices()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete service'
    }
  }
}

const goToTrash = () => {
  router.push('services/trashed')
}

const searchService = ref('')
const filteredService = computed(() => {
  if (searchService.value) {
    return services.value.filter((service) =>
      Object.values(service).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchService.value.toLowerCase())
      )
    )
  } else {
    return services.value
  }
})

const resetForm = () => {
  service.value = {
    serviceTitle: { en: '', ti: '' },
    serviceDescription: { en: '', ti: '' }
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  fetchServices()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Services') }}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchService"
          placeholder="Search ..."
        ></base-input>
        <BaseButton @click="goToTrash" class="self-end bg-slate-500 no-wrap">trashed</BaseButton>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="showModal = true" class="p-0 w-full">{{
          $t('Add Service')
        }}</BaseButton>
      </div>
    </div>

    <div v-if="services.length" class="w-full">
      <div v-for="service in filteredService" :key="service.id" class="w-full">
        <div class="shadow p-4 bg-white rounded-lg w-full">
          <div class="mb-2">
            <h3 class="font-bold">
              {{ language === 'en' ? service.serviceTitle.en : service.serviceTitle.ti }}
            </h3>
          </div>
          <div class="flex flex-col gap-2">
            <p>
              {{
                language === 'en' ? service.serviceDescription.en : service.serviceDescription.ti
              }}
            </p>
          </div>
          <div v-if="service.subService.length > 0" class="mt-4">
            <h4 class="font-semibold">{{ $t('Sub Services') }}:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="sub in service.subService"
                :key="sub.id"
                class="shadow p-4 bg-gray-100 rounded-lg w-full"
              >
                <img
                  v-if="sub.subServiceImage"
                  :src="`${BASE_AVATAR}${sub.subServiceImage}`"
                  alt="Sub-Service Image"
                  class="w-full h-36 object-cover mb-4"
                />
                <div class="mb-2">
                  <h3 class="font-bold">
                    {{ language === 'en' ? sub.subServiceTitle.en : sub.subServiceTitle.ti }}
                  </h3>
                </div>
                <div class="flex flex-col gap-2">
                  <p>
                    {{
                      language === 'en'
                        ? sub.subServiceDescription.en
                        : sub.subServiceDescription.ti
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <router-link
              :to="`subServices/${service.id}`"
              class="text-green-500 hover:text-green-700 px-2 py-1 border rounded"
            >
              {{$t('Sub Service')}}
            </router-link>
            <button
              @click="editService(service.id)"
              class="text-blue-500 hover:text-blue-700 px-2 py-1  border rounded"
            >
              {{ $t('Edit') }}
            </button>
            <button
              @click="deleteService(service.id)"
              class="text-red-500 hover:text-red-700 px-2 py-1  border rounded"
            >
              {{ $t('Delete') }}
            </button>
          </div>
          <hr />
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="overflow-auto fixed z-50 modal inset-0 bg-black/70 flex justify-center items-center"
    >
      <div class="bg-white shadow-lg w-full max-w-md p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Service' : 'Add Service' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="saveService" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="service.serviceTitle.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Service Title (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="service.serviceTitle.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Service Title (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="service.serviceDescription.en"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Service Description (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="service.serviceDescription.ti"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Service Description (Tigrinya)"
                  ></BaseTextarea>
                </div>
              </div>
              <div class="flex justify-center gap-6">
                <BaseButton
                  @click="closeModal"
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </BaseButton>
                <BaseButton type="submit" class="bg-[#288fb2] text-white px-2 py-2 rounded">
                  {{ editMode ? 'Save changes' : 'Save Service' }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.modal {
  animation: modal 0.3s;
}

@keyframes modal {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
