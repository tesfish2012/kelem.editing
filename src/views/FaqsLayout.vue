<script setup>
import { ref, onMounted } from 'vue'
import FAQsService from '@/services/FAQsService'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const { language } = storeToRefs(useAuthStore())
const faqs = ref([])
const getAllFaqs = async () => {
  const response = await FAQsService.getFaqs()
  if (response.success) {
    faqs.value = response.data.map((item) => ({
      ...item,
      question: JSON.parse(item.question),
      answer: JSON.parse(item.answer)
    }))
  }
}

const faqIndex = ref(null)

const toggleAccordion = (index) => {
  faqIndex.value = faqIndex.value === index ? '' : index
}
onMounted(getAllFaqs)
</script>

<template>
  <section class="w-full bg-[#288fb2]/10  md:py-4">
    <!-- <img
      src="@/assets/faqs.jpg"
      alt=""
      class="absolute inset-0 object-cover object-center w-full h-full"
    /> -->

    <div class="px-[1%] md:px-[7%] py-2">
      <div
        class="w-full grid grid-cols-2 h-[140px] bg-[#288fb2] items-center justify-center place-content-center rounded-xl px-[2%] md:px-[4%]"
      >
        <h1 class="text-4xl text-white">{{ $t('FAQs') }}</h1>
      </div>
    </div>
  </section>

  <div class="px-[2%] md:px-[10%] grid grid-cols-1 gap-6 py- md:py-8">
    <ul class="grid grid-cols-1 gap-6 w-full">
      <li v-for="(faq, index) in faqs" :key="index" class="w-full">
        <button
          class="w-full  border border-t-0 border-r-0 border-l-0 rounded p-2 flex flex-col"
          @click="toggleAccordion(index)"
          :class="[{ 'bg-[#288FB2]/30x bg-[#F5F5F5]': faqIndex === index }]"
        >
          <div :class="['w-full flex justify-between font-semibold']">
            <!-- <span
              :class="[
                'w-6 text-center flex items-center justify-center h-6 text-sm rounded-full border',
                { 'text-[#288FB2] bg-white': faqIndex === index }
              ]"
              >{{ index < 10 ? '0' + index : index }}</span
            > -->
            <p class="text-[20px]">{{ language === 'en' ? faq.question.en : faq.question.ti }}</p>
            <span v-if="faqIndex != index">+</span>
            <span v-else class="text-[#288FB2] w-6 h-6 rounded-full border bg-white">-</span>
          </div>
          <!-- <transition name="accordion"> -->
          <p v-show="faqIndex === index" class="py-6 text-smz panel text-black/95">
            {{ language === 'en' ? faq.answer.en : faq.answer.ti }}
          </p>
          <!-- </transition> -->
        </button>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.img-1 {
  animation: img-spin 2s linear infinite;
}

@keyframes img-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.img-2 {
  animation: svg-spin 5s linear infinite;
}
@keyframes svg-spin {
  0% {
    transform: rotate(0deg);
    top: 20%;
  }
  25% {
    transform: rotate(90deg);
    top: 40%;
    right: 30%;
  }
  50% {
    transform: rotate(270deg);
    top: 60%;
    right: 10%;
  }
  100% {
    transform: rotate(360deg);
    top: 0%;
    right: 0;
  }
}

.panelll {
  animation: faq 0.5s;
}

@keyframes faq {
  0% {
    height: 0%;
  }

  100% {
    height: 100%;
  }
}
</style>
