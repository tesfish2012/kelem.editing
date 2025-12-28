<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import UserService from '@/services/UserService'

const myProfile = ref({})
const profile = async () => {
  try {
    const response = await UserService.getProfile()
    if (response.success) {
      myProfile.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data) {
      return
    } else {
      // router.push({ name: 'NetworkError' })
    }
  }
}

const form = ref({ oldPassword: '', newPassword: '' })
const isEdit = ref(false)
const editForm = ref({})
const confirmPassword = ref('')
let successMessage = ref('')
let confirmError = ref('')
let errorMessage = ref('')
const changePassword = async () => {
  try {
    if (confirmPassword.value === form.value.newPassword) {
      const response = await UserService.changePassword(form.value)
      if (response.success) {
        successMessage.value = response.message
        form.value = {}
        confirmPassword.value = ''
        errorMessage.value = ''
      }
    } else {
      confirmError.value = 'please confirm password'
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

const editProfile = async (profile) => {
  isEdit.value = true
  editForm.value = profile
}
const submit = async () => {
  try {
    const response = await UserService.changeAccount(editForm.value)
    if (response.success) {
      successMessage.value = response.message
      editForm.value = {}

      errorMessage.value = ''
      setTimeout(() => {
        isEdit.value = false
        successMessage.value = ''
      }, 3000)
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      setTimeout(() => {
        // router.push({ name: 'NetworkError' })
      }, 2000)
    }
  }
}

onMounted(profile)
</script>

<template>
  <section class="w-full p-12 flex flex-col justify-center items-center">
    <div class="grid md:grid-cols-12 gap-4 w-full">
      <div
        class="col-span-8 meyla bg-white flex flex-col gap-2 relative p-4 border-t-2 border-meyla-color1"
      >
        <div>
          <h1 class="meyla-subtitle">Full Name</h1>
          <h3>{{ myProfile.name }}</h3>
        </div>
        <div>
          <h1 class="meyla-subtitle">Email Address</h1>
          <h1>{{ myProfile.email }}</h1>
        </div>
        <div>
          <h1 class="meyla-subtitle">Phone Number</h1>
          <h1>{{ myProfile.phoneNumber }}</h1>
        </div>
        <button @click="editProfile(myProfile)" class="text-blue-500">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </button>
      </div>
      <div class="col-span-4 bg-white p-4">
        <h1 class="text-center">Change Password</h1>
        <p v-if="successMessage" class="text-small text-meyla-color1">{{ successMessage }}</p>
        <form @submit.prevent="changePassword" class="flex flex-col gap-2">
          <BaseInput
            label="Current Password"
            v-model="form.oldPassword"
            type="password"
            required
            inputClass="px-2 py-1"
          ></BaseInput>
          <BaseInput
            label="New Password"
            v-model="form.newPassword"
            type="password"
            required
            inputClass="px-2 py-1"
          ></BaseInput>
          <BaseInput
            label="Re-enter new password"
            type="password"
            v-model="confirmPassword"
            required
            inputClass="px-2 py-1"
          ></BaseInput>

          <span v-if="confirmError" class="text-red-700 text-center text-sm">{{
            confirmError
          }}</span>
          <BaseButton>Save Changes</BaseButton>
        </form>
      </div>
    </div>
    <div class="flex w-full flex-col items-center justify-center bg-white m-4 p-4" v-if="isEdit">
      <p v-if="successMessage" class="text-small text-meyla-color1">{{ successMessage }}</p>

      <form @submit.prevent="submit" class="flex flex-col gap-4 border border-meyla-color1 p-6">
        <BaseInput v-model="editForm.name" inputClass="px-8  py-3" label="Full Name"></BaseInput>
        <BaseInput v-model="editForm.email" inputClass="px-8  py-3" label="Email"></BaseInput>
        <BaseInput
          v-model="editForm.phoneNumber"
          inputClass="px-8  py-3"
          label="Phone Number"
        ></BaseInput>
        <span v-if="errorMessage" class="text-red-700 text-center text-sm">{{ errorMessage }}</span>
        <BaseButton type="submit">Save Changes</BaseButton>
      </form>
    </div>
  </section>
</template>

<style scoped>
/* .meyla {
  background-image: url('http://localhost:5173/src/assets/meyla-logo.png');
  background-repeat: no-repeat;
  width: 100%;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  object-position: center;
} */
</style>
