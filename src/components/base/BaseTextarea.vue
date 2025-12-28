<template>
  <div class="w-full">
    <label for="description" v-if="label" class="font-semibold">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :rows="rows"
      :cols="cols"
      id="description"
      :class="[
        `${textareaClass}`,
        'w-full  px-1 border-2 focus:border-[#288FB2] focus:outline-none placeholder:text-[#288FB2]/70'
      ]"
    ></textarea>
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
      class="absolute top-[16px] transform -tranlslate-y-1/2 left-4 texdt-white"
    />
  </div>
</template>

<script setup>
// import { defineProps } from 'vue'

// Define props
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter ...'
  },
  rows: {
    type: [String, Number],
    default: 3
  },
  cols: {
    type: [String, Number],
    default: 30
  },
  textareaClass: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
})
</script>
