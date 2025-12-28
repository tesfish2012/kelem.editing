<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import PolicyService from '@/services/PolicyService'

import swal from 'sweetalert'
const router = useRouter()
const policy = ref({
  title: { en: '', ti: '' },
  policy: { en: '', ti: '' }
})

const policies = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const showEnglish = ref(true)
const toggleLanguage = () => {
  showEnglish.value = !showEnglish.value
}
const savePolicy = async () => {
  const data = {
    title: JSON.stringify(policy.value.title),
    policy: JSON.stringify(policy.value.policy)
  }

  try {
    const response = await PolicyService.createOrUpdatePolicy(
      editMode.value ? editId.value : '',
      data
    )
    if (response.success) {
      successMessage.value = response.message
            swal({
        title: response.message,
        icon: 'success',
      })
      fetchPolicies()
      resetForm()
      closeModal()
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
const fetchPolicies = async () => {
  try {
    const response = await PolicyService.getAllPolicies()
    policies.value = response.data.map((item) => ({
      ...item,
      title: JSON.parse(item.title),
      policy: JSON.parse(item.policy)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch policies'
  }
}
const editItem = (id) => {
  const item = policies.value.find((pol) => pol.id === id)
  if (item) {
    policy.value = {
      title: { en: item.title.en, ti: item.title.ti },
      policy: { en: item.policy.en, ti: item.policy.ti }
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  try {
    const response = await PolicyService.deletePolicyById(id)
    if (response.success) {
      successMessage.value = response.message
      fetchPolicies()
    }
  } catch (error) {
    errorMessage.value = 'Failed to delete policy'
  }
}

const resetForm = () => {
  policy.value = {
    title: { en: '', ti: '' },
    policy: { en: '', ti: '' }
  }
  editMode.value = false
  editId.value = null
}
const closeModal = () => {
  showModal.value = false
  resetForm()
}
onMounted(() => {
  fetchPolicies()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">Our Policies</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchMessage"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="showModal = true" class="p-0"> Add </BaseButton>
      </div>
    </div>
    <div v-if="policies.length" class="w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="col-span-6 md:col-span-8 flex justify-start items-center">
        <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
          {{ showEnglish ? 'Tigrinya' : 'English' }}
        </button>
      </div>

      <div class="w-full bg-[#F5F5F5]">
        <div v-for="policy in policies" :key="policy.id" class="w-full">
          <div class="shadow p-4 bg-white">
            <div v-if="showEnglish">
              <h3 class="font-bold">{{ policy.title.en }}</h3>
              <p>{{ policy.policy.en }}</p>
            </div>
            <div v-else>
              <h3 class="font-bold">{{ policy.title.ti }}</h3>
              <p>{{ policy.policy.ti }}</p>
            </div>

            <div class="flex justify-end space-x-2">
              <button @click="editItem(policy.id)" class="text-blue-500">edit</button>
              <button @click="deleteItem(policy.id)" class="text-red-500">delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showModal"
      class="overflow-auto fixed inset-0 z-50 bg-black/70 modal flex justify-center items-center"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Policy' : 'Add Policy' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="savePolicy" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="policy.title.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Title (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="policy.title.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Title (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseTextarea
                    v-model="policy.policy.en"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Policy (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseTextarea
                    v-model="policy.policy.ti"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Policy (Tigrinya)"
                  ></BaseTextarea>
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <BaseButton
                  @click="closeModal"
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
                >Cancel</BaseButton>
                <BaseButton type="submit" class="bg-[#37a000] text-white px-2 py-2 rounded">{{
                  editMode ? 'Save changes' : 'Save Policy'
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
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>