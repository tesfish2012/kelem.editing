<template>
  <button class="px-2 py-1 text-white bg-[#288FB2]" v-bind="$attrs">
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
      class="absolute top-1/2 transform -translate-y-1/2 left-4 text-white"
    />
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  buttonClass: {
    type: String,
    default: ''
  }
})
</script>
