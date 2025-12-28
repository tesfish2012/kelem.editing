<script setup>
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import LoanService from '@/services/LoanService'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

const loan = ref({
  loanAmount: '',
  interestRate: '',
  loanTerm: { en: '', ti: '' }
})

const loans = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
// const showEnglish = ref(true)

// const toggleLanguage = () => {
//   showEnglish.value = !showEnglish.value
// }

const saveLoan = async () => {
  const data = {
    loanAmount: loan.value.loanAmount,
    interestRate: loan.value.interestRate,
    loanTerm: JSON.stringify(loan.value.loanTerm)
  }

  try {
    const response = await LoanService.createOrUpdateLoan(editMode.value ? editId.value : '', data)
    if (response.success) {
      successMessage.value = response.message
      fetchLoans()
      resetForm()
      closeModal()
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

const fetchLoans = async () => {
  try {
    const response = await LoanService.getAllPolicies()
    loans.value = response.data.map((item) => ({
      ...item,
      loanAmount: item.loanAmount,
      interestRate: item.interestRate,
      loanTerm: JSON.parse(item.loanTerm)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch loans'
  }
}

const editItem = (id) => {
  const item = loans.value.find((loan) => loan.id === id)
  if (item) {
    loan.value = {
      loanAmount: item.loanAmount,
      interestRate: item.interestRate,
      loanTerm: { en: item.loanTerm.en, ti: item.loanTerm.ti }
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  try {
    const response = await LoanService.deleteLoanById(id)
    if (response.success) {
      successMessage.value = response.message
      fetchLoans()
    }
  } catch (error) {
    errorMessage.value = 'Failed to delete loan'
  }
}

const resetForm = () => {
  loan.value = {
    loanAmount: '',
    interestRate: '',
    loanTerm: { en: '', ti: '' }
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  fetchLoans()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Loan Calculation') }}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <BaseButton @click="showModal = true" class="p-0"> {{ $t('Add') }} </BaseButton>
      </div>
    </div>
    <div v-if="loans.length" class="w-full">
      <!-- <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div> -->

      <div class="col-span-6 md:col-span-8 flex justify-start items-center">
        <!-- <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
          {{ showEnglish ? 'Tigrinya' : 'English' }}
        </button> -->
      </div>

      <div
        class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 place-items-start bg-[#F5F5F5]"
      >
        <div v-for="loan in loans" :key="loan.id" class="w-full">
          <div class="shadow p-4 bg-white">
            <div>
              <h3 class="font-bold">{{ loan.loanAmount }}</h3>
              <h3 class="font-bold">{{ loan.interestRate }}</h3>
              <p>{{ language == 'en' ? loan.loanTerm.en : loan.loanTerm.ti }}</p>
            </div>

            <div class="flex justify-end space-x-2">
              <button @click="editItem(loan.id)" class="text-blue-500">edit</button>
              <button @click="deleteItem(loan.id)" class="text-red-500">delete</button>
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
            {{ editMode ? 'Edit Loan' : 'Add Loan' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="saveLoan" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2 mb-4">
                  <BaseInput
                    v-model="loan.loanAmount"
                    type="number"
                    required
                    label="Loan Amount"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Loan Amount"
                  ></BaseInput>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseInput
                    v-model="loan.interestRate"
                    type="text"
                    required
                    label="Interest Rate"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Interest Rate"
                  ></BaseInput>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseTextarea
                    v-model="loan.loanTerm.en"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Loan Term (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseTextarea
                    v-model="loan.loanTerm.ti"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Loan Term (Tigrinya)"
                  ></BaseTextarea>
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <BaseButton
                  @click="closeModal"
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
                  >Cancel</BaseButton
                >
                <BaseButton type="submit" class="bg-[#37a000] text-white px-2 py-2 rounded">{{
                  editMode ? 'Save changes' : 'Save Loan'
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
