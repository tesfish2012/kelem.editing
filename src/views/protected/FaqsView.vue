<script setup>
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'

import { useRouter } from 'vue-router'
import swal from 'sweetalert'
const router = useRouter()

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { language } = storeToRefs(useAuthStore())

import FAQsService from '@/services/FAQsService'

const faqs = ref([])
const errorMessage = ref('')
const successMessage = ref('')

const getAllFaqs = async () => {
  try {
    const response = await FAQsService.getFaqs()
    if (response.success) {
      // alert(response.data.length)
      faqs.value = response.data.map((item) => ({
        ...item,
        question: JSON.parse(item.question),
        answer: JSON.parse(item.answer)
      }))
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data) {
      return
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

const editForm = ref({
  question: { en: '', ti: '' },
  answer: { en: '', ti: '' }
})
const isEditing = ref(false)
const isEdit = (faq) => {
  isEditing.value = true
  editForm.value = faq
}

const submitEdit = async () => {
  try {
    const formData = {
      question: JSON.stringify(editForm.value.question),
      answer: JSON.stringify(editForm.value.answer)
    }
    const response = await FAQsService.updateFaq(editForm.value.id, formData)

    if (response.success) {
      getAllFaqs()

      setTimeout(() => {
        isEditing.value = false
      }, 1000)

      swal({
        title: response.message,
        icon: 'success',
        text: 'Editing frequently asked question'
      })
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

const deleteFaq = (faq) => {
  try {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this FAQ',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then((confirmDelete) => {
      if (confirmDelete) {
        FAQsService.deleteFaq(faq.id).then((response) => {
          if (response.success) {
            successMessage.value = response.message
            getAllFaqs()
            swal('FAQ has been deleted!', {
              icon: 'success'
            })
          }
        })
      }
    })
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

const isNew = ref(false)
const toggleCreate = () => {
  isNew.value = true
}

const form = ref({
  question: { en: '', ti: '' },
  answer: { en: '', ti: '' }
})

const createFAQ = async () => {
  try {
    const formData = {
      question: JSON.stringify(form.value.question),
      answer: JSON.stringify(form.value.answer)
    }
    const response = await FAQsService.createFaq(formData)
    if (response.success) {
      getAllFaqs()
      setTimeout(() => {
        form.value = { question: { en: '', ti: '' }, answer: { en: '', ti: '' } }
      }, 1000)
      swal({
        title: 'New FAQ added successfully',
        text: 'Adding new FAQ',
        icon: 'success'
      })
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

// const toggleLanguage = () => {
//   language ==='en'.value = !language ==='en'.value
// }

onMounted(() => {
  getAllFaqs()
})
</script>

<template>
  <section class="w-full">
    <BaseButton class="float-right p-1" @click="toggleCreate">{{ $t('Add') }}</BaseButton>

    <div class="w-full grid md:grid-cols-12 gap-2">
      <div :class="[{ 'col-span-8': isNew }, { 'col-span-12': !isNew }, 'w-full']">
        <div v-for="(faq, index) in faqs" :key="index" class="" :class="['w-full p-4 col-span-8']">
          <div class=" flex flex-col gap-2 p-2">
            <h4 class="font-semibold">
              {{ language === 'en' ? faq.question.en : faq.question.ti }}
            </h4>
            <p>{{ language === 'en' ? faq.answer.en : faq.answer.ti }}</p>
            <div class="manage flex gap-4">
              <button @click="isEdit(faq)">
                <font-awesome-icon icon="edit" class="text-blue-500"></font-awesome-icon></button
              ><button @click="deleteFaq(faq)">
                <font-awesome-icon icon="trash" class="text-red-500"></font-awesome-icon>
              </button>
            </div>
            <hr>
          </div>

          <p v-if="error">{{ error }}</p>
        </div>
      </div>
      <div
        class="bg-white/100 flex flex-col gap-2 p-4 shadow col-span-4 border-t-2 border-meyla-color1"
        v-if="isNew"
      >
        <h class="meyla-subtitle">Add FAQ</h>
        <p v-if="error">{{ error }}</p>
        <form @submit.prevent="createFAQ" class="bg-white/100 flex flex-col gap-2">
          <BaseInput
            v-model="form.question.en"
            type="text"
            required
            inputClass="px-2  border border-meyla-color1"
            label="Question (English)"
          ></BaseInput>
          <BaseInput
            v-model="form.question.ti"
            type="text"
            required
            inputClass="px-2  border border-meyla-color1"
            label="Question (Tigrinya)"
          ></BaseInput>
          <BaseTextarea
            v-model="form.answer.en"
            rows="5"
            label="Answer (English)"
            required
            class="bg-slate-400"
          ></BaseTextarea>
          <BaseTextarea
            v-model="form.answer.ti"
            rows="5"
            label="Answer (Tigrinya)"
            required
            class="bg-slate-400"
          ></BaseTextarea>
          <BaseButton type="submit">Save FAQ</BaseButton>
        </form>
      </div>
    </div>
  </section>
  <section
    class="fixed inset-0 z-50 bg-black/70 modal flex flex-col items-center justify-center gap-3"
    v-if="isEditing"
  >
    <div class="bg-white/100 w-full md:w-1/2 flex flex-col gap-2 p-4 items-center shadow">
      <button
        class="text-lg bg-gray-500 text-white py-1 px-2 self-end"
        @click="isEditing = !isEditing"
      >
        Cancel
      </button>
      <h>Edit Frequently Asked Question</h>
      <p v-if="successMessage" class="text-green-700">{{ successMessage }}</p>
      <form @submit.prevent="submitEdit" class="bg-white/100 w-full flex flex-col gap-2">
        <BaseInput
          v-model="editForm.question.en"
          type="text"
          inputClass=" bg-white border border-meyla-color1"
          placeholder="Question (English)"
          label="Question (English)"
        ></BaseInput>
        <BaseInput
          v-model="editForm.question.ti"
          type="text"
          inputClass=" bg-white border border-meyla-color1"
          placeholder="Question (Tigrinya)"
          label="Question (Tigrinya)"
        ></BaseInput>
        <BaseTextarea
          v-model="editForm.answer.en"
          rows="5"
          placeholder="Answer (English)"
          textareaClass="bg-white border border-meyla-color1"
          label="Answer (English)"
        ></BaseTextarea>
        <BaseTextarea
          v-model="editForm.answer.ti"
          rows="5"
          placeholder="Answer (Tigrinya)"
          textareaClass="bg-white border border-meyla-color1"
          label="Answer (Tigrinya)"
        ></BaseTextarea>
        <p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>
        <BaseButton type="submit">Save Changes</BaseButton>
      </form>
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
