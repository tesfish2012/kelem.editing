<script setup>
import { ref, onMounted, computed } from 'vue'
import PartnershipService from '@/services/PartnershipService'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import { BASE_AVATAR } from '@/config'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import swal from 'sweetalert'
const { language } = storeToRefs(useAuthStore())
const form = ref({
  businessName: { en: '', ti: '' },
  email: '',
  phoneNumber: '',
  website: '',
  specializeArea: { en: '', ti: '' },
  description: { en: '', ti: '' },
  logo: ''
})
const router = useRouter()
const partners = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const savePartner = async () => {
  const formData = new FormData()
  formData.append('businessName', JSON.stringify(form.value.businessName))
  formData.append('email', form.value.email)
  formData.append('phoneNumber', form.value.phoneNumber)
  formData.append('website', form.value.website)
  formData.append('specializeArea', JSON.stringify(form.value.specializeArea))
  formData.append('description', JSON.stringify(form.value.description))
  if (form.value.logo) {
    formData.append('logo', form.value.logo)
  }

  try {
    const response = await PartnershipService.createOrUpdatePartner(
      formData,
      editMode.value ? editId.value : ''
    )
    if (response.success) {
      successMessage.value = response.message
            swal({
        title: response.message,
        icon: 'success',
      })
      fetchPartners()
      resetForm()
      closeModal()
    } else {
      errorMessage.value = 'Failed to save Partner'
    }
  } catch (error) {
    errorMessage.value = 'Failed to save Partner'
  }
}

const captureImage = (event) => {
  form.value.logo = event.target.files[0]
}
function goToTrash(){
  router.push("partners/trashed")
}
const fetchPartners = async () => {
  try {
    const response = await PartnershipService.getAllPartners()
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

const editItem = (id) => {
  const item = partners.value.find((partner) => partner.id === id)
  if (item) {
    form.value = {
      email: item.email,
      phoneNumber: item.phoneNumber,
      website: item.website,
      businessName: item.businessName,
      specializeArea: item.specializeArea,
      description: item.description,
      logo: null
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  try {
    const response = await PartnershipService.deletePartner(id)
    if (response.success) {
      successMessage.value = response.message
      fetchPartners()
    } else {
      errorMessage.value = 'Failed to delete Partner'
    }
  } catch (error) {
    errorMessage.value = 'Failed to delete Partner'
  }
}

const searchPartner = ref('')
const filteredPartners = computed(() => {
  if (searchPartner.value) {
    return partners.value.filter((partner) =>
      Object.values(partner).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchPartner.value.toLowerCase())
      )
    )
  } else {
    return partners.value
  }
})
const resetForm = () => {
  form.value = {
    businessName: { en: '', ti: '' },
    email: '',
    phoneNumber: '',
    website: '',
    specializeArea: { en: '', ti: '' },
    description: { en: '', ti: '' },
    logo: ''
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  fetchPartners()
})
</script>
<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Partners') }}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchPartner"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="goToTrash" class="self-end w-full"> trashed </BaseButton>
        <BaseButton @click="showModal = true" class="self-end w-full"> {{ $t('Add') }} </BaseButton>
      </div>
    </div>
    <div v-if="partners.length" class="col-span-12 w-full">
      <div class="w-full mx-auto mt-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="partner in filteredPartners" :key="partner.id" class="w-full">
            <div class="shadow p-4 flex flex-col items-centerz justify-center">
              <img
                v-if="partner.logo"
                :src="`${BASE_AVATAR}${partner.logo}`"
                alt="Partner Image"
                class="w-full h-36 object-cover rounded-fullz"
              />
              <div v-if="language === 'en'" class="flex flex-col gap-1">
                <h3 class="font-bold">{{ partner.businessName.en }}</h3>
                <p>{{ partner.email }}</p>
                <p>{{ partner.phoneNumber }}</p>
                <p>{{ partner.website }}</p>
                <p>{{ partner.specializeArea.en }}</p>
                <p>{{ partner.description.en }}</p>
              </div>
              <div v-else>
                <h3 class="font-bold">{{ partner.businessName.ti }}</h3>
                <p>{{ partner.email }}</p>
                <p>{{ partner.phoneNumber }}</p>
                <p>{{ partner.website }}</p>
                <p>{{ partner.specializeArea.ti }}</p>
                <p>{{ partner.description.ti }}</p>
              </div>

              <div class="flex justify-end space-x-2">
                <button @click="editItem(partner.id)" class="text-blue-500">
                  {{ $t('Edit') }}
                </button>
                <button @click="deleteItem(partner.id)" class="text-red-500">
                  {{ $t('Delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showModal"
      class=" fixed min-h-screen w-full modal z-50 inset-0 bg-black/70 flex justify-center items-center py-8 px-2"
    >
      <div class="bg-white rounded-lg shadow-lg overflow-auto h-full py-4 w-full md:w-[448px]">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Partner' : 'Add Partner' }}
          </h3>
          <div class="w-full h-full">
            <form @submit.prevent="savePartner" class="flex flex-col gap-4">
              <div class="flex flex-col md:flex-row flex-wrap  ">
                <div class="w-full md:w-1/2 px-2">
                  <BaseInput
                    v-model="form.businessName.en"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Business Name (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2">
                  <BaseInput
                    v-model="form.businessName.ti"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Business Name (ትግርኛ)"
                  ></BaseInput>
                </div>

                <div class="w-full md:w-1/2 px-2">
                  <BaseInput
                    v-model="form.email"
                    type="email"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Email (English)"
                  ></BaseInput>
                </div>

                <div class="w-full md:w-1/2 px-2">
                  <BaseInput
                    v-model="form.phoneNumber"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Phone Number (English)"
                  ></BaseInput>
                </div>

                <div class="w-full px-2">
                  <BaseInput
                    v-model="form.website"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Website (English)"
                  ></BaseInput>
                </div>

                <div class="w-full md:w-1/2 px-2">
                  <BaseInput
                    v-model="form.specializeArea.en"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Specialized Area (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2">
                  <BaseInput
                    v-model="form.specializeArea.ti"
                    type="text"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Specialized Area (Tigrinya)"
                  ></BaseInput>
                </div>

                <div class="w-full md:w-1/2 px-2">
                  <BaseTextarea
                    v-model="form.description.en"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Description (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 px-2">
                  <BaseTextarea
                    v-model="form.description.ti"
                    required
                    class="p-2 rounded w-full"
                    placeholder="Description (Tigrinya)"
                  ></BaseTextarea>
                </div>
              </div>

              <div class="w-full">
                <BaseInput
                  type="file"
                  @change="captureImage"
                  class="p-2 rounded w-full"
                  placeholder="Upload Image"
                ></BaseInput>
              </div>

              <div class="flex w-full justify-center space-x-2">
                <BaseButton type="submit" class="bg-blue-500 text-white px-4 py-2 rounded"
                  >Save</BaseButton
                >
                <BaseButton @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded"
                  >Cancel</BaseButton
                >
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
