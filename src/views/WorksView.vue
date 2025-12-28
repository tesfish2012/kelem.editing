<script setup>
// import SpinningCard from '@/components/open/SpinningCard.vue'
import slugify from '@/utils/slugify'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import ProductService from '@/services/ProductService'
import { BASE_AVATAR } from '@/config'

const products = ref([])
async function getProducts() {
  try {
    const response = await ProductService.getAllProducts()
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      return
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

onMounted(() => {
  getProducts()
})
</script>
<template>
  <section class="w-full">
    <div class="grid w-full grid-cols-1 md:grid-cols-3 justify-between bg-[#1d4354]/5">
      <div class="relative overflow-hiddden">
        <img
          src="https://startp-next.envytheme.com/_next/static/media/shape1.754ca456.png"
          alt=""
          class="w-1/4 h-auto object-cover absolute top-0 left-1/4 img-1"
        />
        <img
          src="https://startp-next.envytheme.com/_next/static/media/shape4.0580e2ef.svg"
          alt=""
          class="absolute right-0 img-2"
        />
      </div>
      <div class="py-12 flex flex-col items-center justify-center gap-4">
        <h1 class="text-center text-3xl font-semibold">Some of our products</h1>
        <!-- <SpinningCard /> -->

        <p class="text-center" id="it">
          Discover our diverse range of high-quality products. Explore the exceptional offerings
          available at meyla Business Group.
        </p>
      </div>
      <div class="py-12 relative">
        <img
          src="https://startp-next.envytheme.com/_next/static/media/shape4.0580e2ef.svg"
          alt=""
          class="absolute top-0 right-1/2 h-auto img-2"
        />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 px-[7%]">
      <div v-for="(product, index) in products" :key="index" class="relative group bg-[#1d4354]/5">
        <router-link
          :to="{ name: 'product-detail', params: { title: product.productTitle } }"
          class="block"
        >
          <div class="w-full h-[300px]">
            <img
              :src="BASE_AVATAR + `${product.productImage}`"
              :alt="`${product.productTitle}` + 'Image'"
              class="w-full h-full object-cover"
              loading="lazy"
            /></div
        ></router-link>
        <div
          class="flex flex-col gap-2 py-6 group-hover:shadow-lg group-hover:bg-white translation-all duration-1000 px-4 relative"
        >
          <div class="flex flex-col gap-4 py-2">
            <h1 class="meyla-subtitle">{{ product.productTitle }}</h1>

            <p class="text-gray-700 line-clamp-3"><span></span> {{ product.productDescription }}</p>
            <router-link
              :to="{ name: 'product-detail', params: { title: slugify(product.productTitle) } }"
              class="hover:text-meyla-color1 transition-colors duration-500"
              >Read More</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
