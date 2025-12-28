<template>
  <div class="input-container relative flex flex-col">
    <input
      type="file"
      :accept="accept"
      @change="onFileChange($event)"
      class="absolute w-[1px] h-[1px] p-0 border-none focus:outline-meyla-color1"
      :class="fileClass"
      :id="label"
    />
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
      class="absolute top-1/2 transform -translate-y-1/2 left-4 text-whsite"
    />
    <label
      :for="label"
      v-if="label"
      class="font-semibold border border-meyla-color1 bg-white py-1 px-2 text-meyla-color1 self-start"
      >{{ label }}</label
    >
  </div>
</template>

<script setup>
// import { defineProps } from 'vue'
defineProps({
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: ''
  },
  fileClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['image-update'])

const onFileChange = ($event) => {
  $event.preventDefault()
  let file = $event.target.files[0]
  if (file) {
    emit('image-update', file)
  }
}
</script>
