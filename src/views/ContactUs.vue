<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// import SpinningCard from '@/components/open/SpinningCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import SettingsService from '@/services/SettingsService'

// import Map from '@/components/map/MapC.vue'
import MessageService from '@/services/MessageService'

// const comments = ref([])
let form = ref({
  email: '',
  fullName: '',
  phoneNumber: '',
  subject: '',
  message: ''
})

const socialMediaLinks = ref([])

const fetchLinks = async () => {
  const response = await SettingsService.getLinks()
  socialMediaLinks.value = response.data
  // alert(response.data.length)
}

const settings = ref([])
async function getSettings() {
  try {
    const response = await SettingsService.getSettings()
    settings.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      settings.value = []
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
// posting new contact-us/message
const success = ref('')
const contactMessage = ref('')
// import { useToast } from 'vue-toastify'

async function submitContact() {
  try {
    const response = await MessageService.createMessage(form.value)
    console.log(response.data)
    if (response.success) {
      success.value = response.message
      form.value = {}
      contactMessage.value = ''
      // const toast = useToast()
      // toast.success('This is a success message!', {
      //   position: 'top-right',
      //   duration: 3000 // 3 seconds
      // })

      setTimeout(() => {
        success.value = ''
      }, 3000)
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      contactMessage.value = error.response.data.message
    } else {
      setTimeout(() => {
        router.push({ name: 'NetworkError' })
      }, 5000)
    }
  }
}
// Fetch the comments from the server on component mount
onMounted(() => {
  getSettings(), fetchLinks()
})
</script>

<template>
  <section class="w-full bg-[#288fb2]/10">
    <div
      class="w-full grid grid-cols-1 md:grid-cols-2 md:h-[240px] bg-[#288fb2] items-center justify-center place-content-center px-[1%] md:px-[10%]"
    >
      <div class="flex flex-col gap-4 items-centerx justify-center">
        <h1 class="text-xl text-white/80">{{ $t('Contact Us') }}</h1>
        <p class="text-white text-4xl">{{ $t('Contact us for comprehensive business') }}</p>
      </div>
      <img src="@/assets/contact_us.webp" alt="" class="h-[240px] w-full object-cover" />
    </div>
    <div
      class="px-[1%] md:px-[10%] grid grid-cols-1 md:grid-cols-3 gap-4 itemss-center justify-center py-4 md:py-12 bg-[#288fb2]/5 overflow-hidden"
    >
      <div
        class="bg-white w-full flex flex-col shadow-xl items-center py-6 gap-4 group rounded-tr-fullx"
        data-aos="fade-right"
      >
        <!-- <font-awesome-icon icon="map-marker-alt" class="text-2xl p-4"></font-awesome-icon> -->

        <h1 class="text-2xl font-semibold">{{ $t('Head Office') }}</h1>
        <div class="font-extralight p-d6 flex gap-1 items-center">
          <font-awesome-icon icon="map-marker-alt" class="text-"></font-awesome-icon>
          <p v-for="(setting, index) in settings" :key="index">{{ setting.address }}</p>
        </div>
      </div>
      <div
        class="bg-white flex flex-col shadow-xl items-center py-6 gap-4 group *:"
        data-aos="fade-down"
      >
        <h1 class="text-2xl font-semibold">{{ $t('Contact Information') }}</h1>
        <div class="flex flex-col">
          <div class="font-extralight">
            <div v-for="(setting, index) in settings" :key="index">
              <div class="flex gap-1 items-center">
                <font-awesome-icon icon="phone" class="p-2 text-"></font-awesome-icon>
                <p>{{ setting.contactNumber.split(',')[0] }}</p>
              </div>
              <div class="flex gap-1 items-center" v-if="setting.contactNumber.split(',')[1]">
                <font-awesome-icon icon="phone" class="p-2 text-"></font-awesome-icon>
                <p>{{ setting.contactNumber.split(',')[1] }}</p>
              </div>
            </div>
          </div>
          <div class="font-extralight">
            <div v-for="(setting, index) in settings" :key="index" class="flex flex-col gap-2">
              <div class="flex items-center justify-center">
                <font-awesome-icon icon="envelope" class="p-2 text-"></font-awesome-icon>
                <p>{{ setting.mail.split(',')[0] }}</p>
              </div>
              <div>
                <font-awesome-icon
                  icon="envelope"
                  class="p-4 text-2xl"
                  v-if="setting.mail.split(',')[1]"
                ></font-awesome-icon>
                <p>{{ setting.mail.split(',')[1] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-white flex flex-col shadow-xl items-center py-6 gap-4 group rounded-tl-fullx *:"
        data-aos="fade-left"
      >
        <!-- <font-awesome-icon
          icon="clock"
          class="p-4 text-2xl"
        ></font-awesome-icon> -->
        <h1 class="text-2xl font-semibold">{{ $t('Opening Hours') }}</h1>
        <div class="font-extralight flex gap-1 items-center">
          <font-awesome-icon icon="clock" class="text-"></font-awesome-icon>
          <p>Mon – Fri 8:00 am-4:30 pm</p>
        </div>
      </div>
    </div>

    <section
      class="px-[1%] md:px-[10%] grid grid-cols-1 md:grid-cols-2 gap-6 py-4 md:py-12 bg-white"
    >
      <div class="flex flex-col gap-2 items-center bg-[#f5f5f5]x shadow-xl p-2 md:p-6">
        <h1 class="meyla-subtitlex text-[16px] w-[90%] md:w-full font-bold text-whitex">
          {{ $t('WRITE US A MESSAGE') }}
        </h1>
        <form @submit.prevent="submitContact" class="flex flex-col gap-2 w-[90%] md:w-full">
          <base-input
            v-model="form.fullName"
            input-class="bg-[#288FB2] text-black border bg-white xoutline-none"
            :placeholder="$t('Name')"
            :label="$t('Name')"
            required
          ></base-input>
          <base-input
            v-model="form.email"
            input-class="bg-[#288FB2x] text-black border bg-white xoutline-none"
            :placeholder="$t('Email')"
            :label="$t('Email')"
            type="email"
            required
          ></base-input>
          <base-input
            v-model="form.subject"
            input-class="bg-[#288FB2] text-black border bg-white xoutline-none "
            :placeholder="$t('Subject')"
            :label="$t('Subject')"
            required
          ></base-input>
          <base-textarea
            textareaClass="bg-[#288fb2] text-black border bg-white xoutline-none "
            :placeholder="$t('Message')"
            v-model="form.message"
            :label="$t('Message')"
            required
          ></base-textarea>
          <base-button type="submit" class="text-black">{{ $t('SUBMIT') }}</base-button>
        </form>
        <p v-if="success" class="text-white font-bold text-sm">*{{ success }}</p>
      </div>

      <div
        style="
          text-decoration: none;
          overflow: hidden;
          max-width: 100%;
          width: 100%;
          height: 300pxx;
        "
        class="bg-[#f5f5f5]x h-full w-full shadow-xl p-2 md:p-6 flex flex-col gap-2"
      >
        <h1 class="text-[16px] w-[90%] md:w-full font-bold text-whitex">
          {{ $t('VISIT US AT:') }}
        </h1>
        <div
          id="g-mapdisplay"
          style="height: 100%; width: 100%; max-width: 100%"
          class="bg-[#f5f5f5]"
        >
          <iframe
            style="height: 100%; width: 100%; border: 0"
            frameborder="0"
            src="https://www.google.com/maps/embed/v1/place?q=Kaleb+Academy&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
          ></iframe>
        </div>
        <a
          class="google-map-html text-sm"
          rel="nofollow"
          href="https://kbj9qpmy.com/bp"
          id="make-map-infor-mation"
          >{{ $t('Kaleb Academy physical location') }}</a
        >
      </div>
    </section>

    <section class="px-[1%] md:px-[10%] w-full py-4 bg-[#288FB2]/10">
      <div class="flex flex-col justify-center items-center gap-4 p-6">
        <div class="flex flex-col items-center justify-center">
          <h1 class="text text-xl md:text-2xl font-semibold">{{ $t('Stay connected with us') }}</h1>
          <hr class="w-3/4 bg-[#288FB2] h-[2px]" />
        </div>
        <div class="flex gap-4">
          <a
            v-for="(link, i) in socialMediaLinks"
            :key="i"
            :href="link.link"
            class="px-3 py-2 flex items-center justify-center rounded-full border bg-white"
            target="_blank"
          >
            <font-awesome-icon
              v-if="link.platform.toLowerCase() === 'linkedin'"
              :icon="['fab', 'linkedin']"
              class="text-2xl text-[#0762C8]"
            ></font-awesome-icon>
            <font-awesome-icon
              v-else-if="link.platform.toLowerCase() === 'facebook'"
              :icon="['fab', 'facebook']"
              class="text-lg text-[#1877F2]"
            ></font-awesome-icon>
            <font-awesome-icon
              v-else-if="link.platform.toLowerCase() === 'twitter'"
              :icon="['fab', 'twitter']"
              class="text-lg text-[#1DA1F2]"
            ></font-awesome-icon
          ></a>
        </div>
      </div>
    </section>
  </section>
</template>
