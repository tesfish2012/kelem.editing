<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useRouter } from 'vue-router'
const router = useRouter()

import BaseInput from '@/components/base/BaseInput.vue'
import CareerService from '@/services/CareerService'
import DataTable from '@/components/base/DataTable.vue'
import { BASE_UPLOAD } from '@/config'
const route = useRoute()
const tableHeaders = [
  { label: 'Name', field: 'fullName' },
  { label: 'Email', field: 'email' },
  { label: 'Phone Number', field: 'phoneNumber' },
  { label: 'Application Letter', field: 'applicationLetter' },
  { label: 'Cv', field: 'cv' }
]

const actions = [
  
  {
    label: 'delete',
    action: deleteJob,
    icon: 'trash',
    style: 'hover:cursor-pointer text-red-500 py-1 px-2'
  }

]
const searchApplicants = ref('')
const jobs = ref([])
const getJob = async () => {
  try {
    const response = await CareerService.getJobApplicants(route.params.id)
    jobs.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      router.push({ name: '404resource', params: { resource: 'Job' } })
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

const filteredJobs = computed(() => {
  if (searchApplicants.value) {
    return jobs.value.filter((msg) => {
      return Object.values(msg).some((value) => {
        if (value !== null && value !== undefined) {
          return value.toString().toLowerCase().includes(searchApplicants.value.toLowerCase())
        }
        return false
      })
    })
  } else {
    return jobs.value
  }
})

async function deleteJob  (applicant) {
  try {
    const sure = window.confirm('Are you sure?')
    if (sure) {
      const response = await CareerService.deleteApplicant(applicant.id)
      if (response.success) {
        alert('Applicant deleted successfully')
        getJob()  // Refresh the list of applicants after deletion
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      router.push({ name: '404resource', params: { resource: 'Job' } })
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
onMounted(getJob)
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex justify-between w-full">
      <h2 class="text-xl font-bold">Job Applicants</h2>
      <div class="self-end">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchApplicants"
          placeholder="Search ..."
        ></base-input>
      </div>
    </div>
     <div class="w-full">
      <DataTable :tableHeaders="tableHeaders" :tableValues="jobs" :actions="actions" createExport=true exportTitle="vacancies" >
       <template #applicationLetter="{ item }" >
          <a  class="hover:text-primary action-cell" :href="BASE_UPLOAD + `${item.applicationLetter}`" target="_blank" title="download letter">
             {{ item.applicationLetter }}
          </a>
      </template>
      <template #cv="{ item }" >
         <a class="hover:text-primary action-cell" :href="BASE_UPLOAD + `${item.cv}`" target="_blank" title="download cv">
            {{ item.cv }}
          </a>
      </template>
      </DataTable>
    </div>
    <!-- <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b border-gray-200">Name</th>
            <th class="py-2 px-4 border-b border-gray-200">Email</th>
            <th class="py-2 px-4 border-b border-gray-200">Phone Number</th>
            <th class="py-2 px-4 border-b border-gray-200">Application Letter</th>
            <th class="py-2 px-4 border-b border-gray-200">CV</th>
            <th class="py-2 px-4 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(applicant, i) in filteredJobs" :key="i">
            <td class="py-2 px-4 border-b border-gray-200">{{ applicant.fullName }}</td>
            <td class="py-2 px-4 border-b border-gray-200">{{ applicant.email }}</td>
            <td class="py-2 px-4 border-b border-gray-200">{{ applicant.phoneNumber }}</td>
            <td class="py-2 px-4 border-b border-gray-200">
              <a :href="BASE_UPLOAD + `${applicant.applicationLetter}`" target="_blank" title="download letter">
                {{ applicant.applicationLetter }}
              </a>
            </td>
            <td class="py-2 px-4 border-b border-gray-200">
              <a :href="BASE_UPLOAD + `${applicant.cv}`" target="_blank" title="download cv">
                {{ applicant.cv }}
              </a>
            </td>
            <td class="py-2 px-4 border-b border-gray-200">
              <button @click="deleteJob(applicant.id)">
                <font-awesome-icon icon="trash" class="text-red-700"></font-awesome-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
  </section>
</template>
