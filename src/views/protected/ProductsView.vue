<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductService from '@/services/ProductService'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseFileInput from '@/components/base/BaseFileInput.vue'
import { BASE_AVATAR } from '@/config'

const product = ref({
  productTitle: { en: '', ti: '' },
  productDescription: { en: '', ti: '' },
  productImage: { en: '', ti: '' }
})
const editForm = ref({
  productTitle: { en: '', ti: '' },
  productDescription: { en: '', ti: '' },
  productImage: { en: '', ti: '' }
})
const newImageName = ref('')
const editImageName = ref('')
const products = ref([])
const searchProduct = ref('')
const isEditing = ref(false)
const showModal = ref(false)
const showEnglish = ref(true)

const toggleLanguage = () => {
  showEnglish.value = !showEnglish.value
}

const captureImage = (file) => {
  product.value.productImage = file
  newImageName.value = file.name
}

const editImage = (file) => {
  editForm.value.productImage = file
  editImageName.value = file.name
}

const saveProduct = async () => {
  const formData = new FormData()
  formData.append('productTitle', JSON.stringify(product.value.productTitle))
  formData.append('productDescription', JSON.stringify(product.value.productDescription))
  formData.append('productImage', product.value.productImage)

  try {
    const response = await ProductService.createNew(formData)
    if (response.success) {
      getAllProducts()
      resetForm()
    }
  } catch (error) {
    console.error(error)
  }
}

const getAllProducts = async () => {
  try {
    const response = await ProductService.getAllProducts()
    if (response.success) {
      products.value = response.data.map(item => ({
        ...item,
        productTitle: JSON.parse(item.productTitle),
        productDescription: JSON.parse(item.productDescription),
      }))
    }
  } catch (error) {
    console.error('Failed to fetch products', error)
  }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await ProductService.deleteProduct(id)
      if (response.success) {
        getAllProducts()
      }
    } catch (error) {
      console.error('Failed to delete product', error)
    }
  }
}

const editProduct = (product) => {
  isEditing.value = true
  editForm.value = { ...product }
  showModal.value = true
}

const submitEdit = async () => {
  const formData = new FormData()
  formData.append('productTitle', JSON.stringify(editForm.value.productTitle))
  formData.append('productDescription', JSON.stringify(editForm.value.productDescription))
  formData.append('productImage', editForm.value.productImage)

  try {
    const response = await ProductService.updateProduct(editForm.value._id, formData)
    if (response.success) {
      getAllProducts()
      closeModal()
    }
  } catch (error) {
    console.error('Failed to edit product', error)
  }
}

const resetForm = () => {
  product.value = {
    productTitle: { en: '', ti: '' },
    productDescription: { en: '', ti: '' },
    productImage: { en: '', ti: '' }
  }
  newImageName.value = ''
  isEditing.value = false
  editImageName.value = ''
  editForm.value = {
    productTitle: { en: '', ti: '' },
    productDescription: { en: '', ti: '' },
    productImage: { en: '', ti: '' }
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const filteredProducts = computed(() => {
  if (searchProduct.value) {
    return products.value.filter(product => {
      return Object.values(product).some(value => {
        return value.toString().toLowerCase().includes(searchProduct.value.toLowerCase())
      })
    })
  }
  return products.value
})

onMounted(getAllProducts)
</script>

<template>
  <section class="w-full py-12 grid grid-cols-1 md:grid-cols-12 place-items-start gap-2 bg-gray-50">
    <div class="col-span-8 flex flex-col items-center bg-white">
      <div class="self-end py-2">
        <base-input
          inputClass="outline-none bg-white border-2 border-meyla-color1"
          type="search"
          class="px-2"
          v-model="searchProduct"
          placeholder="Search ..."
        ></base-input>
      </div>
      <div class="grid grid-cols-2 gap-4 p-4 place-items-starty">
        <div v-for="(product, index) in filteredProducts" :key="index" class="bg-gray-50 px-4 py-2">
          <div class="flex flex-col gap-4 py-8">
            <div class="max-w-[600px]">
              <img
                :src="BASE_AVATAR + `${product.productImage}`"
                alt="product image"
                width="100px"
                height="100px"
                class="w-full max-h-[200px] object-cover"
              />
            </div>
            <div class="w-3/4">
              <h1 class="font-semibold">{{ showEnglish ? product.productTitle.en : product.productTitle.ti }}</h1>
              <p class="text-sm whitespace-normal break-all">{{ showEnglish ? product.productDescription.en : product.productDescription.ti }}</p>
            </div>
          </div>
          <div class="flex gap-8">
            <button class="text-blue-500" @click="editProduct(product)">Edit</button>
            <button class="text-red-500" @click="deleteProduct(product._id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-4 flex flex-col gap-4 bg-white p-4">
      <h1 class="text-center meyla-subtitle">Add Product</h1>
      <form @submit.prevent="saveProduct" class="mx-auto flex flex-wrap gap-4">
        <BaseInput
          v-model="product.productTitle.en"
          type="text"
          inputClass=" px-8 py-3"
          required
          placeholder="Product Title (English)"
        ></BaseInput>
        <BaseInput
          v-model="product.productTitle.ti"
          type="text"
          inputClass=" px-8 py-3"
          required
          placeholder="Product Title (Tigrinya)"
        ></BaseInput>
        <BaseTextarea
          v-model="product.productDescription.en"
          rows="4"
          textareaClasses=""
          placeholder="Product Description (English)"
        ></BaseTextarea>
        <BaseTextarea
          v-model="product.productDescription.ti"
          rows="4"
          textareaClasses=""
          placeholder="Product Description (Tigrinya)"
        ></BaseTextarea>
        <div class="flex flex-col md:flex-row">
          <BaseFileInput
            @image-update="captureImage($event)"
            label="Upload Image"
            class="inline"
          ></BaseFileInput>
          <h2>{{ newImageName }}</h2>
        </div>
        <BaseButton type="submit">Save product</BaseButton>
      </form>
    </div>
  </section>
  <div class="modal fixed inset-0 flex z-30 justify-center items-center bg-white/80 overflow-auto" v-if="showModal">
    <div class="bg-white/100 flex flex-col gap-3 shadow p-2 md:p-6 overflow-auto">
      <button @click="closeModal" class="self-end text-red-500">X</button>
      <form @submit.prevent="submitEdit" class="flex flex-col gap-4">
        <BaseInput
          v-model="editForm.productTitle.en"
          type="text"
          required
          inputClass="px-4 py-3"
          placeholder="Product Title (English)"
        ></BaseInput>
        <BaseInput
          v-model="editForm.productTitle.ti"
          type="text"
          required
          inputClass="px-4 py-3"
          placeholder="Product Title (Tigrinya)"
        ></BaseInput>
        <BaseTextarea
          v-model="editForm.productDescription.en"
          rows="4"
          textareaClasses=""
          placeholder="Product Description (English)"
        ></BaseTextarea>
        <BaseTextarea
          v-model="editForm.productDescription.ti"
          rows="4"
          textareaClasses=""
          placeholder="Product Description (Tigrinya)"
        ></BaseTextarea>
        <BaseFileInput
          @image-update="editImage($event)"
          label="Upload Image"
          class="inline"
        ></BaseFileInput>
        <h2>{{ editImageName }}</h2>
        <BaseButton type="submit">Save Changes</BaseButton>
      </form>
    </div>
  </div>
  <div class="fixed top-0 right-0 p-4 z-10">
    <BaseButton @click="toggleLanguage">{{ showEnglish ? 'Show Tigrinya' : 'Show English' }}</BaseButton>
  </div>
</template>
