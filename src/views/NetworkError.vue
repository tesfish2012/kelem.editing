<script setup>
defineProps({
  resource: {
    type: String,
    required: true,
    default: 'Page'
  }
})
</script>
<template>
  <div class="grid w-full grid-cols-1 md:grid-cols-3 justify-between h-screen py-12 bg-[#1d4354]/5">
    <div class="relative bgs-green-500 overflow-hiddden">
      <img
        src="https://startp-next.envytheme.com/_next/static/media/shape1.754ca456.png"
        alt=""
        class="w-1/4 h-auto object-cover absolute top-0 left-1/4"
      /> 
    </div>
    <div class="py-12 flex flex-col items-center justify-center gap-4">
      <h1 class="text-center text-5xl font-semibold">OOPs!</h1>
       

      <p class="text-center text-xl" id="it">
        It looks like you are experiencing some network problem, please take a breath and
      </p>
      <router-link to="/" class="px-4 py-3 border border-meyla-color1 bg-white text-meyla-color1"
        >click here</router-link
      >
      to try again.
    </div>
    <div class="py-12 relative">
      <img
        src="https://startp-next.envytheme.com/_next/static/media/shape4.0580e2ef.svg"
        alt=""
        class="absolute top-0 right-1/2 h-auto img-2"
      />
    </div>
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
</style>
