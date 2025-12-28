<script setup>
// import { ref } from 'vue'/
import DataTable from '@/components/base/DataTable.vue'
import CareerService from '@/services/CareerService'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
const tableHeaders = [
  { label: 'Title', field: 'jobTitle' },
  { label: 'Employment Type', field: 'employmentType' },
  { label: 'Salary', field: 'salary' },
  { label: 'Experience', field: 'experience' },
  { label: 'Deadline', field: 'deadline' }
]
const careers = ref([])
const actions = [
  {
    label: 'edit',
    action: editCareer,
    icon: 'edit',
    style: 'hover:cursor-pointer text-blue-500 py-1 px-2'
  },
  {
    label: 'delete',
    action: deleteCareer,
    icon: 'trash',
    style: 'hover:cursor-pointer text-red-500 py-1 px-2'
  },
  {
    label: 'view',
    action: viewApplicants,
    icon: 'eye',
    style: 'hover:cursor-pointer text-green-500 py-1 px-2'
  }
]
async function getAllCareers() {
  const response = await CareerService.getAllCareers()
  if (response.success) {
    careers.value = response.data
  }
}

const isEditing = ref(false)
const editForm = ref(null)
let formatDate = ref('')
function editCareer(career) {
  isEditing.value = true
  editForm.value = career
  formatDate.value = dayjs(editForm.value.eventDate).format('YYYY-MM-DD')
}

async function deleteCareer(career) {
  const accept = window.confirm('Undo is not possible')
  if (accept) {
    const response = await CareerService.deleteCareer(career.id)
    if (response.success) {
      getAllCareers()
    }
  }
}

const router = useRouter()

async function viewApplicants(career) {
  router.push({ name: 'jobApplicants', params: { id: career.id } })
}
function goToTrash(){
  router.push("vacancies/trashed")
}
async function submitEdit() {
  const response = await CareerService.updateCareer(editForm.value, editForm.value.id)
  if (response.success) {
    isEditing.value = false
    getAllCareers()
    editForm.value = {}
  }
}

onMounted(getAllCareers)
</script>

<template>
  <section class="w-full py-4 bg-white border flex flex-col gap-4 rounded-xl px-[2%] min-h-screen">
    <div class="flex justify-between w-full">
      <h2 class="text-xl font-bold">{{ $t('Job Lists') }}</h2>
      <router-link
        :to="{ name: 'createvacancy' }"
        class="inline-block bg-[#288fb2] text-white px-2 py-1"
        >{{ $t('Add Career') }}</router-link
      >
    </div>
    <div class="w-full">
      <DataTable :tableHeaders="tableHeaders" :tableValues="careers" :actions="actions" createExport=true exportTitle="vacancies" >
        <template v-slot:headerw>
          <BaseButton @click="goToTrash" class="self-end bg-slate-500 no-wrap "> trashed  </BaseButton>
        </template>
      </DataTable>
    </div>
  </section>
  <div
    class="modal fixed inset-0 flex z-30 justify-center items-center bg-white/80 overflow-auto py-12"
    v-if="isEditing"
  >
    <div
      class="bg-white/100 flex flex-col gap-3 justify-center items-center shadow p-2 overflow-auto"
    >
      <button @click="isEditing = !isEditing" class="self-end text-2xl text-red-500">X</button>

      <form @submit.prevent="submitEdit" class="flex flex-col gap-4 px-2">
        <BaseInput
          v-model="editForm.jobTitle"
          @handleEnter="submitForm"
          type="text"
          label="Job Title"
          required
          inputClass="px-4 py-3"
        ></BaseInput>
        <BaseInput
          v-model="editForm.salary"
          @handleEnter="submitForm"
          type="text"
          label="Salary"
          inputClass="px-4 py-3"
          required
        ></BaseInput>
        <BaseInput
          v-model="editForm.experience"
          @handleEnter="submitForm"
          type="text"
          label="Experience"
          inputClass="px-4 py-3"
          required
        ></BaseInput>
        <BaseInput
          v-model="formatDate"
          @handleEnter="submitForm"
          type="date"
          label="deadline"
          required
          inputClass="px-4 py-3"
          placeholder="Job Title"
        ></BaseInput>
        <BaseTextarea
          v-model="editForm.qualification"
          rows="4"
          label=""
          inputClass="justify-self-end"
          >Qualification / Requirement</BaseTextarea
        >

        <BaseButton type="submit">Save Changes</BaseButton>
      </form>
    </div>
  </div>
</template>
