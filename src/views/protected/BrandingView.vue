<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import SettingsService from '@/services/SettingsService'
import { BASE_AVATAR } from '@/config'

import swal from 'sweetalert'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

const router = useRouter()
const heroData = ref({
  heroTitle: { en: '', ti: '' },
  heroDescription: { en: '', ti: '' },
  heroImage: null
})

const heroes = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)

const saveHero = async () => {
  const formData = new FormData()
  formData.append('heroTitle', JSON.stringify(heroData.value.heroTitle))
  formData.append('heroDescription', JSON.stringify(heroData.value.heroDescription))
  if (heroData.value.heroImage) {
    formData.append('heroImage', heroData.value.heroImage)
  }

  try {
    const response = await SettingsService.createOrUpdateHero(
      editMode.value ? editId.value : '',
      formData
    )
    if (response.success) {
      successMessage.value = response.message
      swal({
        title: response.message,
        icon: 'success'
      })
      fetchHeroes()
      resetForm()
      closeModal()
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetwdorkError' })
    }
  }
}

const captureImage = (event) => {
  heroData.value.heroImage = event.target.files[0]
}

const fetchHeroes = async () => {
  try {
    const response = await SettingsService.getHeroData()
    // alert(response.data.length)
    heroes.value = response.data.map((item) => ({
      ...item,
      heroTitle: JSON.parse(item.heroTitle),
      heroDescription: JSON.parse(item.heroDescription)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch achievements'
  }
}

const editItem = (id) => {
  const item = heroes.value.find((hero) => hero.id === id)
  if (item) {
    heroData.value = {
      heroTitle: { en: item.heroTitle.en, ti: item.heroTitle.ti },
      heroDescription: { en: item.heroDescription.en, ti: item.heroDescription.ti },
      heroImage: null
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  const sure = window.confirm('Are you sure? This operation cannot be undone.')
  if (sure) {
    try {
      const response = await SettingsService.deleteHeroById(id)
      if (response.success) {
        successMessage.value = response.message
        fetchHeroes()
      }
    } catch (error) {
      errorMessage.value = 'Failed to delete hero'
    }
  }
}

const resetForm = () => {
  heroData.value = {
    heroTitle: { en: '', ti: '' },
    heroDescription: { en: '', ti: '' },
    heroImage: null
  }
  editMode.value = false
  editId.value = null
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

onMounted(() => {
  fetchHeroes()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Brands') }}</h2>
      <BaseButton @click="showModal = true" class="self-end"> {{ $t('Add Branding') }} </BaseButton>
    </div>
    <div v-if="heroes.length" class="col-span-12 w-full">
      <!-- <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div> -->
      <div class="w-full mx-auto">
        <!-- <div class="col-span-6 md:col-span-8 flex justify-start items-center">
          <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
            {{ showEnglish ? 'Tigrinya' : 'English' }}
          </button>
        </div> -->

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="hero in heroes" :key="hero.id" class="w-full md:w-auto">
            <div class="shadow flex flex-col gap-2 p-4 max-w-xs">
              <img
                v-if="hero.heroImage"
                :src="`${BASE_AVATAR}${hero.heroImage}`"
                alt="Hero Image"
                class="w-full h-36 object-cover mb-4"
              />
              <div v-if="language === 'en'">
                <h3 class="font-bold">{{ hero.heroTitle.en }}</h3>
                <p class="break-words">{{ hero.heroDescription.en }}</p>
              </div>
              <div v-else>
                <h3 class="font-bold">{{ hero.heroTitle.ti }}</h3>
                <p class="break-words">{{ hero.heroDescription.ti }}</p>
              </div>

              <div class="flex justify-end space-x-2">
                <button @click="editItem(hero.id)" class="text-blue-500">edit</button>
                <button @click="deleteItem(hero.id)" class="text-red-500">delete</button>
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
            {{ editMode ? 'Edit Brand' : 'Add Brand' }}
          </h3>
          <div class="">
            <form @submit.prevent="saveHero" class="flex flex-col gap-4">
              <div class="flex flex-wrap">
                <div class="w-full md:w-1/2 py-4 flex px-2">
                  <BaseInput
                    v-model="heroData.heroTitle.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Hero Title (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 py-4 px-2">
                  <BaseInput
                    v-model="heroData.heroTitle.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Hero Title (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 py-4 px-2">
                  <BaseTextarea
                    v-model="heroData.heroDescription.en"
                    inputClass="p-2 border border-gray-300 rounded h-30"
                    placeholder="Hero Description (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 py-4 px-2">
                  <BaseTextarea
                    v-model="heroData.heroDescription.ti"
                    inputClass="p-2 border border-gray-300 rounded -30"
                    placeholder="Hero Description (Tigrinya)"
                  ></BaseTextarea>
                </div>
                <div class="w-full px-2">
                  <BaseInput
                    @change="captureImage"
                    type="file"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Image"
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
                  editMode ? 'Save changes' : 'Save Hero'
                }}</BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
