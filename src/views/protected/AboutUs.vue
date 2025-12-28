<script setup>
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useRouter } from 'vue-router'
import swal from 'sweetalert'
import SettingsService from '@/services/SettingsService'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

const router = useRouter()
const aboutus = ref([])

const getAboutus = async () => {
  try {
    const response = await SettingsService.getAboutus()
    if (response.success) {
      aboutus.value = response.data.map((item) => ({
        ...item,
        background: JSON.parse(item.background),
        mission: JSON.parse(item.mission),
        vision: JSON.parse(item.vision),
        values: JSON.parse(item.values),
        slogan: JSON.parse(item.slogan),
        goals: JSON.parse(item.goals),
        programs: JSON.parse(item.programs),
        plans: JSON.parse(item.plans)
      }))
    }
  } catch (error) {
    console.error('Error fetching about us data:', error)
  }
}

const editForm = ref({
  background: { en: '', ti: '' },
  mission: { en: '', ti: '' },
  vision: { en: '', ti: '' },
  values: { en: '', ti: '' },
  slogan: { en: '', ti: '' },
  goals: { en: '', ti: '' },
  programs: { en: '', ti: '' },
  plans: { en: '', ti: '' }
})
const isEditing = ref(false)

const isEdit = (about) => {
  isEditing.value = true
  editForm.value = { ...about }
}

const message = ref('')
const submitEdit = async () => {
  try {
    const formData = {
      background: JSON.stringify(editForm.value.background),
      mission: JSON.stringify(editForm.value.mission),
      vision: JSON.stringify(editForm.value.vision),
      values: JSON.stringify(editForm.value.values),
      slogan: JSON.stringify(editForm.value.slogan),
      goals: JSON.stringify(editForm.value.goals),
      programs: JSON.stringify(editForm.value.programs),
      plans: JSON.stringify(editForm.value.plans)
    }

    const response = await SettingsService.updateAboutus(editForm.value.id, formData)
    if (response.success) {
      isEditing.value = false
      getAboutus()
      swal({
        title: response.message,
        text: 'About us content updated successfully',
        icon: 'success'
      })
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      message.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

onMounted(() => {
  getAboutus()
})

</script>

<template>
  <section class="w-full">
    <div class="w-full flex flex-col gap-2 py-6">
      <!-- <div class="flex justify-end mb-4">
        <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
          {{ language ==='en' ? 'Tigrinya' : 'English' }}
        </button>
      </div> -->
      <div v-for="(about, index) in aboutus" :key="index" class="w-full">
        
        <div class="bg-white w-full grid grid-cols-2 md:grid-cols-3 ic gap-4 overflow-auto">
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Background') }}</h1>
            <p>{{ language === 'en' ? about.background.en : about.background.ti }}</p>
          </div>
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Mission') }}</h1>
            <p>{{ language === 'en' ? about.mission.en : about.mission.ti }}</p>
          </div>
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Vision') }}</h1>
            <p>{{ language === 'en' ? about.vision.en : about.vision.ti }}</p>
          </div>
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Values') }}</h1>
            <p>{{ language === 'en' ? about.values.en : about.values.ti }}</p>
          </div>
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Slogan') }}</h1>
            <p>{{ language === 'en' ? about.slogan.en : about.slogan.ti }}</p>
          </div>
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Goals') }}</h1>
            <p>{{ language === 'en' ? about.goals.en : about.goals.ti }}</p>
          </div>
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Programs') }}</h1>
            <p>{{ language === 'en' ? about.programs.en : about.programs.ti }}</p>
          </div>
          <div class="flex flex-col gap-2 shadow p-4">
            <h1 class="font-semibold">{{ $t('Plans') }}</h1>
            <p>{{ language === 'en' ? about.plans.en : about.plans.ti }}</p>
          </div>
          
        </div>
        <div class="w-full flex justify-end">
          <button @click="isEdit(about)">
            <font-awesome-icon icon="edit" class="text-blue-500"></font-awesome-icon>
          </button>
        </div>
      </div>
    </div>
  </section>
  <div 
  v-if="isEditing" 
  class="fixed inset-0 z-50 bg-black/70 flex justify-center items-center"
>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto p-6">
   
    <div class="text-center">
      <h3 class="text-lg font-medium text-gray-900"></h3>
      <div class="mt-4">
        <form @submit.prevent="submitEdit" class="flex flex-col gap-4">
            <div class="flex flex-wrap -mx-2">
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.mission.en"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Title (English)"
                  label="Mission"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.mission.ti"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Title (Tigrinya)"
                  label="ተልእኾ"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.vision.en"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Award From (English)"
                  label="vision"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.vision.ti"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Award From (Tigrinya)"
                  label="ራእይ"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.values.en"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Reason (English)"
                  label="values"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.values.ti"
                  type="text"
                  required
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Reason (Tigrinya)"
                  label="ክብርታት"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseTextarea
                  v-model="editForm.background.en"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (English)"
                  label="background"
                ></BaseTextarea>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseTextarea
                  v-model="editForm.background.ti"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (Tigrinya)"
                  label="ድሕረ ባይታ"
                ></BaseTextarea>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.slogan.en"
                  type="text"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="slogan"
                  label="slogan"
                ></BaseInput>
              </div>
              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.slogan.ti"
                  type="text"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder=" መሪሕ ቃል"
                  label="መሪሕ ቃል"
                ></BaseInput>
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.goals.ti"
                  type="text"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Image"
                  label="goals"
                ></BaseInput>
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseInput
                  v-model="editForm.goals.ti"
                  type="text"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="goals"
                  label="ዓላማታት"
                ></BaseInput>
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseTextarea
                  v-model="editForm.plans.en"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (Tigrinya)"
                  label="plans"
                ></BaseTextarea>
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseTextarea
                  v-model="editForm.plans.ti"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (Tigrinya)"
                  label="ትልሚታት"
                ></BaseTextarea>
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseTextarea
                  v-model="editForm.programs.ti"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (Tigrinya)"
                  label="programs"
                ></BaseTextarea>
              </div>

              <div class="w-full md:w-1/2 px-2 mb-4">
                <BaseTextarea
                  v-model="editForm.programs.ti"
                  inputClass="p-2 border border-gray-300 rounded"
                  placeholder="Body (Tigrinya)"
                  label="መደባት"
                ></BaseTextarea>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <BaseButton
                @click="isEditing = !isEditing"
                type="button"
                class="bg-gray-500 text-white px-4 py-2 rounded"
                >Cancel</BaseButton
              >
              <BaseButton type="submit" class="bg-[#37a000] text-white px-2 py-2 rounded">
                Save changes
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
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
