<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import ManagementService from '@/services/ManagementService'
import { BASE_AVATAR } from '@/config'

import swal from 'sweetalert'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())
// State management for management entries
const management = ref({
  titlePrefix: { en: '', ti: '' },
  fullName: { en: '', ti: '' },
  profession: { en: '', ti: '' },
  description: { en: '', ti: '' },
  avatar: null
})

let newImageName = ref('')
function captureImage(event) {
  management.value.avatar = event.target.files[0]
  newImageName.value = event.target.files[0].name
}

const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)

const managements = ref([])

async function getAllManagements() {
  try {
    const response = await ManagementService.getAllManagements()
    if (response.success) {
      managements.value = response.data.map((item) => ({
        ...item,
        titlePrefix: JSON.parse(item.titlePrefix),
        fullName: JSON.parse(item.fullName),
        profession: JSON.parse(item.profession),
        description: JSON.parse(item.description)
      }))
    } else {
      errorMessage.value = 'Failed to fetch managements'
    }
  } catch (error) {
    errorMessage.value = 'Failed to fetch managements'
  }
}

const saveManagement = async () => {
  const formData = new FormData()
  formData.append('titlePrefix', JSON.stringify(management.value.titlePrefix))
  formData.append('fullName', JSON.stringify(management.value.fullName))
  formData.append('profession', JSON.stringify(management.value.profession))
  formData.append('description', JSON.stringify(management.value.description))

  if (management.value.avatar) {
    formData.append('avatar', management.value.avatar)
  }
  try {
    const response = await ManagementService.createOrUpdateManagement(
      formData,
      editMode.value ? editId.value : ''
    )
    if (response.success) {
      successMessage.value = response.message
      swal({
        title: response.message,
        icon: 'success'
      })
      getAllManagements()
      resetForm()
      closeModal()
    } else {
      errorMessage.value = 'Failed to save management'
    }
  } catch (error) {
    errorMessage.value = 'Failed to save management'
  }
}

const editItem = (id) => {
  const item = managements.value.find((ach) => ach.id === id)
  if (item) {
    management.value = {
      titlePrefix: { en: item.titlePrefix.en, ti: item.titlePrefix.ti },
      fullName: { en: item.fullName.en, ti: item.fullName.ti },
      profession: { en: item.profession.en, ti: item.profession.ti },
      description: { en: item.description.en, ti: item.description.ti },
      avatar: null
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  try {
    const response = await ManagementService.deleteManagement(id)
    if (response.success) {
      successMessage.value = response.message
      getAllManagements()
    } else {
      errorMessage.value = 'Failed to delete management'
    }
  } catch (error) {
    errorMessage.value = 'Failed to delete management'
  }
}
const searchManagement = ref('')
const filteredManagements = computed(() => {
  if (searchManagement.value) {
    return managements.value.filter((management) =>
      Object.values(management).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchManagement.value.toLowerCase())
      )
    )
  } else {
    return managements.value
  }
})
const resetForm = () => {
  management.value = {
    titlePrefix: { en: '', ti: '' },
    fullName: { en: '', ti: '' },
    profession: { en: '', ti: '' },
    description: { en: '', ti: '' },
    avatar: null
  }
  editMode.value = false
  editId.value = null
  newImageName.value = ''
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  getAllManagements()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Board of Directories') }}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2] "
          type="search"
          class="px-2 py-1"
          v-model="searchManagement"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="showModal = true" class="self-end w-full">
          {{ $t('Add Management') }}
        </BaseButton>
      </div>
    </div>

    <div v-if="managements.length" class="col-span-12 w-full">
      <!-- <div v-if="errorMessage" class="text-red-500 font-bold -4">{{ errorMessage }}</div>
      <div v-if="successMessage" class="text-green-500 font-bold -4">{{ successMessage }}</div> -->
      <div class="w-full mx-auto mt-8">
        <!-- <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div> -->

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="management in filteredManagements" :key="management.id" class="w-full">
            <div class="shadow flex flex-col gap-2 p-4 max-w-xs">
              <img
                v-if="management.avatar"
                :src="`${BASE_AVATAR}${management.avatar}`"
                alt="Management Image"
                class="w-32 h-32 object-cover -4 rounded-full"
              />
              <div v-if="language === 'en'">
                <h3 class="font-bold">{{ management.fullName.en }}</h3>
                <p class="break-words">{{ management.profession.en }}</p>
                <p class="break-words">{{ management.description.en }}</p>
              </div>
              <div v-else>
                <h3 class="font-bold">{{ management.fullName.ti }}</h3>
                <p class="break-words">{{ management.profession.ti }}</p>
                <p class="break-words">{{ management.description.ti }}</p>
              </div>

              <div class="flex justify-end space-x-2">
                <button @click="editItem(management.id)" class="text-blue-500">Edit</button>
                <button @click="deleteItem(management.id)" class="text-red-500">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed min-h-screen inset-0 py-4 bg-black/70 modal z-50 flex justify-center items-center"
    >
      <div class="bg-white rounded-lg shadow-lg h-full overflow-auto w-full max-w-md p-4">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Management' : 'Add Management' }}
          </h3>
          <div class="">
            <form @submit.prevent="saveManagement" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseInput
                    v-model="management.titlePrefix.en"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Title Prefix (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseInput
                    v-model="management.titlePrefix.ti"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Title Prefix (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseInput
                    v-model="management.fullName.en"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Full Name (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseInput
                    v-model="management.fullName.ti"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Full Name (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseInput
                    v-model="management.profession.en"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Profession (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseInput
                    v-model="management.profession.ti"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Profession (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseTextarea
                    v-model="management.description.en"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Description (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 px-2 -4">
                  <BaseTextarea
                    v-model="management.description.ti"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Description (Tigrinya)"
                  ></BaseTextarea>
                </div>
              </div>
              <div class="-4">
                <BaseInput
                  type="file"
                  @change="captureImage"
                  class="p-2 rounded w-full"
                  placeholder="Upload Image"
                ></BaseInput>
                <span v-if="newImageName">{{ newImageName }}</span>
              </div>
              <div class="flex justify-center gap-6">
                <BaseButton type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </BaseButton>
                <BaseButton @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}
.success-message {
  color: green;
  font-weight: bold;
}

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
