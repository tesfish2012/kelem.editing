<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const loading = ref(false)

const { UserLogin } = useAuthStore()

const loginForm = ref({
  studentId: "",
  password: ""
})

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await UserLogin(loginForm.value)

    // 🌟 SWEETALERT SUCCESS POPUP
    Swal.fire({
      title: "Login Successful!",
      text: "Welcome to your dashboard.",
      icon: "success",
      confirmButtonColor: "#288FB2",
      confirmButtonText: "Continue"
    })

    // Save token
    if (res.data) {
      localStorage.setItem("access_token", res.data)
    }

    // Redirect
    router.push({ name: "user-dashboard" })

  } catch (err) {
    console.error(err)

    // ❌ SWEETALERT ERROR POPUP
    Swal.fire({
      title: "Login Failed!",
      text: err.response?.data?.message || "Invalid Student ID or Password.",
      icon: "error",
      confirmButtonColor: "#d33"
    })

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div data-aos="fade-down" class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border">

      <div class="text-center mb-6">
        <img src="@/assets/logo.jpg" class="w-16 mx-auto mb-4 rounded-full" />
        <h2 class="text-2xl font-bold text-gray-800">Welcome Back!</h2>
        <p class="text-gray-500 text-sm">Log in to access your dashboard</p>
      </div>

      <!-- form -->
      <form @submit.prevent="handleLogin" class="space-y-5">

        <!-- Student ID -->
        <div class="relative">
          <font-awesome-icon icon="user" class="absolute left-3 top-3 text-gray-500" />
          <input
            class="input"
            type="text"
            v-model="loginForm.studentId"
            placeholder="Student ID or Email"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <font-awesome-icon icon="lock" class="absolute left-3 top-3 text-gray-500" />
          <input
            class="input"
            type="password"
            v-model="loginForm.password"
            placeholder="Password"
            required
          />
        </div>

        <!-- Login button -->
        <BaseButton
          type="submit"
          class="w-full  text-white py-3 rounded-lg font-semibold transition"
        >
          <font-awesome-icon icon="sign-in-alt" class="mr-2" />
          Login
        </BaseButton>

        <!-- Register link -->
        <div class="text-center mt-6 text-sm">
          Don't have an account?
          <router-link :to="{ name: 'e-learning-register' }" class="text-[#288FB2] font-semibold hover:underline">
            Create one now
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border rounded-lg pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-green-500;
}
</style>
