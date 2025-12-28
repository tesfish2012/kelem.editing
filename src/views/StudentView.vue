<template>
  <section class="w-full px-[1%] md:px-[7%] py-2 md:py-4 bg-[#288fb2]/10">
    <section class="w-full bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- First Name -->
          <div>
            <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="first_name"
              v-model="student.first_name"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Middle Name -->
          <div>
            <label for="middle_name" class="block text-sm font-medium text-gray-700">Middle Name</label>
            <input
              type="text"
              id="middle_name"
              v-model="student.middle_name"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="last_name"
              v-model="student.last_name"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Age -->
          <div>
            <label for="age" class="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              id="age"
              v-model="student.age"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              v-model="student.gender"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Phone Number -->
          <div>
            <label for="phone_number" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              v-model="student.phone_number"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="student.email"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Grade Level -->
          <div>
            <label for="grade_level" class="block text-sm font-medium text-gray-700">Grade Level</label>
            <select
              id="grade_level"
              v-model="student.grade_level"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <!-- Address Section -->
          <div class="md:grid md:grid-cols-3 gap-6">
            <div>
              <label for="kefle_ketema" class="block text-sm font-medium text-gray-700">Kefle Ketema</label>
              <input
                type="text"
                id="kefle_ketema"
                v-model="student.kefle_ketema"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="kebele" class="block text-sm font-medium text-gray-700">Kebele</label>
              <input
                type="text"
                id="kebele"
                v-model="student.kebele"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="ketena" class="block text-sm font-medium text-gray-700">Ketena</label>
              <input
                type="text"
                id="ketena"
                v-model="student.ketena"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6">
            <BaseButton
          class="w-full button flex group items-center justify-center gap-4 transition-colors delay-200 duration-1000 border rounded hovder:bg-[#fff] hover:border-meyla-color1 hosver:text-meyla-color1"
          type="submit"
        >
          <p
            class="w-4 h-4 rounded-full border-2 border-white border-l-blue-700 animate-spin duration-[2000s]"
            v-if="loginLoader && errorMessage === ''"
          ></p>
          <span>{{$t('Register')}}</span>
        </BaseButton>
          </div>
        </div>
      </form>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseButton from '@/components/base/BaseButton.vue'
// import BaseInput from '@/components/base/BaseInput.vue'
const student = ref({
  first_name: "",
  middle_name: "",
  last_name: "",
  age: null,
  gender: "Male",
  phone_number: "",
  email: "",
  grade_level: "",
  kefle_ketema: "",
  kebele: "",
  ketena: "",
});

const submitForm = () => {
  console.log(student.value);
  // Add your API call or logic to handle form submission here
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
