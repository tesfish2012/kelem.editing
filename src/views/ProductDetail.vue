<script setup>
// import SpinningCard from '@/components/open/SpinningCard.vue'
import slugify from '@/utils/slugify'
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
// import dayjs from 'dayjs'
import ProductService from '@/services/ProductService'
import { BASE_AVATAR } from '@/config'
defineProps({
  title: {
    type: String,
    required: true
  }
})

const route = useRoute()
const product = ref({})
const router = useRouter()
async function getProduct() {
  try {
    const response = await ProductService.getProductByTitle(route.params.title)
    if (response.success) {
      product.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      router.push({ name: '404resource', params: { resource: 'Product' } })
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}

// function formattedDate(date) {
//   return dayjs(date).locale('en').format('MMMM D, YYYY')
// }

const products = ref([])
async function getProducts() {
  try {
    const response = await ProductService.getAllProducts()
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data) {
      router.push({ name: '404resource', params: { resource: 'Product' } })
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}
watchEffect(() => {
  if (route.params.title) {
    getProduct()
  }
})
onMounted(() => {
  getProducts()
})
</script>
<template>
  <section class="w-full">
    <div class="grid w-full grid-cols-1 md:grid-cols-4 justify-between bg-[#1d4354]/5">
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
      <div class="py-12 flex flex-col items-center col-span-2 justify-center gap-4">
        <h1 class="text-2xl font-semibold">{{ product.productTitle }}</h1>
        <!-- <SpinningCard /> -->
      </div>
      <div class="py-12 relative">
        <img
          src="https://startp-next.envytheme.com/_next/static/media/shape4.0580e2ef.svg"
          alt=""
          class="absolute top-0 right-1/2 h-auto img-2"
        />
      </div>
    </div>
    <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-4 py-12 bg-[#1d4354]/5 px-[7%]">
      <div class="relative w-full flex flex-col group md:col-span-8">
        <div class="w-full max-h-[600px] overflow-hiddden">
          <img
            v-if="product.productImage"
            :src="BASE_AVATAR + `${product.productImage}`"
            alt="My company"
            class="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <img
            v-else
            src="https://startp-next.envytheme.com/_next/static/media/blog1.9ce379ec.jpg"
            alt="News picture"
            class="h-[300px] w-full object-cover block"
          />
        </div>

        <div
          class="flex w-full flex-col gap-2 py-6 bg-white translation-all duration-1000 px-4 relative"
        >
          <div class="flex gap-2 w-full">
            <div class="flex flex-col gap-4 py-2">
              <h2 class="meyla-subtitle whitespace-normal break-al">{{ product.productTitle }}</h2>
              <p class="text-gray-700"><span> </span> {{ product.productDescription }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:col-span-4 flex-wrap">
        <div class="bg-white flex flex-col gap-4 py-4 px-2">
          <h2 class="meyla-subtitle w-full">Our products</h2>
          <hr />
          <router-link
            v-for="product of products"
            :key="product._id"
            :to="{ name: 'product-detail', params: { title: slugify(product.productTitle) } }"
            class="flex gap-2 w-full"
          >
            <img
              :src="BASE_AVATAR + `${product.productImage}`"
              alt="event"
              class="w-14 h-auto object-cover"
              width="48px"
              height="48px"
            />
            <div>
              <h5 class="text-lg font-semibold">{{ product.productTitle }}</h5>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
