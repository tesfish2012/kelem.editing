<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import UserService from '@/services/UserService'

import { useRoute } from 'vue-router'
const route = useRoute()
const form = ref({ newPassword: '' })
const confirmPassword = ref('')
let successMessage = ref('')
let confirmError = ref('')
const errorMessage = ref('')
const resetPassword = async () => {
  try {
    if (confirmPassword.value === form.value.newPassword) {
      const response = await UserService.resetPassword(route.query.resetToken, form.value)
      // console.log(response)
      if (response.success) {
        successMessage.value = response.message
        form.value = {}
        confirmPassword.value = ''
      }
    } else {
      confirmError.value = 'please confirm password'
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
      // errorMessage.value = 'An unexpected error occurred.'
    }
  }
}
</script>

<template>
  <section class="w-full p-12 flex items-center h-screen bg-[#288fb2]/10">
    <div class="flex items-center justify-center w-full">
      <div class="bg-white p-4 w-full md:w-2/5 shadow flex flex-col gap-4">
        <router-link to="/" class="underline text-meyla-color1">Take Me Home</router-link>
        <h1 class="text-center text-xl font-light">Reset your password</h1>
        <p v-if="successMessage" class="text-sm text-meyla-color1">{{ successMessage }}</p>
        <form @submit.prevent="resetPassword" class="flex w-full flex-col gap-2">
          <BaseInput
            label="New Password"
            v-model="form.newPassword"
            type="password"
            input-class="px-8 py-3"
            required
          ></BaseInput>
          <BaseInput
            label="Confirm Password"
            v-model="confirmPassword"
            type="password"
            input-class="px-8 py-3"
            required
          ></BaseInput>

          <span v-if="confirmError" class="text-red-700 text-center text-sm">{{
            confirmError
          }}</span>
          <p v-if="errorMessage" class="text-sm text-meyla-color1">{{ errorMessage }}</p>

          <BaseButton class="p-0">Reset Password</BaseButton>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
