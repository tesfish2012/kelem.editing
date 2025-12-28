<template>
  <div class="input-container relative w-full flex flex-col ">
    <label :for="label" v-if="label" class="font-semiboldz">{{ label }}</label>
    <input
      v-bind="$attrs"
      class=" w-full p-2 border-2 rounded focus:border-[#288FB2] focus:outline-none placeholder:text-[#288FB2]/70"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('handleFocus')"
      @blur="$emit('handleBlur')"
      @keyup.enter="$emit('handleEnter')"
      :class="inputClass"
      :id="label"
    />
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
      class="absolute top-1/2 transform -translate-y-1/2 left-4"
    />
  </div>
</template>

<script setup>
// import { defineProps } from 'vue'
defineProps({
  modelValue: {
    type: String,
    required: true,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
})

defineEmits(['handleFocus', 'handleBlur', 'handleEnter', 'update:modelValue'])
</script>
