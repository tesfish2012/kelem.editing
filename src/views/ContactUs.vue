<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
//import SettingsService from '@/services/SettingsService'
import MessageService from '@/services/MessageService'

const router = useRouter()

// Contact form
let form = ref({
  email: '',
  fullName: '',
  phoneNumber: '',
  subject: '',
  message: ''
})

const socialMediaLinks = ref([
  { platform: 'Facebook', link: 'https://facebook.com/kelemediting' },
  { platform: 'LinkedIn', link: 'https://linkedin.com/company/kelemediting' },
  { platform: 'Twitter', link: 'https://twitter.com/kelemediting' }
])

const settings = ref([
  {
    address: 'Mekele, Awash Grand, Salem Tilahun, Kutr 110',
    contactNumber: '+251 911 111 111, +251 922 222 222',
    mail: 'info@kelemediting.com, support@kelemediting.com'
  }
])

const success = ref('')
const contactMessage = ref('')

// Submit contact form
const submitContact = async () => {
  try {
    const response = await MessageService.createMessage(form.value)
    if (response.success) {
      success.value = response.message
      form.value = { email: '', fullName: '', phoneNumber: '', subject: '', message: '' }
      setTimeout(() => (success.value = ''), 3000)
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      contactMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

// Load settings (optional, if you want dynamic loading)
onMounted(() => {
  // fetchLinks() or getSettings() if you want dynamic
})
</script>

<template>
  <section class="w-full bg-[#288fb2]/10">

    <!-- Header -->
    <div class="w-full grid grid-cols-1 md:grid-cols-2 md:h-[240px] bg-[#288fb2] items-center justify-center px-[1%] md:px-[10%]">
      <div class="flex flex-col gap-4 items-start justify-center text-white">
        <h1 class="text-xl font-semibold">Contact Us</h1>
        <p class="text-4xl font-bold">Reach out to Kelem Editing for professional services</p>
      </div>
      <img src="@/assets/contact_us.webp" alt="Kelem Editing" class="h-[240px] w-full object-cover" />
    </div>

    <!-- Contact Info Cards -->
    <div class="px-[1%] md:px-[10%] grid grid-cols-1 md:grid-cols-3 gap-4 py-12 bg-[#288fb2]/5">
      <!-- Address -->
      <div class="bg-white flex flex-col shadow-xl items-center py-6 gap-4 rounded-xl">
        <h1 class="text-2xl font-semibold">Head Office</h1>
        <p>{{ settings[0].address }}</p>
      </div>

      <!-- Contact Info -->
      <div class="bg-white flex flex-col shadow-xl items-center py-6 gap-4 rounded-xl">
        <h1 class="text-2xl font-semibold">Contact Information</h1>
        <p>Phone: {{ settings[0].contactNumber.split(',')[0] }}</p>
        <p v-if="settings[0].contactNumber.split(',')[1]">Alternate: {{ settings[0].contactNumber.split(',')[1] }}</p>
        <p>Email: {{ settings[0].mail.split(',')[0] }}</p>
        <p v-if="settings[0].mail.split(',')[1]">Alternate: {{ settings[0].mail.split(',')[1] }}</p>
      </div>

      <!-- Opening Hours -->
      <div class="bg-white flex flex-col shadow-xl items-center py-6 gap-4 rounded-xl">
        <h1 class="text-2xl font-semibold">Opening Hours</h1>
        <p>Mon – Fri 8:00 am - 4:30 pm</p>
      </div>
    </div>

    <!-- Contact Form & Map -->
    <section class="px-[1%] md:px-[10%] grid grid-cols-1 md:grid-cols-2 gap-6 py-12 bg-white">
      <!-- Contact Form -->
      <div class="flex flex-col gap-4 shadow-xl p-6 bg-[#f5f5f5] rounded-xl">
        <h1 class="text-lg font-bold">Write Us a Message</h1>
        <form @submit.prevent="submitContact" class="flex flex-col gap-4">
          <BaseInput v-model="form.fullName" label="Full Name" placeholder="Enter your full name" required />
          <BaseInput v-model="form.email" type="email" label="Email" placeholder="Enter your email" required />
          <BaseInput v-model="form.phoneNumber" label="Phone Number" placeholder="Enter your phone number" required />
          <BaseInput v-model="form.subject" label="Subject" placeholder="Enter the subject" required />
          <BaseTextarea v-model="form.message" label="Message" placeholder="Enter your message" required />
          <BaseButton type="submit">Submit</BaseButton>
        </form>
        <p v-if="success" class="text-green-600 font-bold text-sm">{{ success }}</p>
      </div>

      <!-- Google Map -->
      <div class="h-full w-full shadow-xl rounded-xl overflow-hidden">
        <iframe
          class="w-full h-full"
          frameborder="0"
          src="https://www.google.com/maps/embed/v1/place?q=Mekele+Awash+Grand+Salem+Tilahun+Kutr+110&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
        ></iframe>
      </div>
    </section>

    <!-- Social Media Links -->
    <section class="px-[1%] md:px-[10%] py-8 bg-[#288fb2]/10">
      <h1 class="text-xl md:text-2xl font-semibold text-center">Stay Connected</h1>
      <div class="flex justify-center gap-4 mt-4">
        <a v-for="(link, i) in socialMediaLinks" :key="i" :href="link.link" target="_blank" class="p-3 bg-white rounded-full flex items-center justify-center">
          <font-awesome-icon v-if="link.platform.toLowerCase() === 'linkedin'" :icon="['fab','linkedin']" class="text-2xl text-[#0762C8]" />
          <font-awesome-icon v-else-if="link.platform.toLowerCase() === 'facebook'" :icon="['fab','facebook']" class="text-2xl text-[#1877F2]" />
          <font-awesome-icon v-else-if="link.platform.toLowerCase() === 'twitter'" :icon="['fab','twitter']" class="text-2xl text-[#1DA1F2]" />
        </a>
      </div>
    </section>
  </section>
</template>
