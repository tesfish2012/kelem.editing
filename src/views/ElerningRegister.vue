<script setup>
import { ref } from "vue"
import StudentService from "@/services/StudentService"
import GradeService from "@/services/GradeService"
import BaseButton from '@/components/base/BaseButton.vue'
import Swal from "sweetalert2"
import { useRouter } from "vue-router"
const router = useRouter()
const grades = ref([])
const loading = ref(false)

const registerForm = ref({
  studentId: "",
  name: "",
  email: "",
  password: "",
  gradeId: ""
})

// Load Grades
GradeService.getAllGrades().then(res => {
  grades.value = res.data
})

const submitRegister = async () => {
  loading.value = true
  try {
    const res = await StudentService.register(registerForm.value)

    // 🌟 SWEETALERT SUCCESS MESSAGE
    if (res.data){
    Swal.fire({
      title: "Registered Successfully!",
      text: "Your student account has been created.",
      icon: "success",
      confirmButtonColor: "#288FB2",
      confirmButtonText: "Continue"
    })
      router.push('/e-learning')
}
    // Optionally redirect after success
  

  } catch (err) {
    console.log(err)

    // ❌ SweetAlert Error Popup
    Swal.fire({
      title: "Registration Failed!",
      text: err.res?.data?.message || "Something went wrong.",
      icon: "error",
      confirmButtonColor: "#d33"
    })
  }

  loading.value = false
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">

    <div data-aos="fade-down"
      class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border">

      <div class="text-center mb-6">
        <img src="@/assets/logo.png" class="w-16 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-800">Create Account</h2>
        <p class="text-gray-500 text-sm">Register to access your dashboard</p>
      </div>

      <!-- form -->
      <form @submit.prevent="submitRegister" class="space-y-5">

        <!-- Student ID -->
        <div class="relative">
          <font-awesome-icon icon="user" class="absolute left-3 top-3 text-gray-500" />
          <input
            class="input"
            type="text"
            v-model="registerForm.studentId"
            placeholder="Student ID"
            required
          />
        </div>

        <!-- Name -->
        <div class="relative">
          <font-awesome-icon icon="user-circle" class="absolute left-3 top-3 text-gray-500" />
          <input
            class="input"
            v-model="registerForm.name"
            type="text"
            placeholder="Full Name"
            required
          />
        </div>

        <!-- Email -->
        <div class="relative">
          <font-awesome-icon icon="envelope" class="absolute left-3 top-3 text-gray-500" />
          <input
            class="input"
            v-model="registerForm.email"
            type="email"
            placeholder="Email"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <font-awesome-icon icon="lock" class="absolute left-3 top-3 text-gray-500" />
          <input
            class="input"
            v-model="registerForm.password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <!-- Grade -->
        <select
          v-model="registerForm.gradeId"
          required
          class="w-full border rounded-lg px-3 py-3"
        >
          <option value="">Select Grade Lebel</option>
          <option v-for="g in grades" :key="g.id" :value="g.id">
           Grade {{ g.gradeLevel }}
          </option>
        </select>

        <BaseButton
          type="submit"
          class="w-full  text-white py-3 rounded-lg font-semibold transition"
        >
          <font-awesome-icon icon="check" class="mr-2" />
          Register
        </BaseButton>
          <div class="text-center mt-6 text-sm">
        Already have an account?
        
        <router-link :to="{ name: 'e-learning' }" class="text-[#288FB2] font-semibold hover:underline">Login now</router-link>
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
