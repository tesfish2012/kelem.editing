<template>
    <div>
      <!-- Editor Section -->
      <section class="w-full p-12">
        <Editor v-model="content" :extensions="extensions" class="border p-4 mb-4" />
        <div class="flex justify-center">
          <button @click="submitContent" class="bg-blue-500 text-white px-4 py-2">Submit</button>
        </div>
      </section>
  
      <!-- Display Section -->
      <section class="w-full p-12">
        <h2 class="text-xl font-bold mb-4">Submitted Content</h2>
        <div v-html="content" class="border p-4"></div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Editor from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Heading from '@tiptap/extension-heading'
  import ListItem from '@tiptap/extension-list-item'
  import BulletList from '@tiptap/extension-bullet-list'
  import OrderedList from '@tiptap/extension-ordered-list'
  
  const content = ref('<p>I\'m running Tiptap with Vue.js. 🎉</p>')
  const extensions = [
    StarterKit,
    Heading.configure({ levels: [1, 2, 3] }),
    ListItem,
    BulletList,
    OrderedList
  ]
  
  const submitContent = () => {
    // Do something with the content
    console.log(content.value)
  }
  </script>
  
  <style>
  /* Add any custom styles you need */
  </style>
  