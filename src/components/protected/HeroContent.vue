<script setup>
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseFileInput from '../base/BaseFileInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

import SettingsService from '@/services/SettingsService'
import { BASE_AVATAR } from '@/config'

const hero = ref({})
const getAllHero = async () => {
  const response = await SettingsService.getHeroData()
  if (response.success) {
    hero.value = response.data
  }
}

const editForm = ref({})
const error = ref('')

const isEditing = ref(false)
const isEdit = (hero) => {
  isEditing.value = true
  editForm.value = hero
}
const heroImage = ref('')

const captureImage = (file) => {
  heroImage.value = file
  editForm.value.heroImage = heroImage.value
}
const submitEdit = async () => {
  const formData = new FormData()
  formData.append('heroTitle', editForm.value.heroTitle)
  formData.append('heroDescription', editForm.value.heroDescription)
  formData.append('numberOfStudents', editForm.value.numberOfStudents)

  formData.append('heroImage', editForm.value.heroImage)

  const response = await SettingsService.updateHero(editForm.value._id, formData)
  
  if (response.success) {
    isEditing.value = false

    getAllHero()
  } else {
    error.value = response.message
  }
}

onMounted(() => {
  getAllHero()
})
</script>

<template>
  <section class="w-full grid grid-cols-1 md:grid-cols-12 py-4 gap-2">
    <div
      :class="[
        'w-full flex flex-col gap-2 ',
        { 'col-span-8': isEditing },
        { 'col-span-12': !isEditing }
      ]"
    >
      <div class="w-full" v-if="hero">
        <div class="bg-white/5 w-full p-4">
          <h4 class="font-semibold">{{ hero.heroTitle }}</h4>
          <p>{{ hero.heroDescription }}</p>

          <img :src="BASE_AVATAR + hero.heroImage" alt="" />
         
          <!-- <p>{{ hero.numberOfStudents }}</p> -->
          <div class="manage flex justify-between">
            <button @click="isEdit(hero)">
              <font-awesome-icon icon="edits" class="text-blue-500"></font-awesome-icon>
            </button>
          </div>
          <p v-if="error">{{ error }}</p>
        </div>
      </div>
      <div v-else class="bg-white/100">No data found</div>
    </div>

    <div class="col-span-4 bg-white w-full" v-if="isEditing">
      <h3 v-if="error">{{ error }}</h3>
      <form @submit.prevent="submitEdit" class="bg-white/100 flex flex-col gap-4">
        <BaseInput
          v-model="editForm.heroTitle"
          type="text"
          inputClass="px-4 py-1 bg-white border-0 outline outline-meyla-color1"
          placeholder="Hero Title"
        ></BaseInput>
        <BaseTextarea
          v-model="editForm.heroDescription"
          rows="5"
          placeholder="Hero description"
          textareaClass="px-4 py-1 bg-white border-none outline outline-meyla-color1"
        ></BaseTextarea>
        <BaseInput
          v-model="editForm.numberOfStudents"
          type="text"
          inputClass="px-4 py-1 bg-white border-0 outline outline-meyla-color1"
          placeholder="Hero Title"
        ></BaseInput>
        <BaseFileInput
          v-model="editForm.heroImage"
          @image-update="captureImage($event)"
          label="upload hero image"
          class="p-0"
        >
        </BaseFileInput>
        <BaseButton type="submit">Save Changes</BaseButton>
      </form>
    </div>
  </section>
</template>
