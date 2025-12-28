<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

import UserService from '@/services/UserService'

// import { useAuthStore } from '@/stores/auth'
// const { logIn } = useAuthStore()
const form = ref({
  email: ''
})

let message = ref('')
// let isFocus = ref(false)
function inputFocus() {}
// const router = useRouter()

async function handleLogin() {
  try {
    const res = await UserService.forgotPassword(form.value)
    if (res.success) {
      alert('We have sent a link to your email')
    }
  } catch (err) {
    // alert(err)
  }
}
</script>

<template>
  <section class="w-full h-screen px-[5%] flex items-center justify-center bg-[#288fb2]/10">
    <div class="shadow-lgx bg-white shadow flex flex-col justify-center p-6 space-y-4 w-[80%] md:w-[40%]">
      <router-link to="/" class="underline text-meyla-color1">{{$t('Home')}}</router-link>

      <h1 class="text-[16px] md:meyla-subtitle text-center">
        {{$t('Enter your verified email address and we will send you a password reset link.')}}
      </h1>

      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4 items-center">
        <BaseInput
          type="text"
          v-model="form.email"
          @handleFocus="inputFocus"
          inputClass="border focus:border focus:outline-none border-meyla-color1 focus:bg-white focus:text-black px-4x py-3x w-full placeholder:text-[#87CEFA]"
          placeholder="Enter your email"
          required
          :label="$t('Email')"
        ></BaseInput>

        <BaseButton
          class="w-full button transition-colors delay-200 duration-1000 hovcer:bg-[#325ac2]"
          type="submit"
          >{{$t('Submit')}}</BaseButton
        >
      </form>
      <h1 class="text-xl font-semibold text-red-400">{{ message }}</h1>
    </div>
  </section>
</template>


