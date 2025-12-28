<script setup>
import { ref, onMounted } from 'vue'
import PartnershipService from '@/services/PartnershipService'
import { BASE_AVATAR } from '@/config'
import { useRouter } from 'vue-router'

const partners = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const showEnglish = ref(true)
const router = useRouter()

const toggleLanguage = () => {
  showEnglish.value = !showEnglish.value
}

function goBack() {
  router.back()
}

const fetchPartners = async () => {
  try {
    const response = await PartnershipService.getAllTrashedPartners()
    console.log(response)
    partners.value = response.data.map((item) => ({
      ...item,
      businessName: JSON.parse(item.businessName),
      specializeArea: JSON.parse(item.specializeArea),
      description: JSON.parse(item.description)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch partners'
  }
}

const deleteTrashedPartner = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await PartnershipService.deleteTrashedPartners(id)
      if (response.success) {
        successMessage.value = response.message
        fetchPartners()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete partner'
    }
  }
}

const restoreTrashedPartner = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await PartnershipService.restoreTrashedPartners(id)
      if (response.success) {
        successMessage.value = response.message
        fetchPartners()
      }
    } catch (error) {
      errorMessage.value = 'Failed to restore partner'
    }
  }
}

onMounted(() => {
  fetchPartners()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex w-full space-x-4">
      <font-awesome-icon size="20" @click="goBack" icon="chevron-left" class="bg-white rounded mt-2" />
      <h2 class="flex text-xl font-bold">Trashed Partners</h2>
    </div>
    <div v-if="partners.length" class="col-span-12 w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="w-full mx-auto mt-8">
        <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="partner in partners" :key="partner.id" class="flex justify-center">
            <div class="shadow p-4 bg-white rounded-lg w-full">
              <img
                v-if="partner.logo"
                :src="`${BASE_AVATAR}${partner.logo}`"
                alt="Partner logo"
                class="w-24 h-24 object-cover mb-4"
              />
              <div class="mb-2">
                <h3 class="font-bold">
                  {{ showEnglish ? partner.businessName.en : partner.businessName.ti }}
                </h3>
              </div>
              <div class="flex flex-col gap-2">
                <p>{{ partner.email }}</p>
                <p>{{ partner.phoneNumber }}</p>
                <p>{{ partner.website }}</p>
                <p>
                  {{ showEnglish ? partner.specializeArea.en : partner.specializeArea.ti }}
                </p>
                <p>
                  {{ showEnglish ? partner.description.en : partner.description.ti }}
                </p>
              </div>
              <div class="flex justify-end gap-2">
                <button @click="restoreTrashedPartner(partner.id)" class="text-blue-500 hover:text-blue-700 px-2 py-1">
                  Restore
                </button>
                <button @click="deleteTrashedPartner(partner.id)" class="text-red-500 hover:text-red-700 px-2 py-1">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center text-3xl">
      There is no trashed data
    </div>
  </section>
</template>


