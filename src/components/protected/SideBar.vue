<script setup>
import SIDEBARITEMS from '@/constants/protected'

defineEmits(['hideSidebar'])

defineProps({
  barClass: {
    type: String,
    default: ''
  }
})

const items = SIDEBARITEMS.ADMIN_TABS
</script>

<template>
  <aside :class="`${barClass} sidebar text-whitex bg-white border rounded-xl shadow-xl`">
    <div class="hidden md:flex items-center mb-4 h-[48px]">
      <img src="@/assets/logo.jpg" alt="Logo" class="w-20 h-20 rounded-full" />
      <!-- <p class="text-xl font-semibold ml-2">Meyla</p> -->
    </div>
    <div class="flex justify-between px-4 md:hidden items-center mb-4 h-[48px]">
      <img src="@/assets/logo.png" alt="Logo" class="w-[48px] rounded-full" />
      <button @click="$emit('hideSidebar')">
        <font-awesome-icon icon="times" class="text-lg"></font-awesome-icon>
      </button>
      <!-- <p class="text-xl font-semibold ml-2">Meyla</p> -->
    </div>
    <hr class="border-b border-0 border-[#288fb2]" />
    <ul class="flex flex-col max-h-screen overflow-auto items-centerz justify-center">
      <li v-for="(item, index) in items" :key="index" class="text-whiteX">
        <router-link
          :to="{ name: item.name }"
          :class="{
            'text-[#288fb2] font-bold  bg-white border-2 border-t-0 border-b-0 border-r-0 border-l-[#288fb2]':
              $route.name === item.name
          }"
          exact
          active-class=""
          class="py-1 px-2 rounded-lgx hover:bg-[#288fb2] hover:text-white transition-colors duration-200 flex gap-4"
          exact-path="true"
        >
          <font-awesome-icon v-if="item.icon" :icon="item.icon" class="bg-white rounded w-[10%]" />
          <span class="w-[90%]"> {{ $t(`${item.label}`) }}</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>
