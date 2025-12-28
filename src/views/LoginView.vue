<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

import { useAuthStore } from '@/stores/auth'

const { logIn } = useAuthStore()
const { errorMessage } = storeToRefs(useAuthStore())
const formData = ref({
  username: '',
  password: ''
})

// let isFocus = ref(false)
function inputFocus() {}
const router = useRouter()

const loginLoader = ref(false)

async function handleLogin() {
  loginLoader.value = true
  errorMessage.value = ''
  const res = await logIn(formData.value)
  // console.log(res)
  if (res) {
    router.push({ name: 'dashboard' })
    formData.value = {}
  }
}
</script>

<template>
  <section class="w-full h-screen px-[1%] md:px-[10%] flex items-center justify-center bg-[#288fb2]/10">
    <div class="flex flex-col justify-center w-[80%] md:w-[40%] border rounded-xl p-6 gap-2 bg-white shadow-xl">
      <img
        src="@/assets/logo.png"
        class="w-20 rounded-fullX h-20 mx-auto object-fit bg-cover object-center"
        width="200px"
        height="200px"
      />
      <h1 class="meyla-subtitle text-center">Login</h1>
      <p v-if="errorMessage" class="text-sm text-red-400 text-center">{{ errorMessage }}</p>
      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4 items-center">
        <BaseInput
          type="text"
          v-model="formData.username"
          @handleFocus="inputFocus"
          inputClass="border focus:border focus:outline-none border-meyla-color1 focus:bg-white focus:text-black  w-full placeholder:text-[#87CEFA]"
          :placeholder="$t('Email')"
          :label="$t('Email')"
        ></BaseInput>
        <BaseInput
          type="password"
          v-model="formData.password"
          @handleFocus="inputFocus"
          inputClass="border focus:border focus:outline-none border-meyla-color1 focus:bg-white focus:text-black w-full placeholder:text-[#87CEFA]"
          :placeholder="$t('Password')"
          :label="$t('Password')"
        ></BaseInput>
        <router-link
          :to="{ name: 'forgot-password' }"
          class="self-end text-blue-700 hover:text-meyla-color1"
          >{{ $t('Forgot Password') }}?</router-link
        >
        <BaseButton
          class="w-full button flex group items-center justify-center gap-4 transition-colors delay-200 duration-1000 border rounded hovder:bg-[#fff] hover:border-meyla-color1 hosver:text-meyla-color1"
          type="submit"
        >
          <p
            class="w-4 h-4 rounded-full border-2 border-white border-l-blue-700 animate-spin duration-[2000s]"
            v-if="loginLoader && errorMessage === ''"
          ></p>
          <span>{{$t('Login')}}</span>
        </BaseButton>
      </form>
      <!-- <h1 class="text-xl font-semibold text-red-400">{{ message }}</h1> -->
    </div>
  </section>
</template>

<style scoped></style>
