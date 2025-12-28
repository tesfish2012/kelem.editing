<script setup>
import { reactive} from 'vue'
import NavItems from '@/constants/open/index.js'
import BaseLoader from "@/components/base/BaseLoading.vue"
import { useMainStore } from '@/stores/index.js'
const store = useMainStore()
import NavigationBar from '@/components/open/NavigationBar.vue'
import FooterCard from '@/components/open/FooterComponent.vue'

const items = reactive(NavItems.headerNavs)
// const sub_items = reactive(NavItems.SUB_MENUS)
</script>

<template>
  <main>
    <navigation-bar :items="items" ></navigation-bar>
     <base-loader class=" bg-white mx-auto my-auto" v-if="store.isComponentLoading"></base-loader>
     <router-view v-else></router-view>
    <footer-card></footer-card>
  </main>
</template>
