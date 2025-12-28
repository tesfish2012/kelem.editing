<template>
  <div class="scrollOverlay">
    <div :class="['clickableOverlay', variant]">
      <div
        v-escape="handleModalClose"
        :style="modalStyles"
        :class="['modal', variant]"
        class="rounded p-4"
      >
      <div class="relative rounded" :class="style">
        <div class="flex justify-between w-full bg-white p-2">
          <div class="flex-grow flex justify-between items-center">
            <slot>
              <div class="capitalize font-semibold text-lg tracking-wider">
                {{ title }}
              </div>
            </slot>
            <font-awesome-icon  @click="handleClose"  class="hover:bg-primaryBg cursor-pointer" icon="X"  />
          </div>
        </div>
          <slot name="component">
          </slot>
          <div
            class="flex justify-start text-xs tracking-widest text-textLight items-center"
            @click="handleModalClose"
          >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { closeModal } from "@/plugins/modal"
import {inject} from 'vue'

export default {

  props: {
    variant: {
      type: String,
      default: "center",
    },
    width: {
      type: Number,
      default: 600,
    },
   
    cbParams: {
      type: Object,
      default: () => ({}),
    },
    style: { type: String, default: "" },
  },

  computed: {
    modalStyles() {
      return { "--width": `${this.width}px` }
    },
  },
  methods: {

  },
  unmounted() {
    document.body.style.overflow = "visible"
  },
}
</script>

<style>
.scrollOverlay {
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.clickableOverlay {
  min-height: 100%;
  background: rgba(9, 30, 66, 0.54);
  overflow-y: auto;
}

.clickableOverlay.center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

.modal {
  display: inline-block;
  position: relative;
  width: 100%;
  background: #fff;
}
.modal.center {
  max-height: 100%;
  max-width: var(--width);
  border-radius: 3px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  animation: growModal 0.5s;
}
.modal.aside {
  min-height: 100vh;
  max-width: var(--width);
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  float: right;
  animation: slideLeftModal 0.5s;
}
@keyframes growModal {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes slideLeftModal {
  0% {
    transform: translate(100%);
  }
  100% {
    transform: translate(0%);
  }
}
</style>
