<script setup>
import { ref, onMounted } from 'vue'

import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ServicesService from '@/services/ServicesService'
import NewsService from '@/services/NewsService'
import ProductService from '@/services/ProductService'
import MessageService from '@/services/MessageService'
import SettingsService from '@/services/SettingsService'



const messages = ref([])
const products = ref([])
const news = ref([])
const services = ref([])
const totalResource = ref({
  service: 0,
  product: 0,
  message: 0,
  new: 0
})

async function getMessages() {
  try {
    const response = await MessageService.getAllMessages()
    if (response.success) {
      messages.value = response.data
      totalResource.value.message = response.data.length
    }
  } catch (error) {
    console.error('Error retrieving messages:', error)
  }
}

async function getProducts() {
  try {
    const response = await ProductService.getAllProducts()
    products.value = response.data
    totalResource.value.product = response.data.length
  } catch (error) {
    console.error('Error retrieving products:', error)
  }
}

async function getAllNews() {
  try {
    const response = await NewsService.getAllNews()
    news.value = response.data
    totalResource.value.new = response.data.length
  } catch (error) {
    console.error('Error retrieving news:', error)
  }
}

async function getAllServices() {
  try {
    const response = await ServicesService.getAllServices()
    services.value = response.data.data
    totalResource.value.service = response.data.length
  } catch (error) {
    console.error('Error retrieving services:', error)
  }
}

//charts
// const chartOptions = {
//   responsive: true,
//   backgroundColor: ['#37a000', '#325ac2', '#1d4354', '#777777']
//   // animation: false
// }
const chartData = ref({
  labels: ['service', 'product', 'message', 'new'],
  datasets: [
    {
      label: 'Resources',
      data: [5, 5, 6, 3] // Populate data array with values
    }
  ]
})

const loadCharts = () => {
  chartData.value.datasets[0].data = [
    totalResource.value.service,
    totalResource.value.product,
    totalResource.value.message,
    totalResource.value.new
  ]
}

// const isAdd = ref(false)
// function toggle() {
//   isAdd.value = !isAdd.value
// }
const statistics = ref({})
const showModal = ref(false)
const editMode = ref(false)
const editId = ref(null)

function editStatistics(id, statistic) {
  editMode.value = true
  showModal.value = true
  editId.value = id
  statistics.value = statistic
}
const closeModal = () => {
  showModal.value = false
  // resetForm()
}

import swal from 'sweetalert'
const statistic = ref([])
const getStatistics = async () => {
  const res = await SettingsService.getStatistics()
  if (res.success) {
    statistic.value = res.data
  }
}
const saveStatistics = async () => {
  const response = await SettingsService.updateStatistics(editId.value, statistics.value)
  if (response.success) {
    swal({
      title: response.message,
      text: '',
      icon: 'success'
    })
    setTimeout(() => {
      showModal.value = false
    }, 1000)
  }
}
onMounted(getStatistics(), async () => {
  await Promise.all([getMessages(), getProducts(), getAllNews(), getAllServices()])
  loadCharts()
})
</script>
<template>
  <main class="w-full py-4 bg-white border flex flex-col gap-4 rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Profile Statistics') }}</h2>
    </div>
    <section class="w-full flex flex-col gap-4">
      <div class="w-full flex justify-end items-center j">

        <router-link to=""></router-link>
        <router-link
        :to="{ name: 'analytics' }"
        class="inline-block bg-[#288fb2] text-white px-2 py-1"
        >
        <font-awesome-icon icon="plus" class="text-lg text-white"></font-awesome-icon>
        {{ $t('Add') }}</router-link>
      </div>

      <div
        class="w-full grid grid-cols-2 md:grid-cols-4 gap-2 justify-between"
        v-if="statistic.length"
      >
        <div class="border rounded-xl zzshadow-xl p-4 flex justify-between items-center">
          <h1 class="text-lg">{{ $t('Members') }}</h1>
          <p class="border rounded-2xl p-1 bg-[#288fb2] text-white">{{ statistic[0].studentEnrolled }}</p>
        </div>
        <div class="border rounded-xl zzshadow-xl p-4 flex justify-between items-center">
          <h1 class="text-[16px]">{{ $t('Laon Distributed') }}</h1>
          <p class="border rounded-2xl p-1 bg-[#288fb2] text-white">
            {{ statistic[0].classCompeted }}
          </p>
        </div>
        <div class="border rounded-xl zzshadow-xl p-2 flex justify-between items-center">
          <h1 class="text-lg">{{ $t('Assets') }}</h1>
          <p class="border rounded-2xl p-1 bg-[#288fb2] text-white">{{ statistic[0].certifiedTeachers }}</p>
        </div>
      </div>
      <div class="w-full flex justify-end">
        <BaseButton @click="editStatistics(statistic[0].id, statistic[0])" class="p-0 bg-white">
          <font-awesome-icon icon="edit" class="text-lg text-[#288fb2]"></font-awesome-icon>
        </BaseButton>
      </div>
    </section>
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/70 z-50 modal flex justify-center items-center"
    >
      <div class="bg-white rounded-lg zzshadow-lg w-full max-w-md p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Statistics' : 'Add Statistics' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="saveStatistics" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="statistics.members"
                    type="text"
                    required
                    label="Members"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Members"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="statistics.loanDistributed"
                    type="text"
                    required
                    label="Loan Distributed"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Loan Distributed"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="statistics.memberSavings"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Membership Savings"
                    label="Membership Saving"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="statistics.assets"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="assets"
                    label="Assets"
                  ></BaseInput>
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <BaseButton
                  @click="closeModal"
                  type="button"
                  class="bg-gray-700 text-white px-4 py-2 rounded"
                  >Cancel</BaseButton
                >
                <BaseButton type="submit" class="bg-[#288fb2] text-white px-2 py-2 rounded">{{
                  editMode ? 'Save changes' : 'Save Statistics'
                }}</BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <ol class="hidden">
      <li>#Developers</li>
      <li>Zinabu Kalayou</li>
      <li>Mahlet G/gziabher</li>
      <li>Tesfay G/tsadikan</li>
      <li>Shumuye Aregay</li>
      <li>Tewelde G/krstos</li>
    </ol>
  </main>
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
