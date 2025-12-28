<script setup>
// This component is News/messages component
import { onMounted, ref, computed } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import MessageService from '@/services/MessageService'

import { useRouter } from 'vue-router'
const router = useRouter()

// initialize message/new
// const form = ref({
//   fullName: '',
//   email: '',
//   phoneNumber: '',
//   subject: '',
//   message: ''
// })

let editForm = ref({})
const errorMessage = ref('')
const successMessage = ref('')

// async function saveMessage() {
//   try {
//     const response = await MessageService.createMessage(form.value)
//     if (response.success) {
//       successMessage.value = response.message
//       getAllMessages()
//       form.value = {
//         fullName: '',
//         email: '',
//         phoneNumber: '',
//         subject: '',
//         message: ''
//       }
//       errorMessage.value = ''
//     }
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       errorMessage.value = error.response.data.message
//     } else {
//       router.push({ name: 'NetworkError' })
//     }
//   }
// }

const messages = ref([])
async function getAllMessages() {
  try {
    const response = await MessageService.getAllMessages()

    if (response.success) {
      messages.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data) {
      return true
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

const deleteMessage = async (id) => {
  try {
    if (confirm('Are you sure to delete this message')) {
      const response = await MessageService.deleteMessage(id)

      if (response.success) {
        successMessage.value = response.message
        getAllMessages()
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

let isEditing = ref(false)
// const editMessage = (message) => {
//   isEditing.value = true
//   editForm.value = message
// }

async function submitEdit() {
  try {
    const response = await MessageService.updateMessage(editForm.value._id, editForm.value)
    if (response.success) {
      successMessage.value = response.message

      getAllMessages()
      editForm.value = {
        fullName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: ''
      }
      isEditing.value = false
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
const searchMessage = ref('')
const filteredMessages = computed(() => {
  if (searchMessage.value) {
    return messages.value.filter((msg) => {
      return Object.values(msg).some((value) => {
        if (value !== null && value !== undefined) {
          return value.toString().toLowerCase().includes(searchMessage.value.toLowerCase())
        }
        return false
      })
    })
  } else {
    return messages.value
  }
})
onMounted(getAllMessages)
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <h2 class="text-xl font-bold">{{ $t('Feedbacks') }}</h2>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchMessage"
          placeholder="Search ..."
        ></base-input>
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
       
      </div>
    </div>
    <div class="col-span-8z w-full flex flex-col bg-white">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        <div v-for="(message, index) in filteredMessages" :key="index" class="shadow px-4 py-2">
          <div class="flex gap-4 py-8">
            <div class="w-full flex flex-col gap-1">
              <h1 class="font-semibold">{{ message.fullName }}</h1>
              <h3 class="text-gray-500">{{ message.email }}</h3>
              <h3 class="text-gray-500">{{ message.phoneNumber }}</h3>

              <h3 class="text-gray-500">{{ message.subject }}</h3>

              <p class="text-sm whitespace-normal break-all">{{ message.message }}</p>
            </div>
          </div>

          <div class="flex gap-8">
            <!-- <button class="text-blue-500 text-sm" @click="editMessage(message)">Edit</button -->
            <button class="text-red-500 text-sm" @click="deleteMessage(message.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="col-span-4  bg-white p-4 border-2 border-l-0 border-r-0 border-b-0 border-t-[#287B45]">
      <h1 class="text-center meyla-subtitle">Add Message</h1>
      <p v-if="successMessage" class="text-green-700 text-center">{{ successMessage }}</p>

      <form @submit.prevent="saveMessage" class="mx-auto flex flex-wrap gap-4 bg-white">
        <BaseInput
          v-model="form.fullName"
          type="text"
          required
          inputClass="px-8  pl-12  py-3"
          placeholder="Full Name"
          icon="user"
        ></BaseInput>
        <BaseInput
          v-model="form.email"
          type="email"
          icon="envelope"
          inputClass="px-8 pl-12 py-3"
          required
          placeholder="Email Address"
          autocomplete="true"
        ></BaseInput>

        <BaseInput
          v-model="form.phoneNumber"
          type="text"
          inputClass="px-8  pl-12 py-3"
          icon="phone"
          required
          placeholder="Phone Number"
        ></BaseInput>
        <BaseInput
          v-model="form.subject"
          type="comment"
          icon="tag"
          required
          inputClass="px-8 pl-12 py-3"
          placeholder="Subject"
        ></BaseInput>

        <BaseTextarea
          v-model="form.message"
          rows="4"
          textareaClasses=""
          placeholder="Message"
          icon="comment"
        ></BaseTextarea>
        <p v-if="errorMessage" class="text-red-700 text-center">{{ errorMessage }}</p>
        <BaseButton type="submit">Save Message</BaseButton>
      </form>
    </div> -->
  </section>
  <div
    class="modal fixed flex inset-0 z-20 justify-center items-center bg-white/80"
    v-if="isEditing"
  >
    <div class="flex justify-between bg-white p-4 gap-4 shadow">
      <div class="">
        <p v-if="successMessage" class="text-green-700">{{ successMessage }}</p>
        <form @submit.prevent="submitEdit" class="flex flex-col gap-4">
          <BaseInput
            v-model="editForm.fullName"
            @handleEnter="submitForm"
            type="text"
            required
            inputClass="px-8 py-3"
            placeholder="Full Name"
          ></BaseInput
          ><BaseInput
            v-model="editForm.email"
            @handleEnter="submitForm"
            type="text"
            required
            inputClass="px-8 py-3"
            placeholder="Email"
          ></BaseInput>
          <BaseInput
            v-model="editForm.phoneNumber"
            @handleEnter="submitForm"
            type="text"
            inputClass="px-8 py-3"
            placeholder="Phone Number"
          ></BaseInput>
          <BaseInput
            v-model="editForm.subject"
            @handleEnter="submitForm"
            type="text"
            required
            inputClass="px-8 py-3"
            placeholder="Subject"
          ></BaseInput>
          <BaseTextarea
            v-model="editForm.message"
            rows="4"
            textareaClasses=""
            placeholder="Message"
            inputClass="justify-self-end"
          ></BaseTextarea>
          <p v-if="errorMessage" class="text-red-700 text-center">{{ errorMessage }}</p>
          <BaseButton type="submit">Save Changes</BaseButton>
        </form>
      </div>
      <button @click="isEditing = !isEditing" class="self-start">Cancel</button>
    </div>
  </div>
</template>
