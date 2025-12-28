<script setup>
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import OrganizationService from '@/services/OrganizationService'
import { BASE_AVATAR } from '@/config'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

const organization = ref({
  title: { en: '', ti: '' },
  image: null
})

const organizations = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const showEnglish = ref(true)

const saveOrganization = async () => {
  const formData = new FormData()
  formData.append('title', JSON.stringify(organization.value.title))
  if (organization.value.image) {
    formData.append('image', organization.value.image)
  }

  try {
    const response = await OrganizationService.createOrUpdateOrganization(
      editMode.value ? editId.value : '',
      formData
    )
    if (response.success) {
      successMessage.value = response.message
      fetchOrganizations()
      closeModal()
    } else {
      errorMessage.value = response.data.message || 'An error occurred'
    }
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error.response?.data.message || 'An error occurred: ' + error.message
  }
}

const captureAvatar = (event) => {
  organization.value.image = event.target.files[0]
}

const fetchOrganizations = async () => {
  try {
    const response = await OrganizationService.getAllOrganization()
    organizations.value = response.data.map((item) => ({
      ...item,
      title: JSON.parse(item.title)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch organizations'
  }
}

const editItem = (id) => {
  const item = organizations.value.find((org) => org.id === id)
  if (item) {
    organization.value = { title: { en: item.title.en, ti: item.title.ti }, image: null }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await OrganizationService.deleteOrganizationById(id)
      if (response.success) {
        successMessage.value = response.message
        fetchOrganizations()
      } else {
        errorMessage.value = response.data.message || 'Failed to delete organization'
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete organization'
    }
  }
}
const resetForm = () => {
  organization.value = {
    title: { en: '', ti: '' },
    image: null
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  fetchOrganizations()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Organizational Structure') }}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchMessage"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="showModal = true" class="p-0 w-full"> {{ $t('Add') }} </BaseButton>
      </div>
    </div>
    <div v-if="organizations.length" class="col-span-12 w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="w-full mx-auto mt-8">
        <div class="col-span-6 md:col-span-8 flex justify-start items-center"></div>

        <div
          class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 place-items-start bg-[#F5F5F5]"
        >
          <div v-for="organization in organizations" :key="organization.id" class="w-full">
            <div class="shadow p-4 bg-white">
              <img
                v-if="organization.image"
                :src="`${BASE_AVATAR}${organization.image}`"
                alt="Organization image"
                class="w-full h-36 object-cover mb-4"
              />
              <h3 class="font-bold">
                {{ language === 'en' ? organization.title.en : organization.title.ti }}
              </h3>
              <div class="flex justify-end space-x-2">
                <button @click="editItem(organization.id)" class="text-blue-500">Edit</button>
                <button @click="deleteItem(organization.id)" class="text-red-500">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/70 z-50 modal flex justify-center items-center"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Organization' : 'Add Organization' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="saveOrganization" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="organization.title.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    :placeholder="showEnglish ? 'title (English)' : 'title (Tigrinya)'"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="organization.title.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    :placeholder="
                      showEnglish ? 'Responsibility (English)' : 'Responsibility (Tigrinya)'
                    "
                  ></BaseInput>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseInput
                    @change="captureAvatar"
                    type="file"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Organization Avatar"
                  ></BaseInput>
                </div>
              </div>
              <div class="flex justify-center gap-6">
                <BaseButton
                  @click="closeModal"
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
                  >Cancel</BaseButton
                >
                <BaseButton type="submit" class="bg-[#288fb2] text-white px-2 py-2 rounded">{{
                  editMode ? 'Save changes' : 'Save Organization'
                }}</BaseButton>
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
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
