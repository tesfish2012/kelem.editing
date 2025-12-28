<script setup>
import { ref, onMounted,computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import AchievementService from '@/services/AchievementService'
import { BASE_AVATAR } from '@/config'
import swal from 'sweetalert'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

const router = useRouter()
const achievement = ref({
  title: { en: '', ti: '' },
  awardFrom: { en: '', ti: '' },
  reason: { en: '', ti: '' },
  body: { en: '', ti: '' },
  date: '',
  image: null
})

const achievements = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const editMode = ref(false)
const editId = ref(null)
const showModal = ref(false)
const saveAchievement = async () => {
  const formData = new FormData()
  formData.append('title', JSON.stringify(achievement.value.title))
  formData.append('awardFrom', JSON.stringify(achievement.value.awardFrom))
  formData.append('reason', JSON.stringify(achievement.value.reason))
  formData.append('body', JSON.stringify(achievement.value.body))
  formData.append('date', achievement.value.date)
  if (achievement.value.image) {
    formData.append('image', achievement.value.image)
  }

  try {
    const response = await AchievementService.createOrUpdateAchievement(
      editMode.value ? editId.value : '',
      formData
    )
    if (response.success) {
      successMessage.value = response.message
      swal({
        title: response.message,
        icon: 'success',
      })
      fetchAchievements()
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
function goToTrash(){
  router.push("achivements/trashed")
}
const captureImage = (event) => {
  achievement.value.image = event.target.files[0]
}
const fetchAchievements = async () => {
  try {
    const response = await AchievementService.getAllAchievements()
    achievements.value = response.data.map((item) => ({
      ...item,
      title: JSON.parse(item.title),
      awardFrom: JSON.parse(item.awardFrom),
      reason: JSON.parse(item.reason),
      body: JSON.parse(item.body)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to fetch achievements'
  }
}
const editItem = (id) => {
  const item = achievements.value.find((ach) => ach.id === id)
  if (item) {
    achievement.value = {
      title: { en: item.title.en, ti: item.title.ti },
      awardFrom: { en: item.awardFrom.en, ti: item.awardFrom.ti },
      reason: { en: item.reason.en, ti: item.reason.ti },
      body: { en: item.body.en, ti: item.body.ti },
      date: item.date,
      image: null
    }
    editMode.value = true
    editId.value = id
    showModal.value = true
  }
}

const deleteItem = async (id) => {
  try {
    const response = await AchievementService.deleteAchievementById(id)
    if (response.success) {
      successMessage.value = response.message
      fetchAchievements()
    }
  } catch (error) {
    errorMessage.value = 'Failed to delete achievement'
  }
}

const searchAchievements = ref('');

const filteredAchievements = computed(() => {
  if (searchAchievements.value) {
    return achievements.value.filter((achievement) =>
      Object.values(achievement).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchAchievements.value.toLowerCase())
      )
    );
  } else {
    return achievements.value;
  }
});

const resetForm = () => {
  achievement.value = {
    title: { en: '', ti: '' },
    awardFrom: { en: '', ti: '' },
    reason: { en: '', ti: '' },
    body: { en: '', ti: '' },
    date: '',
    image: null
  }
  editMode.value = false
  editId.value = null
}
const closeModal = () => {
  showModal.value = false
  resetForm()
}
onMounted(() => {
  fetchAchievements()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Memories') }}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchAchievements"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
        <BaseButton @click="goToTrash" class="p-0 w-full"> trashed </BaseButton>
        <BaseButton @click="showModal = true" class="p-0 w-full"> {{ $t('Add') }} </BaseButton>
      </div>
    </div>
    <div v-if="achievements.length" class="w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <div class="col-span-6 md:col-span-8 flex justify-start items-center">
        <!-- <button @click="toggleLanguage" class="px-4 py-2 rounded text-blue-500">
          {{ showEnglish ? 'Tigrinya' : 'English' }}
        </button> -->
      </div>
      <div
        class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 place-items-startz bg-[#F5F5F5]"
      >
        <div v-for="achievement in filteredAchievements" :key="achievement.id" class="w-full">
          <div class="shadow p-4 bg-white">
            <img
              v-if="achievement.image"
              :src="`${BASE_AVATAR}${achievement.image}`"
              alt="Achievement Image"
              class="w-full h-32 object-cover"
            />
            <div v-if="language === 'en'">
              <h3 class="font-bold">{{ achievement.title.en }}</h3>
              <p>{{ achievement.awardFrom.en }}</p>
              <p>{{ achievement.reason.en }}</p>
              <p>{{ achievement.body.en }}</p>
            </div>
            <div v-else>
              <h3 class="font-bold">{{ achievement.title.ti }}</h3>
              <p>{{ achievement.awardFrom.ti }}</p>
              <p>{{ achievement.reason.ti }}</p>
              <p>{{ achievement.body.ti }}</p>
            </div>
            <p>{{ new Date(achievement.date).toLocaleDateString() }}</p>

            <div class="flex justify-end space-x-2">
              <button @click="editItem(achievement.id)" class="text-blue-500">
                {{ $t('Edit') }}
              </button>
              <button @click="deleteItem(achievement.id)" class="text-red-500">
                {{ $t('Delete') }}
              </button>
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
            {{ editMode ? 'Edit Achievement' : 'Add Achievement' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="saveAchievement" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="achievement.title.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Title (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="achievement.title.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Title (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="achievement.awardFrom.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Award From (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="achievement.awardFrom.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Award From (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="achievement.reason.en"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Reason (English)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="achievement.reason.ti"
                    type="text"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Reason (Tigrinya)"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="achievement.body.en"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Body (English)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseTextarea
                    v-model="achievement.body.ti"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Body (Tigrinya)"
                  ></BaseTextarea>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    v-model="achievement.date"
                    type="date"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Date"
                  ></BaseInput>
                </div>
                <div class="w-full md:w-1/2 px-2 mb-4">
                  <BaseInput
                    @change="captureImage"
                    type="file"
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Image"
                  ></BaseInput>
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
                  editMode ? 'Save changes' : 'Save Achievement'
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
