<script setup>
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import SettingsService from '@/services/SettingsService'
import swal from 'sweetalert'
const settings = ref([])

async function getSettings() {
  try {
    const response = await SettingsService.getSettings()
    settings.value = response.data
  } catch (error) {
    // console.log(error)
  }
}

const socialMediaLinks = ref([])

const fetchLinks = async () => {
  const response = await SettingsService.getLinks()
  socialMediaLinks.value = response.data
  // alert(response.success)
}

const editForm = ref({})
const error = ref('')
const isEditing = ref(false)
const editInfographic = (infographic) => {
  isEditing.value = true
  editForm.value = infographic
}
const submitEdit = async () => {
  const response = await SettingsService.updateSettings(editForm.value.id, editForm.value)

  if (response.success) {
    isEditing.value = false
    swal({
      title: response.message,
      text: 'Editing infography.',
      icon: 'success'
    })
    getSettings()
  } else {
    error.value = response.message
  }
}

let editSocial = ref(false)
let addSocial = ref(false)

let editMediaForm = ref({})
let addMediaForm = ref({})

const addMedia = async () => {
  // settingID.value = id
  editSocial.value = false
  addSocial.value = true
}
const editMedia = async (link) => {
  editMediaForm.value = link
  editSocial.value = true
  addSocial.value = false
}

const submitMediaEdit = async () => {
  const response = await SettingsService.editMedia(editMediaForm.value.id, editMediaForm.value)
  if (response.success) {
    getSettings()
    editSocial.value = false
  }
}

const submitMediaAdd = async () => {
  // console.log(addMediaForm.value)
  const response = await SettingsService.addMedia(addMediaForm.value)
  if (response.success) {
    fetchLinks()
    addMediaForm.value = {}
    setTimeout(() => {
      addSocial.value = false
    }, 1000)

    swal({
      title: response.message,
      text: 'Adding new social link.',
      icon: 'success'
    })
  }
}

const deleteMedia = (socialId) => {
  swal({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this account',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  }).then((confirmDelete) => {
    if (confirmDelete) {
      SettingsService.deleteMedia(socialId).then((res) => {
        if (res.success) {
          fetchLinks()
          swal('Account has been deleted!', {
            icon: 'success'
          })
        }
      })
    }
  })
}

onMounted(() => {
  getSettings(), fetchLinks()
})
</script>

<template>
  <section class="w-full">
    <div class="flex flex-col gap-2 py-6">
      <div v-for="(setting, index) in settings" :key="index" class="w-full">
        <div class="flex gap-4 justify-end">
          <button
            @click="editInfographic(setting)"
            class="actions flex flex-col gap-2 p-4 bg-white"
          >
            <font-awesome-icon icon="edit" class="text-blue-500 text-lg"></font-awesome-icon>
          </button>
        </div>
        <div class="grid grid-cols-3 divide-x-2">
          <div class="address flex flex-col gap-4 p-4 bg-white">
            <h1 class="text-lg">Location:</h1>
            <p>{{ setting.address }}</p>
          </div>
          <div class="address flex flex-col gap-2 p-4 bg-white">
            <h1 class="text-lg font-semiboldd">Email:</h1>
            <div>
              <p>{{ setting.mail }}</p>
            </div>
          </div>
          <div class="address flex flex-col gap-2 p-4 bg-white">
            <h1 class="text-lg font-semiboldd">Contact Numbers:</h1>
            <div class="">
              <p>{{ setting.contactNumber }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="address flex flex-col gap-2 p-4 bg-white shadow">
        <h1 class="text-lg font-semiboldd">Social Media Accounts</h1>
        <div class="flex flex-col justify-between">
          <div class="w-full flex justify-end">
            <button
              @click="addMedia"
              class="flex items-center justify-center bg-[#288fb2] text-white"
            >
              <font-awesome-icon icon="plus" class="text-white text-sm"></font-awesome-icon>
              Add
            </button>
          </div>

          <div class="w-full flex justify-between pt-4">
            <h1 class="text-lg font-semibold">Platform</h1>
            <h1 class="text-lg font-semibold">Link</h1>
            <h1 class="text-lg font-semibold">Actions</h1>
          </div>
          <div v-for="(link, i) in socialMediaLinks" :key="i" class="w-full flex justify-between">
            <div>
              <a :href="link.link" target="_blank">{{ link.platform }} </a>
            </div>
            <div>
              <a :href="link.link" target="_blank">{{ link.link }} </a>
            </div>
            <div class="flex gap-4">
              <button @click="editMedia(link)">
                <font-awesome-icon
                  icon="edit"
                  class="text-blue-700"
                  title="Edit Account"
                ></font-awesome-icon>
              </button>
              <button @click="deleteMedia(link.id)">
                <font-awesome-icon
                  icon="trash"
                  class="text-red-700"
                  title="Delete Account"
                ></font-awesome-icon>
              </button>
            </div>
          </div>

          <section
            class="fixed z-50 inset-0 bg-black/70 modal w-full h-full flex items-center justify-center"
            v-if="editSocial"
          >
            <form
              @submit.prevent="submitMediaEdit"
              class="bg-white/100 flex h-auto w-[90%] md:w-1/2 p-6 flex-col gap-2"
            >
              <BaseInput
                v-model="editMediaForm.link"
                type="text"
                inputClass=""
                label="Link"
              ></BaseInput>
              <BaseButton type="submit">Save Change</BaseButton>
            </form>
          </section>
          <section class="w-full py-4" v-if="addSocial">
            <form
              @submit.prevent="submitMediaAdd"
              class="bg-white/100 flex w-full h-auto flex-col gap-2"
            >
              <BaseInput
                v-model="addMediaForm.platform"
                type="text"
                inputClass=""
                label="Platform"
              ></BaseInput>
              <BaseInput
                v-model="addMediaForm.link"
                type="text"
                inputClass=""
                label="link"
              ></BaseInput>
              <BaseButton type="submit" class="self-start">Save</BaseButton>
            </form>
          </section>
        </div>
      </div>
    </div>
  </section>
  <section
    class="fixed inset-0 z-50 bg-black/70 modal flex justify-center overflow-auto w-full"
    v-if="isEditing"
  >
    <div class="bg-white/100 h-auto flex flex-col md:w-1/2 gap-2 p-4 shadow md:px-12 md:py-4">
      <button class="text-lg text-red-500 self-end" @click="isEditing = !isEditing">X</button>
      <h>Edit About us</h>
      <p v-if="error" class="text-red-400">{{ error }}</p>
      <form @submit.prevent="submitEdit" class="bg-white/100 flex w-full h-auto flex-col gap-4">
        <BaseInput v-model="editForm.address" type="text" inputClass="" label="Address"></BaseInput>
        <div>
          <BaseInput
            v-model="editForm.mail"
            type="text"
            inputClass="border"
            label="Email"
          ></BaseInput>
        </div>
        <div>
          <!-- <h1 class="">Contact Number</h1> -->
          <BaseInput
            v-model="editForm.contactNumber"
            type="text"
            inputClass=""
            label="Contact Number"
          ></BaseInput>
        </div>

        <BaseButton type="submit">Save Changes</BaseButton>
      </form>
    </div>
  </section>
</template>
<style>
.modal {
  animation: modal 0.3s;
}

@keyframes modal {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
