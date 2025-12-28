<script setup>
// import { ref } from 'vue'/
import DataTable from '@/components/base/DataTable.vue'
import MessageService from '@/services/MessageService'
// import BaseInput from '@/components/base/BaseInput.vue'
// import BaseTextarea from '@/components/base/BaseTextarea.vue'
// import BaseButton from '@/components/base/BaseButton.vue'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'

// import { useRouter } from 'vue-router'
const tableHeaders = [
  // { label: 'Id', field: 'id' },

]
const subscribers = ref([])
const actions = [
  {
    label: 'edit',
    action: editSubscriber,
    icon: 'edit',
    style: 'hover:cursor-pointer text-blue-500 py-1 px-2'
  },
  {
    label: 'delete',
    action: deleteSubscriber,
    icon: 'trash',
    style: 'hover:cursor-pointer text-red-500 py-1 px-2'
  }
]
async function getAllSubscribers() {
  const response = await MessageService.getSubscribers()
  if (response.success) {
    subscribers.value = response.data
  }
}

const isEditing = ref(false)
const editForm = ref(null)
let formatDate = ref('')
function editSubscriber(subscriber) {
  isEditing.value = true
  editForm.value = subscriber
  formatDate.value = dayjs(editForm.value.eventDate).format('YYYY-MM-DD')
}

async function deleteSubscriber(subscriber) {
  const response = await MessageService.deleteSubscriber(subscriber.id)
  if (response.success) {
    getAllSubscribers()
  }
}
// const router = useRouter()

// async function submitEdit() {
//   const response = await MessageService.editSubscriber(editForm.value, editForm.value._id)
//   if (response.success) {
//     isEditing.value = false
//     getAllSubscribers()
//     editForm.value = {}
//   }
// }
onMounted(getAllSubscribers)
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex justify-between w-full">
      <h2 class="text-xl font-bold">{{$t('Subscribers')}}</h2>
      <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]"></font-awesome-icon>
    </div>
    <DataTable :tableHeaders="tableHeaders" :tableValues="subscribers" :actions="actions">
    </DataTable>
  </section>
  <!-- <div
    class="modal fixed inset-0 flex z-30 justify-center items-center bg-white/80 overflow-auto py-12"
    v-if="isEditing"
  > -->
  <!-- <div
      class="bg-white/100 flex flex-col gap-3 justify-center items-center shadow p-2 overflow-auto"
    >
      <button @click="isEditing = !isEditing" class="self-end text-2xl text-red-500">X</button>

      <form @submit.prevent="submitEdit" class="flex flex-col gap-4 px-2">
        <BaseInput
          v-model="editForm.email"
          type="text"
          label="Email"
          required
          inputClass="px-4 py-3"
        ></BaseInput>

        <BaseButton type="submit">Save Changes</BaseButton>
      </form>
    </div> -->
  <!-- </div> -->
</template>
